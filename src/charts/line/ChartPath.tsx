import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  WithTimingConfig,
} from 'react-native-reanimated';
import flattenChildren from 'react-keyed-flatten-children';
import { LineChartDimensionsContext } from './Chart';
import { LineChartPath, LineChartPathProps } from './Path';
import { useLineChart } from './useLineChart';

const BACKGROUND_COMPONENTS = ['LineChartHighlight', 'LineChartDot'];
const FOREGROUND_COMPONENTS = [
  'LineChartHighlight',
  'LineChartDot',
  'LineChartGradient',
];

const ZINDEX_COMPONENTS = ['LineChartHorizontalLine'];

const AnimatedSVG = Animated.createAnimatedComponent(Svg);

export const LineChartPathContext = React.createContext({
  color: '',
  isInactive: false,
  isTransitionEnabled: true,
});

type LineChartPathWrapperProps = {
  animationDuration?: number;
  animationProps?: Omit<Partial<WithTimingConfig>, 'duration'>;
  children?: React.ReactNode;
  color?: string;
  inactiveColor?: string;
  width?: number;
  widthOffset?: number;
  pathProps?: Partial<LineChartPathProps>;
  showInactivePath?: boolean;
  animateOnMount?: 'foreground';
  mountAnimationDuration?: number;
  mountAnimationProps?: Partial<WithTimingConfig>;
};

LineChartPathWrapper.displayName = 'LineChartPathWrapper';

export function LineChartPathWrapper({
  children,
  color = 'black',
  inactiveColor,
  width: strokeWidth = 3,
  pathProps = {},
  showInactivePath = true,
  animateOnMount,
}: LineChartPathWrapperProps) {
  const { height, pathWidth, width } = React.useContext(
    LineChartDimensionsContext
  );
  const { currentX, isActive } = useLineChart();
  const isMounted = useSharedValue(false);

  ////////////////////////////////////////////////

  const svgProps = useAnimatedProps(() => {
    const shouldAnimateOnMount = animateOnMount === 'foreground';
    const inactiveWidth =
      !isMounted.value && shouldAnimateOnMount ? 0 : pathWidth;

    return {
      width: isActive.value
        ? // on Web, <svg /> elements don't support negative widths
          // https://github.com/coinjar/react-native-wagmi-charts/issues/24#issuecomment-955789904
          Math.max(currentX.value, 0)
        : inactiveWidth - 1,
    };
  });

  const viewSize = React.useMemo(() => ({ width, height }), [width, height]);

  ////////////////////////////////////////////////

  let backgroundChildren;
  let foregroundChildren;
  let zIndexChildren;
  if (children) {
    const iterableChildren = flattenChildren(children);
    backgroundChildren = iterableChildren.filter((child) =>
      // @ts-ignore
      BACKGROUND_COMPONENTS.includes(child?.type?.displayName)
    );
    foregroundChildren = iterableChildren.filter((child) =>
      // @ts-ignore
      FOREGROUND_COMPONENTS.includes(child?.type?.displayName)
    );
    zIndexChildren = iterableChildren.filter((child) =>
      // @ts-ignore
      ZINDEX_COMPONENTS.includes(child?.type?.displayName)
    );
  }
  ////////////////////////////////////////////////

  return (
    <>
      <LineChartPathContext.Provider
        value={{
          color,
          isInactive: showInactivePath,
          isTransitionEnabled: pathProps.isTransitionEnabled ?? true,
        }}
      >
        <View style={viewSize}>
          <Svg width={width} height={height}>
            <LineChartPath
              color={color}
              inactiveColor={inactiveColor}
              width={strokeWidth}
              {...pathProps}
            />
            {backgroundChildren}
            {zIndexChildren}
          </Svg>
        </View>
      </LineChartPathContext.Provider>
      <LineChartPathContext.Provider
        value={{
          color,
          isInactive: false,
          isTransitionEnabled: pathProps.isTransitionEnabled ?? true,
        }}
      >
        <View style={StyleSheet.absoluteFill}>
          <AnimatedSVG animatedProps={svgProps} height={height}>
            <LineChartPath color={color} width={strokeWidth} {...pathProps} />
            {foregroundChildren}
            {zIndexChildren}
            <View style={{ left: svgProps.width }}></View>
            <View
              style={{
                backgroundColor: 'white',
                top: 175,
                height: 130,
                width: svgProps.width,
              }}
            />
          </AnimatedSVG>
        </View>
      </LineChartPathContext.Provider>
    </>
  );
}
