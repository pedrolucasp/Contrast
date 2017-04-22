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

import { DateSelector }      from './components/DateSelector';
import { HourlyChart }       from './components/HourlyChart';
import { API_HOST, API_KEY } from './secret.json';
import Theme                 from './themes';

const LAT     = -31.776;
const LNG     = -52.3594;
const today   = startOfDay(new Date());

function weatherUrl(lat: number, lng: number, date: Date) : string {
  const timestamp = Math.floor(date.getTime() / 1000);
  return `${API_HOST}${API_KEY}/${lat},${lng},${timestamp}`;
}

function fetchWeather(date: Date) {
  const url = weatherUrl(LAT, LNG, date);

  return fetch(url)
    .then(res => res.json())
    .then(data => data.hourly.data);
}

function emptyWeather() {
  const weather = [];
  for (let index = 0; index < 24; index++) {
    weather.push({ temperature: 0, time: index });
  }

  return weather;
}

export default class Contrast extends Component {

  constructor() {
    super();

    let yesterday          = subDays(today, 1);
    let dayBeforeYesterday = subDays(yesterday, 1);

    this.state = {
      ratio: new Animated.Value(100),
      location: 'Pelotas, Brasil',
      pastOptions: [dayBeforeYesterday, yesterday],
      futureOptions: [today, addDays(today, 1)],

      past: dayBeforeYesterday,
      future: today,

      pastWeather: emptyWeather(),
      futureWeather: emptyWeather()
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
        <View style={styles.header}>
          <Text style={styles.location}>{ this.state.location }</Text>
        </View>
        <HourlyChart 
          width={500}
          height={200}
          past={this.state.pastWeather} 
          future={this.state.futureWeather} />

        <View style={styles.footer}>
          <DateSelector 
            dates={this.state.pastOptions} 
            onChange={this.onPastChange.bind(this)}
            style={{ color: Theme.colors.past }} />

          <Text style={[styles.vs]}>×</Text>
          
          <DateSelector 
            dates={this.state.futureOptions} 
            onChange={this.onFutureChange.bind(this)}
            style={{ color: Theme.colors.future }} />
        </View>
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
    backgroundColor: Theme.colors.background,
  },

  header: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  footer: {
    flex: 1.8,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  location: {
    fontSize: 20,
    color: Theme.colors.location
  },

  vs: {
    color: Theme.colors.vsLabel,
    fontSize: 20
  }
});

AppRegistry.registerComponent('Contrast', () => Contrast);
