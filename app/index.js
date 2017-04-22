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
import addHours   from 'date-fns/add_hours';
import subDays    from 'date-fns/sub_days';
import startOfDay from 'date-fns/start_of_day';

import { DateSelector }      from './components/DateSelector';
import { HourlyChart }       from './components/HourlyChart';
import { API_HOST, API_KEY } from './secret.json';

const LAT     = -31.776;
const LNG     = -52.3594;
const today   = startOfDay(new Date());

// This hash will hold the last checked weather so we don't
// need to make a request for each time we play with the date selector
// so we will update each hour

let fetchedWeather = { future: {}, past: {} };
const emptyWeather = generateEmptyWeather();

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

function generateEmptyWeather() {
  const weather = [];
  for (let index = 0; index < 24; index++) {
    weather.push({ temperature: 0, time: index });
  }

  return weather;
}

export default class Contrast extends Component {

  constructor() {
    super();

    let yesterday = subDays(today, 1);

    this.state = {
      ratio: new Animated.Value(100),
      location: 'Pelotas, Brasil',
      pastOptions: [subDays(yesterday, 1), yesterday],
      futureOptions: [today, addDays(today, 1)],

      past: yesterday,
      future: today,

      pastWeather: emptyWeather,
      futureWeather: emptyWeather
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
    let timestamp = Math.floor(date.getTime() / 1000);

    fetchedFuture = fetchedWeather.future[timestamp];

    if (fetchedFuture == emptyWeather || fetchedFuture == null || fetchedFuture.nextCheckDate == new Date()) {
      fetchWeather(date)
        .then(data => { 
          let nextCheckDate  = addHours(new Date(), 1);
          data.nextCheckDate = nextCheckDate;

          fetchedWeather.future[timestamp] = data;
          this.setState({ futureWeather: data })
        });
    } else {
      this.setState({ futureWeather: fetchedFuture });
    }
  }

  fetchPast(date: Date) {
    let timestamp = Math.floor(date.getTime() / 1000);

    fetchedPast = fetchedWeather.past[timestamp];

    if (fetchedPast == emptyWeather || fetchedPast == null || fetchedPast.nextCheckDate == new Date()) {
      fetchWeather(date)
        .then(data => { 
          let nextCheckDate  = addHours(new Date(), 1);
          data.nextCheckDate = nextCheckDate;

          fetchedWeather.past[timestamp] = data;
          this.setState({ pastWeather: data })
        });
    } else {
      this.setState({ passWeather: fetchedPast });
    }
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
            onChange={this.onPastChange.bind(this)} />

          <Text style={[styles.vs]}>×</Text>
          
          <DateSelector 
            dates={this.state.futureOptions} 
            onChange={this.onFutureChange.bind(this)} />
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
    backgroundColor: 'transparent',
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
    color: '#FF6666'
  },

  vs: {
    color: "#88998899",
    fontSize: 20
  }
});

AppRegistry.registerComponent('Contrast', () => Contrast);
