import { Button, Tooltip } from '@mantine/core';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import classes from './ClaimButon.module.css';
import formatNumberWithComma from '../../utils/formatNumber';
import RewardTokenABI from '../../abis/RewardToken.json';

interface ClaimButtonInterface {
  availableForClaim: number;
  id: number;
}

interface PrepareErrorInterface {
  cause?: {
    data: {
      errorName: string;
    };
  };
}

export default function ClaimButton({ availableForClaim, id }: ClaimButtonInterface) {
  const {
    config,
    error: prepareError,
  } = usePrepareContractWrite({
    address: import.meta.env.VITE_REWARD_ADDRESS as `0x${string}`,
    abi: RewardTokenABI,
    functionName: 'claim',
    args: [id],
  });

  const { data, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      notifications.show({
        title: 'Successfully claimed',
        message: `https://goerli-explorer.modulargames.xyz/tx/${data?.hash}`,
      });
    }
  }, [isSuccess, data]);

  const getButtonText = () => {
    if (isLoading) return 'Claiming...';
    if (isSuccess || (prepareError as PrepareErrorInterface)?.cause?.data.errorName === 'NoNewScoreToClaim') return 'Claimed';

    return 'Claim';
  };

  return (
    <Tooltip
      position="right"
      label={`${formatNumberWithComma(availableForClaim)} to claim${availableForClaim > 0 ? '!' : ' :('}`}
      offset={{ mainAxis: 12, crossAxis: 0 }}
    >
      <Button
        className={classes.button}
        variant="gradient"
        gradient={{ from: 'blue', to: 'orange', deg: 90 }}
        size="md"
        style={{ minWidth: 126 }}
        disabled={availableForClaim === 0 || !write || isLoading || isSuccess}
        onClick={() => write?.()}
      >
        {getButtonText()}
      </Button>
    </Tooltip>
  );
}
