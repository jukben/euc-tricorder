import { useEffect, useRef } from 'react';

export const useThrottle = <T extends unknown>({
  value,
  callback,
  threshold = 1000,
}: {
  value: T;
  callback: (value: T) => void;
  threshold: number;
}) => {
  const oldDate = useRef(Date.now());

  useEffect(() => {
    const curr = Date.now();
    if (curr - oldDate.current > threshold) {
      callback(value);
      oldDate.current = Date.now();
    }
  }, [value, callback, threshold]);
};
