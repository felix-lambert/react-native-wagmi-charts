import React from 'react';
import { Line as SVGLine, LineProps } from 'react-native-svg';

import { LineChartDimensionsContext } from './Chart';
import { useHorizontalLineChart } from './useHorizontalLineChart';

type HorizontalLineProps = {
  color?: string;
  lineProps?: Partial<LineProps>;
  offsetY?: number;
  /**
   * (Optional) A pixel value to nudge the line up or down.
   *
   * This may be useful to customize the line's position based on the thickness of your cursor or chart path.
   *
   * ```tsx
   * <LineChart.HorizontalLine
   *   at={{ index: 3 }}
   * />
   *
   * // or
   *
   * <LineChart.HorizontalLine
   *   at={{ value: 320.32}}
   * />
   * ```
   */
  at?: {
    index?: never;
    value: number;
  };
};

LineChartHorizontalLine.displayName = 'LineChartHorizontalLine';

export function LineChartHorizontalLine({
  color = 'gray',
  lineProps = {},
  at = { value: 0 },
  offsetY = 0,
}: HorizontalLineProps) {
  const { width, height, gutter } = React.useContext(
    LineChartDimensionsContext
  );
  const { yDomain } = useHorizontalLineChart();


  const [y, setY] = React.useState(0);

  React.useEffect(() => {
    /**
     * <gutter>
     * | ---------- | <- yDomain.max  |
     * |            |                 | offsetTop
     * |            | <- value        |
     * |            |
     * |            | <- yDomain.min
     * <gutter>
     */
    const offsetTop = yDomain.max - at.value;
    const percentageOffsetTop = offsetTop / (yDomain.max - yDomain.min);
    const heightBetweenGutters = height - gutter * 2;
    const offsetTopPixels = gutter + percentageOffsetTop * heightBetweenGutters;
    setY(offsetTopPixels + offsetY);
  }, [at.value, gutter, height, offsetY, yDomain.max, yDomain.min]);

  const lineTransitionProps = {
    x1: 0,
    x2: width,
    y1: y,
    y2: y,
  };

  return (
    <SVGLine
      {...lineTransitionProps}
      strokeWidth={2}
      stroke={color}
      strokeDasharray="3 3"
      {...lineProps}
    />
  );
}
