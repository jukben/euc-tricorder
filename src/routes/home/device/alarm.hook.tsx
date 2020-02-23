import { useEffect, useState } from 'react';

const THRESHOLD = 3;

export const useAlarm = ({
  what,
  when,
  action,
}: {
  what: number;
  when: number;
  action: (what: number) => void;
}) => {
  const [paused, setPause] = useState(false);

  useEffect(() => {
    if (paused && what < when - THRESHOLD) {
      setPause(false);
    }

    if (!paused && what > when) {
      action(what);
      setPause(true);
    }
  }, [paused, when, action, what]);
};
