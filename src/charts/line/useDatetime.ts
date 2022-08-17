import { useDerivedValue } from 'react-native-reanimated';

import { formatDatetime } from '../../utils';
import type { TFormatterFn } from '../candle/types';
import { useLineChart } from './useLineChart';

export function useLineChartDatetime({
  format,
  locale,
  options,
}: {
  format?: TFormatterFn<number>;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
} = {}) {
  const { currentIndex, data } = useLineChart();

  const timestamp = useDerivedValue(() => {
    if (
      typeof currentIndex.value === 'undefined' ||
      currentIndex.value === -1
    ) {
      return data[data.length - 1]?.timestamp;
    }

    return data[currentIndex.value]?.timestamp;
  });

  const timestampString = useDerivedValue(() => {
    return timestamp?.value?.toString();
  });

  const formatted = useDerivedValue(() => {
    const formattedDatetime = timestamp.value
      ? formatDatetime({
          value: timestamp.value,
          locale,
          options,
        })
      : '';
    return format
      ? format({ value: timestamp.value || -1, formatted: formattedDatetime })
      : formattedDatetime;
  });

  return { value: timestampString, formatted };
}
