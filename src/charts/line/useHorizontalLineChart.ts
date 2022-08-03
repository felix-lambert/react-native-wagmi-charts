import * as React from 'react';

import { LineChartContext } from './Context';
import { useLineChartData, useLineChartId } from './Data';
import { useCurrentY } from './useHorizontalCurrentY';

export function useHorizontalLineChart() {
  const lineChartContext = React.useContext(LineChartContext);
  const maybeId = useLineChartId();
  const dataContext = useLineChartData({
    id: maybeId,
  });
  const currentY = useCurrentY();

  return React.useMemo(
    () => ({ ...lineChartContext, ...dataContext, currentY }),
    [lineChartContext, dataContext, currentY]
  );
}
