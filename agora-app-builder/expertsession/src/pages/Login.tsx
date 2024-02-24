import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Logo} from '../components/common';
import PrimaryButton from '../atoms/PrimaryButton';
import {useAuth} from '../auth/AuthProvider';
import Spacer from '../atoms/Spacer';

export default function Login() {
  const {authLogin} = useAuth();

  return (
    <View style={styles.container}>
      <Logo />
      <Spacer size={20} />
      <PrimaryButton onPress={authLogin} text={'LOGIN/SIGNUP'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
