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

  let contentAn = isPolicy ? 'file:///android_asset/policy.html' : 'file:///android_asset/terms.html';

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
        />
      ) : (
        <WebView
          style={styles.webview}
          originWhitelist={['*']}
          source={contentIos}
          onMessage={event => Linking.openURL(event.nativeEvent.data)}
          decelerationRate="normal"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
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
