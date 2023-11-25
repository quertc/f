import { useState, useCallback } from 'react';
import { request, gql } from 'graphql-request';
import { readContracts } from 'wagmi';
import { AbiFunction } from 'abitype';
import RewardTokenABI from '../../../abis/RewardToken.json';

const { VITE_REWARD_ADDRESS, VITE_ENDPOINT_URL } = import.meta.env;

interface BoardEntry {
  boardId: number;
  score: number;
  maxTile: number;
  availableForClaim: bigint;
}

interface BoardIdsQueryResponse {
  createBoards: Array<{ boardId: number }>;
}

interface MovesQueryResponse {
  moves: Array<{ maxTile: number, totalScore: number, boardId: number }>;
}

export default function useBoards() {
  const [boards, setBoards] = useState<BoardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const getLastClaimedScore = useCallback(async (boardIds: number[]) => {
    const contractCalls = boardIds.map(boardId => ({
      address: VITE_REWARD_ADDRESS,
      abi: RewardTokenABI as AbiFunction[],
      functionName: 'getLastClaimedScore',
      args: [boardId],
    }));

    const data = await readContracts({ contracts: contractCalls });
    return new Map(data.map((response, index) => [boardIds[index], response.result as bigint || 0n]));
  }, []);

  const fetchBoardIds = useCallback(async (address: string) => {
    const BOARD_IDS_QUERY = gql`
      query BoardIds($address: Bytes!) {
        createBoards(where: { owner: $address }) {
          boardId
        }
      }`;

    const { createBoards } = await request<BoardIdsQueryResponse>(VITE_ENDPOINT_URL, BOARD_IDS_QUERY, { address });
    return createBoards.map(board => board.boardId);
  }, []);

  const fetchBoard = useCallback(async (boardId: number) => {
    const MOVES_QUERY = gql`
      query Moves($boardId: BigInt!) {
        moves(where: { boardId: $boardId }, first: 1, orderBy: totalScore, orderDirection: desc) {
          maxTile
          totalScore
          boardId
        }
      }`;

    const { moves } = await request<MovesQueryResponse>(VITE_ENDPOINT_URL, MOVES_QUERY, { boardId });
    return moves.length > 0 ? moves[0] : null;
  }, []);

  const fetchBoards = useCallback(async (address: string) => {
    try {
      setLoading(true);
      const boardIds = await fetchBoardIds(address);
      const highScoresPromises = boardIds.map(boardId => fetchBoard(boardId));
      const highScores = await Promise.all(highScoresPromises);
      const lastClaimedScoresResponses = await getLastClaimedScore(boardIds);

      const updatedBoards = highScores.reduce<BoardEntry[]>((boardsCollection, move) => {
        if (move && move.totalScore > 0) {
          const lastClaimedScore = lastClaimedScoresResponses.get(move.boardId) ?? 0n;
          boardsCollection.push({
            boardId: move.boardId,
            score: move.totalScore,
            maxTile: move.maxTile,
            availableForClaim: BigInt(move.totalScore) - lastClaimedScore,
          });
        }

        return boardsCollection;
      }, []);

      setBoards(updatedBoards);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching boards:', error);
      setLoading(false);
    }
  }, [fetchBoardIds, fetchBoard, getLastClaimedScore]);

  return { boards, fetchBoards, loading };
}
