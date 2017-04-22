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
  past: Array<Object>,
  future: Array<Object>,
  style: Object
};

export function HourlyChart({ past, future, style }: Props) {
  const hours = past.slice(0, 24).map((hour, index) => {
    let pastTemperature   = hour.temperature; 
    let futureTemperature = future[index].temperature;

    const pastBarHeight   = calcBarHeight(pastTemperature);
    const futureBarHeight = calcBarHeight(futureTemperature);

    return (<View key={hour.time} style={[styles.barBox]}>
      <View style={[styles.bar, styles.barPast,   { height: pastBarHeight }]} />
      <View style={[styles.bar, styles.barFuture, { height: futureBarHeight }]} />
    </View>);
  });

  const texts = past.slice(0, 12).map((h, i) => (
    <Text key={i} style={[styles.barText]}>{i * 2}</Text>
  ));

  return (<View style={[style, styles.container]}>
      <View style={styles.chartItems}>{hours}</View>
      <View style={styles.chartItems}>{texts}</View>
    </View>);
}

function calcBarHeight(temperature) {
  return Math.round(temperature - 50) * 4;
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
  barPast: {
    backgroundColor: '#E4C478',
  },
  barFuture: {
    backgroundColor: '#74B49B',
    opacity: 0.65,
    marginLeft: -10,
  }
});
 
