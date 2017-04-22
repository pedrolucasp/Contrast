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

import addDays    from 'date-fns/add_days';
import subDays    from 'date-fns/sub_days';
import startOfDay from 'date-fns/start_of_day';

import { DateSelector } from './app/components/DateSelector';
import { HourlyChart }  from './app/components/HourlyChart';

const API_KEY = '80c3c6b0aecd107208875a63410b371e';
const LAT     = -31.776;
const LNG     = -52.3594;
const today   = startOfDay(new Date());

const dates = [
  subDays(today, 1), 
  today,
  addDays(today, 1)
];

function weatherUrl(lat: number, lng: number, date: Date) : string {
  const timestamp = Math.floor(date.getTime() / 1000);
  return `https://api.forecast.io/forecast/${API_KEY}/${lat},${lng},${timestamp}`;
}

function fetchWeather(date: Date) {
  const url = weatherUrl(LAT, LNG, date);

  return fetch(url)
    .then(res => res.json())
    .then(data => data.hourly.data);
}

export default class Contrast extends Component {

  constructor() {
    super();

    let yesterday = subDays(today, 1);

    this.state = {
      ratio: new Animated.Value(100),
      pastOptions: [yesterday],
      futureOptions: [today, addDays(today, 1)],

      past: yesterday,
      future: today,

      pastWeather: [],
      futureWeather: []
    };
  }

  componentDidMount() {
    this.fetchWeatherForCurrentState(this.state.future, this.state.past);
  }

  fetchWeatherForCurrentState(future: Date, past: Date) {
    this.fetchFuture(future);
    this.fetchPast(past);
  }

  onPastChange(date: Date): void {
    if (date.getTime() === this.state.past.getTime()) {
      return;
    }

    this.setState({
      past: date
    });

    this.fetchPast(date);
  }

  onFutureChange(date: Date): void {
    if (date.getTime() === this.state.future.getTime()) {
      return;
    }

    this.setState({
      future: date
    });

    this.fetchFuture(date);
  }

  fetchFuture(date: Date) {
    fetchWeather(date)
      .then(data => { this.setState({ futureWeather: data }) });
  }

  fetchPast(date: Date) {
    fetchWeather(date)
      .then(data => { this.setState({ pastWeather: data }) });
  }

  render() {
    return (
      <View style={styles.container}>
        <HourlyChart 
          past={this.state.pastWeather} 
          future={this.state.futureWeather} 
          style={[{ marginBottom: 20 }]} />

        <DateSelector 
          dates={this.state.pastOptions} 
          onChange={this.onPastChange.bind(this)} />

        <DateSelector 
          dates={this.state.futureOptions} 
          onChange={this.onFutureChange.bind(this)} />
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
