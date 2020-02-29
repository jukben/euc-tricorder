import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LineChart } from 'react-native-svg-charts';

export const Chart = React.memo(
  ({
    data,
    snapshotSize = 600,
    style,
  }: {
    data: Array<number>;
    snapshotSize?: number;
    style?: StyleProp<ViewStyle>;
  }) => {
    const normalizedData = useMemo(() => {
      if (data.length > 600) {
        return data.slice(-snapshotSize);
      }

      // In case we don't have enough data let's pre-fill it with zeroes
      const dataSnapshot = Array(snapshotSize).fill(0);

      // and append data we have
      dataSnapshot.splice(snapshotSize - data.length, data.length, ...data);

      return dataSnapshot;
    }, [data, snapshotSize]);

    return (
      <LineChart
        style={style}
        data={normalizedData}
        animate={false}
        svg={{ stroke: 'rgb(134, 65, 244)' }}
        contentInset={{ top: 20, bottom: 20 }}
      />
    );
  },
);
