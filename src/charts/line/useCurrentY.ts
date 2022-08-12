import { useContext, useMemo, useEffect, useState } from 'react';
import { getYForX, parse } from 'react-native-redash';
import { LineChartContext } from './Context';
import { LineChartDimensionsContext } from './Chart';

export function useCurrentY() {
  const { path, width } = useContext(LineChartDimensionsContext);
  const { currentX } = useContext(LineChartContext);
  const parsedPath = useMemo(() => (path ? parse(path) : undefined), [path]);

  const [currentY, setCurrentY] = useState({ value: 0 });

  useEffect(() => {
    if (!parsedPath) {
      return setCurrentY({ value: -1 });
    }
    const boundedX = Math.min(width, currentX.value);
    setCurrentY({ value: getYForX(parsedPath, boundedX) || 0 });
  }, [currentX.value, parsedPath, width]);

  return currentY;
}
