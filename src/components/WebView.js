import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { WebView as WebViewLibrary } from "react-native-webview";
import { NEW_BASE_URL } from '../common/constants'
import AppHeader from './appHeader';
import AppBackground from './appBackground';

export default WebView = () => {
    const Url = NEW_BASE_URL + '/auth/twitter'

  return (
    <AppBackground>
    <SafeAreaView style={{flex:1}}>
      <AppHeader showBackButton title="Twitter Sign Up"/>
      <WebViewLibrary
        key={Url}
        source={{ uri: Url }}
      />
    </SafeAreaView>
    </AppBackground>
  )
}
