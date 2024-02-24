/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useContext} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import ColorContext from '../components/ColorContext';
// @ts-ignore
import google from '../assets/google.png';
// @ts-ignore
import apple from '../assets/apple.png';
// @ts-ignore
import slack from '../assets/slack.png';
// @ts-ignore
import microsoft from '../assets/microsoft.png';
import Logo from './Logo';
import {useHasBrandLogo} from '../utils/common';
import {useString} from '../utils/useString';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

const SelectOAuth = ({onSelectOAuth}) => {
  const hasBrandLogo = useHasBrandLogo();
  // Linking.openURL(url);
  const {primaryColor} = useContext(ColorContext);
  //commented for v1 release
  // const oauthLoginLabel = useString('oauthLoginLabel')();
  // const googleAuthButton = useString('googleAuthButton')();
  // const microsoftAuthButton = useString('microsoftAuthButton')();
  // const slackAuthButton = useString('slackAuthButton')();
  // const appleAuthButton = useString('appleAuthButton')();
  const oauthLoginLabel = 'Login using OAuth';
  const googleAuthButton = 'Google';
  const microsoftAuthButton = 'Microsoft';
  const slackAuthButton = 'Slack';
  const appleAuthButton = 'Apple';
  return (
    <View style={style.main}>
      <View style={style.nav}>{hasBrandLogo() && <Logo />}</View>
      <View style={style.content}>
        <View style={style.leftContent}>
          <Text style={style.heading}>{$config.APP_NAME}</Text>
          <Text style={style.headline}>{$config.LANDING_SUB_HEADING}</Text>
          <View style={style.inputs}>
            <View style={style.oAuthContainer}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 20,
                  color: $config.FONT_COLOR,
                }}>
                {oauthLoginLabel}
              </Text>
              {$config.ENABLE_GOOGLE_OAUTH ? (
                <TouchableOpacity
                  style={[style.secondaryBtn, {borderColor: primaryColor}]}
                  onPress={() => onSelectOAuth({oAuthSystem: 'google'})}>
                  <Image source={google} style={style.logo} />
                  <Text style={[style.secondaryBtnText]}>
                    {googleAuthButton}
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {$config.ENABLE_MICROSOFT_OAUTH ? (
                <TouchableOpacity
                  style={[style.secondaryBtn, {borderColor: primaryColor}]}
                  onPress={() => onSelectOAuth({oAuthSystem: 'microsoft'})}>
                  <Image source={microsoft} style={style.logo} />
                  <Text style={[style.secondaryBtnText]}>
                    {microsoftAuthButton}
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {$config.ENABLE_SLACK_OAUTH ? (
                <TouchableOpacity
                  style={[style.secondaryBtn, {borderColor: primaryColor}]}
                  onPress={() => onSelectOAuth({oAuthSystem: 'slack'})}>
                  <Image source={slack} style={style.logo} />
                  <Text style={[style.secondaryBtnText]}>
                    {slackAuthButton}
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {$config.ENABLE_APPLE_OAUTH ? (
                <TouchableOpacity
                  style={[style.secondaryBtn, {borderColor: primaryColor}]}
                  onPress={() => onSelectOAuth({oAuthSystem: 'apple'})}>
                  <Image source={apple} style={style.logo} />
                  <Text style={[style.secondaryBtnText]}>
                    {appleAuthButton}
                  </Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  oAuthContainer: {
    display: 'flex',
    flex: 1,
    marginTop: 50,
    // flexDirection: 'column',
    // flexBasis: '33.333333%',
    alignItems: 'center',
    // alignSelf: 'center',
    // margin: 'auto',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
    // alignContent: 'space-between',
    // marginBottom: 200,
  },
  secondaryBtn: {
    minWidth: 200,
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'space-around',
    // paddingTop: 20,
    backgroundColor: $config.SECONDARY_ACTION_COLOR,
    paddingHorizontal: 30,
    margin: 10,
    borderRadius: 100,
  },
  secondaryBtnText: {
    width: '100%',
    height: 45,
    lineHeight: 45,
    fontSize: 16,
    color: $config.PRIMARY_ACTION_BRAND_COLOR,
    textAlign: 'center',
    fontWeight: '500',
    textAlignVertical: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  full: {flex: 1},
  main: {
    flex: 2,
    justifyContent: 'space-evenly',
    marginHorizontal: '8%',
    marginVertical: '2%',
  },
  nav: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  content: {flex: 6, flexDirection: 'row'},
  leftContent: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    marginBottom: '13%',
    marginTop: '8%',
    // marginRight: '5%',
    marginHorizontal: 'auto',
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: $config.FONT_COLOR,
    marginBottom: 20,
  },
  headline: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: $config.FONT_COLOR,
    marginBottom: 20,
  },
  inputs: {
    flex: 1,
    // marginVertical: '2%',
    width: '100%',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  // textInput: textInput,
  checkboxHolder: {
    marginVertical: 0,
    flexDirection: 'row',
    marginTop: 0,
    marginBottom: 20,
    // flex: .2,
    // height: 10,
    // justifyContent: 'center',
    // alignContent: 'center',
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',
  },
  checkboxTitle: {
    color: $config.FONT_COLOR + hexadecimalTransparency['80%'],
    paddingHorizontal: 5,
    alignSelf: 'center',
    // marginVertical: 'auto',
    // fontWeight: '700',
  },
  checkboxCaption: {
    color: $config.FONT_COLOR + hexadecimalTransparency['80%'],
    paddingHorizontal: 5,
  },
  checkboxTextHolder: {
    marginVertical: 0, //check if 5
    flexDirection: 'column',
  },
  // urlTitle: {
  //   color: '#fff',
  //   fontSize: 14,
  // },
  urlHolder: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
    maxWidth: 400,
    minHeight: 45,
  },
  // url: {
  //   color: '#fff',
  //   fontSize: 18,
  //   fontWeight: '700',
  //   textDecorationLine: 'underline',
  // },
  pstnHolder: {
    flexDirection: 'row',
    width: '80%',
  },
  pstnMargin: {
    marginRight: '10%',
  },
});
export default SelectOAuth;
