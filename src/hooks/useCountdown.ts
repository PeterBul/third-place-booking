import { useState, useEffect } from 'react';

export const useCountdown = (time: number) => {
  const [countdown, setCountdown] = useState(time);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  return [countdown, setCountdown] as const;
};
