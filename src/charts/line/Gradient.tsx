import * as React from 'react';
import { Path, PathProps } from 'react-native-svg';

import { LineChartDimensionsContext } from './Chart';
import { LineChartPathContext } from './ChartPath';

export type LineChartGradientProps = PathProps & {
  color?: string;
  children?: React.ReactNode;
};

LineChartGradient.displayName = 'LineChartGradient';

export function LineChartGradient({
  color: overrideColor = undefined,
}: LineChartGradientProps) {
  const { area } = React.useContext(LineChartDimensionsContext);
  const { color: contextColor } = React.useContext(LineChartPathContext);

  const color = overrideColor || contextColor;

  return (
    <>
      <Path d={area} fill={`white`} stroke={color} strokeWidth={2} />
    </>
  );
}
