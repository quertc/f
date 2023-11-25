import { useState, useCallback } from 'react';
import { request, gql } from 'graphql-request';
import { readContracts } from 'wagmi';
import { AbiFunction } from 'abitype';
import RewardTokenABI from '../../../abis/RewardToken.json';
import Game2048ABI from '../../../abis/Game2048.json';

interface BoardEntry {
  boardId: number;
  score: number;
  maxTile: bigint;
  availableForClaim: bigint;
}

interface BoardIdsResponse {
  createBoards: Array<{ boardId: number }>;
}

interface HighScoreResponse {
  highScores: Array<{ score: number, boardId: number }>;
}

interface BoardResponse {
  maxTile: bigint;
}

export default function useBoards() {
  const [boards, setBoards] = useState<BoardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  function isBoardInfo(data: unknown): data is BoardResponse {
    const record = data as BoardResponse;
    return typeof record.maxTile === 'bigint';
  }

  const getLastClaimedScore = useCallback(async (boardIds: number[]) => {
    const contractCalls = boardIds.flatMap(boardId => [
      {
        address: import.meta.env.VITE_REWARD_ADDRESS as `0x${string}`,
        abi: RewardTokenABI as AbiFunction[],
        functionName: 'getLastClaimedScore',
        args: [boardId],
      },
      {
        address: import.meta.env.VITE_GAME48_ADDRESS as `0x${string}`,
        abi: Game2048ABI as AbiFunction[],
        functionName: 'getBoard',
        args: [boardId],
      },
    ]);

    const data = await readContracts({ contracts: contractCalls });
    const boardDataMap = new Map<number, { maxTile: bigint, lastClaimedScore: bigint }>();

    data.forEach((response, index) => {
      if (index % 2 === 0) {
        const boardId = boardIds[Math.floor(index / 2)];
        const lastClaimedScore = typeof response.result === 'bigint' ? response.result : 0n;
        const boardInfo = data[index + 1];

        let maxTile = 0n;

        if (boardInfo.status === 'success' && isBoardInfo(boardInfo.result)) {
          maxTile = boardInfo.result.maxTile;
        }

        boardDataMap.set(boardId, { maxTile, lastClaimedScore });
      }
    });

    return boardDataMap;
  }, []);

  const fetchBoardIds = useCallback(async (address: string) => {
    const BOARD_IDS_QUERY = gql`
      query BoardIds($address: Bytes!) {
        createBoards(where: { owner: $address }) {
          boardId
        }
      }`;

    const response: BoardIdsResponse = await request(import.meta.env.VITE_ENDPOINT_URL as string, BOARD_IDS_QUERY, { address });
    return response.createBoards.map(board => board.boardId);
  }, []);

  const fetchHighScore = useCallback(async (boardId: number) => {
    const HIGH_SCORE_QUERY = gql`
      query HighScore($boardId: BigInt!) {
        highScores(where: { boardId: $boardId }, orderBy: score, orderDirection: desc, first: 1) {
          score
          boardId
        }
      }`;

    const response: HighScoreResponse = await request(import.meta.env.VITE_ENDPOINT_URL as string, HIGH_SCORE_QUERY, { boardId });
    return response.highScores[0];
  }, []);

  const fetchBoards = useCallback(async (address: string) => {
    try {
      setLoading(true);
      const boardIds = await fetchBoardIds(address);

      const highScoresPromises = boardIds.map(boardId => fetchHighScore(boardId));
      const highScores = await Promise.all(highScoresPromises);

      const lastClaimedScoresResponses = await getLastClaimedScore(boardIds);

      const updatedBoards = highScores.map(highScore => {
        const boardData = lastClaimedScoresResponses.get(highScore.boardId);
        const lastClaimedScore = boardData?.lastClaimedScore ?? 0n;
        const maxTile = boardData?.maxTile ?? 0n;

        return {
          boardId: highScore.boardId,
          score: Number(highScore.score),
          maxTile,
          availableForClaim: BigInt(highScore.score) - lastClaimedScore,
        };
      });

      setBoards(updatedBoards);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching boards:', error);
      setLoading(false);
    }
  }, [fetchBoardIds, fetchHighScore, getLastClaimedScore]);

  return { boards, fetchBoards, loading };
}
