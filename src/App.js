/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';


import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
// import {useDispatch, useSelector} from 'react-redux';
import AuthStackRouter from './router';
import {store, persistor} from './store/store';

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthStackRouter />
      </PersistGate>
    </Provider>
  );
};

export default App;
