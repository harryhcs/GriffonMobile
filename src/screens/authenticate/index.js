import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import QRCode from 'react-native-qrcode-svg';
import {useSubscription} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {useDispatch} from 'react-redux';
import Logo from '../../assets/images/logo.png';

const Sensor = gql`
  subscription {
    sensors {
      id
      active
    }
  }
`;

const Authenticate = () => {
  const dispatch = useDispatch();
  const {loading, error, data} = useSubscription(Sensor);
  if (loading) {
    return <Text>"loading..."</Text>;
  }
  if (error) {
    return <Text>{JSON.stringify(error)}</Text>;
  }
  if (data && data.sensors.length === 1) {
    dispatch({
      type: 'AUTH',
    });
  }
  return (
    <View style={styles.root}>
      <Image style={styles.logo} source={Logo} width={300} />
      <QRCode value={getUniqueId()} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'center',
  },
});

export default Authenticate;
