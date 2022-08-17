import * as React from 'react';

import { LineChartContext } from './Context';
import { useLineChartData, useLineChartId } from './Data';

export function useLineChart() {
  const lineChartContext = React.useContext(LineChartContext);
  const maybeId = useLineChartId();
  const dataContext = useLineChartData({
    id: maybeId,
  });

  return React.useMemo(
    () => ({ ...lineChartContext, ...dataContext }),
    [lineChartContext, dataContext]
  );
}
