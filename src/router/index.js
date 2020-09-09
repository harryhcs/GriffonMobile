import React from 'react';
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

// import Loading from '../components/Loading';
import Geolocation from '@react-native-community/geolocation';

import {Alert} from 'react-native';

import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';

const Stack = createStackNavigator();
const HomeStack = createStackNavigator();

const UPDATE_POSITION = gql`
  mutation updateLocation($lat: numeric!, $lon: numeric!) {
    insert_locations(objects: {latitude: $lat, longitude: $lon}) {
      affected_rows
    }
  }
`;

function HomeStackScreen() {
  const [updateLocation, {loading, error}] = useMutation(UPDATE_POSITION);
  // Geolocation.getCurrentPosition((info) => {
  //   updateLocation({
  //     variables: {
  //       lat: info.coords.latitude,
  //       lon: info.coords.longitude,
  //     },
  //   });
  // });
  if (error) {
    console.log(error);
  }
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
