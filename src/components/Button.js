import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

const Button = (props) => {
  const {text, onPress} = props;
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#46914f',
    borderRadius: 2,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 20,
    alignItems: 'center',
  },
});

export default Button;
