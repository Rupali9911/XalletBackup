import React, {useRef, useState} from 'react';
import {StyleSheet, Platform, Linking} from 'react-native';
import AppBackground from '../../components/appBackground';
import WebView from 'react-native-webview';
import AppHeader from '../../components/appHeader';

const policy = require('../../walletUtils/policy.html');
const terms = require('../../walletUtils/terms.html');

const Policy = ({route}) => {
  const {isPolicy} = route.params;

  const [loading, setLoading] = useState(true);

  let contentIos = isPolicy ? policy : terms;

  let contentAn = isPolicy
    ? 'file:///android_asset/policy.html'
    : 'file:///android_asset/terms.html';

  const onMessage = event => {
    console.log('Meesaage from Webview', event);
    Linking.openURL(event.nativeEvent.data);
  };

  var webViewObj = {
    canGoBack: false,
    ref: null,
    canGoForward: false,
  };

  const handleWebViewNavigationStateChange = navState => {
    console.log('Navstate', navState);
    setLoading(false);

    if (Platform.OS === 'ios') {
      if (navState.url.indexOf('xanalia.com') > 0) {
        webViewObj.ref.stopLoading();
        webViewObj.ref.goBack();
        Linking.openURL(navState.url);
        return false;
      }
    } else {
      if (navState.url.indexOf('xanalia.com') > 0) {
        webViewObj.ref.goBack();
        Linking.openURL(navState.url);
        return false;
      }
    }
  };

  return (
    <AppBackground isBusy={loading}>
      <AppHeader showBackButton title={''} />
      {Platform.OS === 'android' ? (
        <WebView
          style={styles.webview}
          originWhitelist={['*']}
          source={{uri: contentAn}}
          decelerationRate="normal"
          onMessage={event => Linking.openURL(event.nativeEvent.data)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={navState => {
            handleWebViewNavigationStateChange(navState);
          }}
          ref={webView => {
            webViewObj.ref = webView;
          }}
        />
      ) : (
        <WebView
          style={styles.webview}
          originWhitelist={['*']}
          source={contentIos}
          onMessage={event => onMessage(event)}
          decelerationRate="normal"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={navState => {
            handleWebViewNavigationStateChange(navState);
          }}
          bounces={false}
          ref={webView => {
            webViewObj.ref = webView;
          }}
        />
      )}
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

export default Policy;
