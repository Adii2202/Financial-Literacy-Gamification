import {AppRegistry} from 'react-native';
import SDKAppWrapper, {
  AppBuilderSdkApi,
  AppBuilderSdkApiInterface,
} from './src/SDKAppWrapper';
import React from 'react';
import * as RN from 'react-native-web';
import './src/assets/font-styles.css';
export * from 'customization-api';
export * from 'customization-implementation';

const AppBuilderWebSdkApi: AppBuilderSdkApiInterface = AppBuilderSdkApi;

// init code
class AppBuilder extends HTMLElement {
  connectedCallback() {
    this.style.height = '100%';
    this.style.width = '100%';
    this.style.display = 'flex';
    this.style.flex = '1';
    AppRegistry.registerComponent('App', () => SDKAppWrapper);
    AppRegistry.runApplication('App', {
      // initialProps: {passphrase: this.getAttribute('passphrase')},
      rootTag: this,
    });
  }
}

customElements.define('app-builder', AppBuilder);

export {React, RN};
export default AppBuilderWebSdkApi;
