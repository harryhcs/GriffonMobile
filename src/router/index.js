import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {ApolloClient} from 'apollo-client';

import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from '@apollo/react-hooks';
import {WebSocketLink} from 'apollo-link-ws';
import {getUniqueId} from 'react-native-device-info';

import AuthScreen from '../screens/authenticate';
import HomeScreen from '../screens/app/home';

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
const HomeStack = createStackNavigator();


function HomeStackScreen() {
  useEffect(() => {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 0,
      distanceFilter: 0,
      notificationTitle: 'Griffon',
      notificationText: 'Currently tracking your location',
      debug: false,
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 5000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: 'https://griffonapi.herokuapp.com/v1/graphql',
      httpHeaders: {
        'x-hasura-role': 'app',
        'x-hasura-device-id': getUniqueId(),
      },
      // customize post properties
      postTemplate: {
        query:
          'mutation updatePosition($lat: numeric!, $lon: numeric!, $heading: numeric, $speed: numeric, $altitude: numeric, $accuracy: numeric) {\n    insert_geolocations(objects: {latitude: $lat, longitude: $lon, heading: $heading, speed: $speed, altitude: $altitude, accuracy: $accuracy}) {\n      affected_rows\n    }\n  }',
        variables: {
          lat: '@latitude',
          lon: '@longitude',
          heading: '@bearing',
          speed: '@speed',
          altitude: '@altitude',
          accuracy: '@accuracy',
        },
        operationName: 'updatePosition',
      },
    });

    BackgroundGeolocation.on('location', (loc) => {
      BackgroundGeolocation.startTask((taskKey) => {
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      console.log('stationary');
      // handle stationary locations here
      // Actions.sendLocation(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              'App requires location tracking permission',
              'Would you like to open app settings?',
              [
                {
                  text: 'Yes',
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            ),
          1000,
        );
      }
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.checkStatus((status) => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning,
      );
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled,
      );
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
      );

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });
    return () => BackgroundGeolocation.removeAllListeners();
  });
  return (
    <HomeStack.Navigator
      screenOptions={({route, navigation}) => ({
        gestureEnabled: true,
        headerStyle: {
          borderBottomWidth: 1,
          borderBottomColor: '#1f9c91',
        },
        headerTintColor: '#1f9c91',
        headerTitleStyle: {
          color: '#2e2e2d',
          fontWeight: '400',
          fontSize: 16,
        },
      })}>
      <HomeStack.Screen
        name="AddWasteBagToRoom"
        component={HomeScreen}
        options={({route}) => ({title: 'Griffon'})}
      />
    </HomeStack.Navigator>
  );
}

export default function AuthStackRouter() {
  const {authenticated} = useSelector((state) => state.authReducer);
  const link = new WebSocketLink({
    uri: 'wss://griffonapi.herokuapp.com/v1/graphql',
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          'X-hasura-role': 'app',
          'X-hasura-device-id': `${getUniqueId()}`,
        },
      },
    },
  });
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });

  if (authenticated) {
    return (
      <ApolloProvider client={client}>
        <NavigationContainer>
          <HomeStackScreen />
        </NavigationContainer>
      </ApolloProvider>
    );
  }
  return (
    <ApolloProvider client={client}>
      <AuthScreen />
    </ApolloProvider>
  );
}
