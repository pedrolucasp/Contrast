/* @flow */
import React from 'react';
import {
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  View
} from 'react-native';

import format      from 'date-fns/format';
import isToday     from 'date-fns/is_today';
import isTomorrow  from 'date-fns/is_tomorrow';
import isYesterday from 'date-fns/is_yesterday';

const WIDTH = 320;

function formatDate(date: Date) : string {
  if (isYesterday(date)) {
    return 'Ontem';
  } else if (isToday(date)) {
    return 'Hoje';
  } else if (isTomorrow(date)) {
    return 'Amanhã';
  } else {
    return format(date, "ddd, D/MM");
  }
}

type ChangeHandler = (date: Date) => void;

function onScroll(onChange: ChangeHandler, dates: Array<Date>) {
  return event => {
    const offset = event.nativeEvent.contentOffset.x;
    const index  = Math.floor(offset / 320);

    onChange(dates[index]);
  };
}

type Props = {
  dates: Array<Date>,
  onChange: ChangeHandler
};

export function DateSelector({ dates, onChange, style }: Props) {
  const texts = dates.map((date, i) => (
    <Text key={i} style={[styles.text, style]}>{formatDate(date)}</Text>
  ));

  return <View style={[styles.container]}>
    <ScrollView
      onMomentumScrollEnd={onScroll(onChange, dates)}
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      style={[styles.scroll]}
      scrollEventThrottle={100}
      alwaysBoundHorizontal={false}>
        {texts}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  container: {
    height: 80
  },
  text: {
    width: WIDTH,
    textAlign: 'center',
    paddingVertical: 20,
    color: '#889988ff',
    fontSize: 22
  },
  scroll: {
    width: WIDTH
  }
});

