/* @flow */
import React from 'react';
import {
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  View
} from 'react-native';

import moment from 'moment';

const WIDTH = 320;
const dateDifferences = {
   '0': 'Hoje',
   '1': 'Amanhã',
  '-1': 'Ontem'
};

function formatDate(date: Date) : string {
  let today       = new moment(new Date());
  let newDate     = new moment(date);
  let difference  = today.diff(newDate, 'days');

  return dateDifferences[String(difference)] || new moment(newDate).format("ddd, DD/MM/YYYY");
}

function times(n : number) : Array<number> {
  const arr = new Array(n);

  for (let i = 0; i < n; i++) {
    arr[i] = i;
  }

  return arr;
}

function onScroll(onChange) {
  return event => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offset / 320);
    onChange(index);
  };
}

type Props = {
  dates: Array<Date>,
  onChange: any
};

export function DateSelector({ dates, onChange }: Props) {
  const texts = dates.map((date, i) => (
    <Text key={i} style={[styles.text]}>{formatDate(date)}</Text>
  ));

  return <View style={[styles.container]}>
    <ScrollView
      onMomentumScrollEnd={onScroll(onChange)}
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
    height: 100
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

