/* @flow */
import React from 'react';

import {
  StyleSheet,
  Animated,
  ScrollView,
  Text,
  View
} from 'react-native';

type Props = {
  yesterday: Array<Object>,
  today: Array<Object>,
  style: Object
};

export function HourlyChart({ yesterday, today, style }: Props) {
  const hours = yesterday.slice(0, 24).map((h, i) => {
    const yesterdayHour = Math.round((h.temperature - 50) * 4);
    const todayHour     = Math.round((today[i].temperature - 50) * 4);

    return (<View key={h.time} style={[styles.barBox]}>
      <View style={[styles.bar, styles.barYesterday, { height: yesterdayHour }]} />
      <View style={[styles.bar, styles.barToday, { height: todayHour }]} />
    </View>);
  });

  const texts = yesterday.slice(0, 12).map((h, i) => (
    <Text key={i} style={[styles.barText]}>{i * 2}</Text>
  ));

  console.debug(yesterday, today, style);

  return (<View style={[style, styles.container]}>
      <View style={styles.chartItems}>{hours}</View>
      <View style={styles.chartItems}>{texts}</View>
    </View>);
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    justifyContent: 'flex-end'
  },
  chartItems: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  barBox: {
    width: 10,
    marginHorizontal: 2,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  barText: {
    textAlign: 'center',
    marginTop: 4,
    marginLeft: -5,
    marginRight: 9,
    width: 24,
    fontWeight: 'bold',
    color: '#ff666688',
  },
  bar: {
    width: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  barYesterday: {
    backgroundColor: '#E4C478',
  },
  barToday: {
    backgroundColor: '#74B49B',
    opacity: 0.65,
    marginLeft: -10,
  }
});
 
