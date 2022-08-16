import { useContext, useEffect, useState } from 'react';
import { getYForX } from 'react-native-redash';
import { LineChartContext } from './Context';
import { LineChartDimensionsContext } from './Chart';

export function useCurrentY() {
  const { parsedPath, width } = useContext(LineChartDimensionsContext);
  const { currentX } = useContext(LineChartContext);

  const [currentY, setCurrentY] = useState({ value: 0 });

  useEffect(() => {
    if (!parsedPath) {
      return setCurrentY({ value: -1 });
    }
    const boundedX = Math.min(width, currentX.value);

    if (Object.keys(parsedPath).length > 0) {
      setCurrentY({ value: getYForX(parsedPath, boundedX) || 0 });
    }
  }, []);

  return currentY;
}
