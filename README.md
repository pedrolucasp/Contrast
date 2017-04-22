# Contrast
Simply contrast between past and future weather :cloud:

This is a simple react-native application, where I've put together a couple of things I've been wanting to dive in and learn for a some time, including: [react-native](https://facebook.github.io/react-native/) and [d3.js](https://d3js.org/). The app itself, does not have a purpose if not such. 

![Demo](http://i.imgur.com/P3wvwyP.gif)

# Development
Remove the `.sample` of `secret.json.sample` file inside `app` folder and set your Forecast API, I suggest to use the [Dark Sky Forecast API](https://developer.forecast.io//developer.forecast.io/). Then:

        npm install -g react-native
        npm install
        react-native run-android

# TODO
- Get user location
- Cache fetched weather (currently being held experiments at the `caching_weather` branch)

# License

Copyright (c) 2017-present, Pedro Lucas Porcellis

# Credits
- [The Dark Sky API Forecast](https://developer.forecast.io//developer.forecast.io/)
- [ColorHunt.co](http://colorhunt.co/)