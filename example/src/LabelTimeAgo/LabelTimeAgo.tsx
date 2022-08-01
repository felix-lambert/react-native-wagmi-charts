import React, { FunctionComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { LabelTimeAgoButton } from './LabelTimeAgoButton';

import { moveToMonthsBefore, findClosestDateIndex } from '../lib';

export type TimeFilters = '1M' | '3M' | '6M' | '1A';

function cutGraphFilterBasedOnSavingTime(scaleGraphFilterLength: number): TimeFilters[] {
  const arrayOfDuration: TimeFilters[] = ['1M', '3M', '6M', '1A'];

  return arrayOfDuration.slice(0, scaleGraphFilterLength);
}

function diffMonths(d1: Date, d2: Date) {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

const SIX_MONTHS = 6;
const THREE_MONTHS = 3;
const ONE_MONTH = 1;

enum NumberOfFilters {
  one = 1,
  two = 2,
  three = 3,
  four = 4,
}

export function getScaleGraphicLengthByDate(timestamp: number) {
  const nbOfMonthsOfSavings = diffMonths(new Date(timestamp), new Date());

  if (nbOfMonthsOfSavings >= SIX_MONTHS) {
    return NumberOfFilters.four;
  }

  if (nbOfMonthsOfSavings >= THREE_MONTHS && nbOfMonthsOfSavings < SIX_MONTHS) {
    return NumberOfFilters.three;
  }

  if (nbOfMonthsOfSavings >= ONE_MONTH && nbOfMonthsOfSavings < THREE_MONTHS) {
    return NumberOfFilters.two;
  }

  return NumberOfFilters.one;
}

export const LabelTimeAgo: FunctionComponent = ({
  timeFilter,
  defaultChartData,
  resetGraphBasedOnFilter,
}) => {
  const [arrayToPrepareForFilter, setArrayToPrepareForFilter] = React.useState<
    (TimeFilters | 'Tout')[]
  >([]);

  React.useEffect(() => {
    const scaleGraphFilterLength = goodGraphFilterLength(defaultChartData[0]);

    const arrayToPrepare: (TimeFilters | 'Tout')[] = cutGraphFilterBasedOnSavingTime(
      scaleGraphFilterLength
    );
    arrayToPrepare.push('Tout');

    setArrayToPrepareForFilter(arrayToPrepare);
  }, []);

  function goodGraphFilterLength(startDate: { timestamp: number }) {
    if (startDate && startDate.timestamp) {
      const dateToFind = startDate.timestamp;

      const scaleGraphFilterLength = getScaleGraphicLengthByDate(dateToFind);

      if (scaleGraphFilterLength) {
        return scaleGraphFilterLength;
      }
    }

    return 0;
  }

  function makeSimpleArrayOfDates() {
    return defaultChartData.map(res => res.timestamp);
  }

  function getClosestDateIndex(goBackToNumberOfMonths: number) {
    const monthBeforeToday = moveToMonthsBefore(goBackToNumberOfMonths);

    const timestamps = makeSimpleArrayOfDates();

    console.log(timestamps);

    return findClosestDateIndex(timestamps, monthBeforeToday);
  }

  function onCurrentLabel(timeFilter: TimeFilters | 'Tout') {
    console.log('on current label')
    let indexToSlice = 0;

    console.log(timeFilter);

    if (timeFilter === 'Tout') {
      // logEvent(AnalyticsEvents.periodButtonClicked, 'all');
      indexToSlice = 0;
    }

    if (timeFilter === '1M') {
      // logEvent(AnalyticsEvents.periodButtonClicked, 'one_month');
      indexToSlice = getClosestDateIndex(1);
    }
    if (timeFilter === '3M') {
      // logEvent(AnalyticsEvents.periodButtonClicked, 'three_months');
      indexToSlice = getClosestDateIndex(3);
    }
    if (timeFilter === '6M') {
      // logEvent(AnalyticsEvents.periodButtonClicked, 'six_months');
      indexToSlice = getClosestDateIndex(6);
    }
    if (timeFilter === '1A') {
      // logEvent(AnalyticsEvents.periodButtonClicked, 'one_year');
      indexToSlice = getClosestDateIndex(12);
    }

    resetGraphBasedOnFilter(indexToSlice, timeFilter);
  }

  return (
    <View style={styles.positionLabelTimeAgo}>
      {arrayToPrepareForFilter.map((currentLabel: TimeFilters | 'Tout', index: number) => {
        return (
          <LabelTimeAgoButton
            key={index}
            text={currentLabel}
            onPress={() => {
              console.log('on current label')
              onCurrentLabel(currentLabel);
            }}
            currentLabel={timeFilter}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  positionLabelTimeAgo: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
