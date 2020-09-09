import React from 'react';

import {StyleSheet, Text, Dimensions, Linking} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const ScanScreen = (props) => {
  const {close} = props;
  const onSuccess = (e) => {
    e.data.split(':');
    close();
  };
  return (
    <QRCodeScanner
      showMarker={true}
      onRead={onSuccess}
      markerStyle={styles.marker}
      cameraStyle={{
        width: Dimensions.get('screen').width - 40,
      }}
      topContent={
        <Text style={styles.centerText}>Scan the generted QR code.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#2e2e2d',
    textAlign: 'center',
  },
  marker: {
    borderColor: '#eb6646',
    borderWidth: 2,
  },
});

export default ScanScreen;
