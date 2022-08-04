import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  LongPressGestureHandler,
  LongPressGestureHandlerProps,
  State,
} from 'react-native-gesture-handler';

import { LineChartDimensionsContext } from './Chart';
import { useLineChart } from './useLineChart';

export type LineChartCursorProps = LongPressGestureHandlerProps & {
  children: React.ReactNode;
  type: 'line' | 'crosshair';
  holdValue?: boolean;
  mountWithActivatedCursor?: boolean;
};

export const CursorContext = React.createContext({ type: '' });

LineChartCursor.displayName = 'LineChartCursor';

export function LineChartCursor({
  children,
  type,
  holdValue,
  mountWithActivatedCursor = false,
  ...props
}: LineChartCursorProps) {
  const { pathWidth: width, parsedPath } = React.useContext(
    LineChartDimensionsContext
  );
  const { currentX, currentIndex, isActive, data } = useLineChart();

  React.useEffect(() => {
    if (mountWithActivatedCursor === true) {
      const boundedX = width;
      isActive.value = true;
      currentX.value = boundedX;

      const minIndex = 0;
      const boundedIndex = Math.max(
        minIndex,
        Math.round(boundedX / width / (1 / (data.length - 1)))
      );
      currentIndex.value = boundedIndex;
    }
  }, []);

  return (
    <CursorContext.Provider value={{ type }}>
      <LongPressGestureHandler
        minDurationMs={0}
        maxDist={999999}
        onHandlerStateChange={({ nativeEvent }) => {
          if (State.ACTIVE === nativeEvent.state) {
            if (parsedPath) {
              const boundedX = nativeEvent.x <= width ? nativeEvent.x : width;
              isActive.value = true;
              currentX.value = boundedX;

              // on Web, we could drag the cursor to be negative, breaking it
              // so we clamp the index at 0 to fix it
              // https://github.com/coinjar/react-native-wagmi-charts/issues/24
              const minIndex = 0;
              const boundedIndex = Math.max(
                minIndex,
                Math.round(boundedX / width / (1 / (data.length - 1)))
              );

              currentIndex.value = boundedIndex;
            }
          }
          if (State.END === nativeEvent.state) {
            if (holdValue === true) {
              isActive.value = true;
            } else {
              isActive.value = false;
              currentIndex.value = -1;
            }
          }
        }}
        {...props}
      >
        <View style={StyleSheet.absoluteFill}>{children}</View>
      </LongPressGestureHandler>
    </CursorContext.Provider>
  );
}
