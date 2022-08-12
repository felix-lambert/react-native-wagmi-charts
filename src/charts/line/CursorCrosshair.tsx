import * as React from 'react';
import type { ViewProps } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { LineChartDimensionsContext } from './Chart';
import { LineChartCursor, LineChartCursorProps } from './Cursor';
import { useLineChart } from './useLineChart';
import { getYForX } from 'react-native-redash';

type LineChartCursorCrosshairProps = Omit<
  LineChartCursorProps,
  'children' | 'type'
> & {
  children?: React.ReactNode;
  color?: string;
  size?: number;
  outerSize?: number;
  crosshairWrapperProps?: Animated.AnimateProps<ViewProps>;
  crosshairProps?: ViewProps;
  crosshairOuterProps?: ViewProps;
};

LineChartCursorCrosshair.displayName = 'LineChartCursorCrosshair';

export function LineChartCursorCrosshair({
  children,
  outerSize = 32,
  crosshairWrapperProps = {},
  ...props
}: LineChartCursorCrosshairProps) {
  const { currentX, currentY } = useLineChart();

  const { parsedPath, width } = React.useContext(LineChartDimensionsContext);

  const firstRender = React.useRef(true);

  const animatedCursorStyle = useAnimatedStyle(() => {
    const boundedX = Math.min(width, currentX.value);

    const currentNotFirstRenderY = {
      value: getYForX(parsedPath, boundedX) || 0,
    };

    if (firstRender.current) {
      firstRender.current = false;

      return {
        transform: [
          { translateX: currentX.value - outerSize / 2 },
          { translateY: currentY.value - outerSize / 2 },
        ],
      };
    }

    return {
      transform: [
        { translateX: currentX.value - outerSize / 2 },
        { translateY: currentNotFirstRenderY.value - outerSize / 2 },
      ],
    };
  });

  return (
    <LineChartCursor type="crosshair" {...props}>
      <Animated.View
        {...crosshairWrapperProps}
        style={[
          {
            width: outerSize,
            height: outerSize,
            alignItems: 'center',
            justifyContent: 'center',
          },
          animatedCursorStyle,
          crosshairWrapperProps.style,
        ]}
      >
        {children}
      </Animated.View>
    </LineChartCursor>
  );
}
