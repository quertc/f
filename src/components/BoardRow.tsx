import { Center, Paper, Text, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import ClaimButton from './ClaimButton/ClaimButton';
import formatNumberWithComma from '../utils/formatNumber';

interface BoardRowInerface {
  tile: number;
  id: number;
  score: number;
  availableForClaim: number;
}

export default function BoardRow({ tile, id, score, availableForClaim }: BoardRowInerface) {
  const matches = useMediaQuery('(min-width: 480px)');

  return (
    <Flex justify="space-between" gap="lg" align="center">
      <Paper p="md" withBorder radius="md" style={{ minWidth: '72px', backgroundColor: '#cbbfb2', border: '5px solid #baac9f' }}>
        <Center>
          <Text fz="xl" fw="700" c="#766d64">{tile}</Text>
        </Center>
      </Paper>
      <Flex style={{ flexGrow: '1' }} justify="space-between" align={!matches ? 'flex-start' : 'center'} direction={!matches ? 'column' : 'row'}>
        <div>
          <Text fw="400" size="md" c="#080808" style={{ display: !matches ? 'none' : 'block' }}>Board ID</Text>
          <Text fw="400" size={matches ? 'xl' : 'lg'} c="#080808">
            #
            {id}
          </Text>
        </div>
        <div>
          <Text fw="400" size="md" c="#080808" style={{ display: !matches ? 'none' : 'block' }}>Score</Text>
          <Text fw="400" size={matches ? 'xl' : 'lg'} c="#080808">{matches ? formatNumberWithComma(score) : `Score: ${formatNumberWithComma(score)}`}</Text>
        </div>
      </Flex>
      <ClaimButton availableForClaim={availableForClaim} id={id} />
    </Flex>
  );
}

/* type TileValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048;
type Color = string;

const tileColors: Record<TileValue, Color> = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

function getColorForTile(value: TileValue): Color {
  return tileColors[value] || '#cdc1b4';
} */
