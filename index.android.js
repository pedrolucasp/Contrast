/**
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Animated,
  StyleSheet,
  Text,
  View
} from 'react-native';

import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';

import { DateSelector } from './app/components/DateSelector';
import { HourlyChart } from './app/components/HourlyChart';
import sample from './app/sample.json';

const API_KEY = '80c3c6b0aecd107208875a63410b371e';

const today = new Date();

const dates = [
  subDays(today, 1), 
  today,
  addDays(today, 1)
];

function buildUrl(lat: number, lng: number) : string {
  return `https://api.forecast.io/forecast/${API_KEY}/${lat},${lng}`;
}

export default class Contrast extends Component {

  constructor() {
    super();

    this.state = {
      ratio: new Animated.Value(100),
      today: [],
      yesterday: []
    };
  }

  componentDidMount() {
    const lat = 35.699069;
    const lng = 139.7728588;
    const url = buildUrl(lat, lng);

    fetch(url).then(d => console.debug(d.json()));

    this.setState({
      today: sample.today.hourly.data,
      yesterday: sample.yesterday.hourly.data
    });
  }

  onYesterdayChange(index: number): void {
    console.log('yeserday change', index);
  }

  onTodayChange(index: number): void {
    console.log('today change', index);
  }

  render() {
    return (
      <View style={styles.container}>
        <HourlyChart past={this.state.yesterday} future={this.state.today} style={[{ marginBottom: 20 }]}/>
        <DateSelector dates={dates} onChange={this.onYesterdayChange.bind(this)} />
        <DateSelector dates={dates} onChange={this.onTodayChange.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
});

AppRegistry.registerComponent('Contrast', () => Contrast);
