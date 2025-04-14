import { useMemo } from 'react';
import { useAccount } from 'wagmi';

const ADMIN_WALLETS = [
  '0x2b18a357C7599d5eD35342c75f31368D07417e69',
];

export const useIsAdmin = () => {
  const { address: walletAddress } = useAccount();
  const isAdmin = useMemo(() => {
    if (!walletAddress) return false;
    return ADMIN_WALLETS.some(
      (admin) => admin.toLowerCase() === walletAddress.toLowerCase()
    );
  }, [walletAddress]);

  return isAdmin;
};
