import { useEffect } from 'react';
import { Stack, Loader, Center } from '@mantine/core';
import { useAccount } from 'wagmi';
import BoardRow from '../BoardRow';
import useBoards from './hooks/useBoards';

export default function Boards() {
  const { boards, fetchBoards, loading } = useBoards();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (address && isConnected) {
      fetchBoards(address).catch(err => console.error(err));
    }
  }, [address, isConnected, fetchBoards]);

  if (loading) {
    return <Center><Loader color="blue" type="bars" /></Center>;
  }

  if (address && isConnected) {
    if (boards.length > 0 || !loading) {
      return (
        <Stack>
          {boards.map(({ boardId, score, maxTile, availableForClaim }) => (
            <BoardRow key={boardId} id={boardId} score={score} tile={Number(maxTile)} availableForClaim={Number(availableForClaim)} />
          ))}
        </Stack>
      );
    }

    return <Center>No boards found</Center>;
  }

  return <Center>Connect your wallet</Center>;
}
