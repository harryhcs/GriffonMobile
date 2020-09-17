import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getUniqueId, getPowerState} from 'react-native-device-info';
import BackgroundTimer from 'react-native-background-timer';

const Home = () => {
  useEffect(() => {
    BackgroundTimer.runBackgroundTimer(() => {
      updateBattery();
    }, 3000);
    return () => BackgroundTimer.stopBackgroundTimer();
  });

  const query = `
    mutation updateBattery($value: jsonb!, $key: String!) {
      insert_attributes(objects: {key: $key, value: $value}) {
        affected_rows
      }
    }
  `;

  const updateBattery = () => {
    getPowerState().then((state) => {
      fetch('https://griffonapi.herokuapp.com/v1/graphql', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-role': 'app',
          'x-hasura-device-id': getUniqueId(),
        },
        body: JSON.stringify({
          query,
          variables: {
            key: 'battery',
            value: {
              charging: state.batteryState === 'charging',
              level: state.batteryLevel * 100,
            },
          },
          operationName: 'updateBattery',
        }),
      })
        .then((res) => console.log(res))
        .then((error) => console.log(error));
    });
  };

  return (
    <View style={styles.root}>
      <Text>Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default Home;
