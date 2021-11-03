import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import AppBackground from '../../components/appBackground';
import WebView from 'react-native-webview';
import AppHeader from '../../components/appHeader';
import { useSelector } from 'react-redux';

const policy = {
    en: require('../../walletUtils/policy.html'),
    ja: require('../../walletUtils/policy_ja.html'),
    ko: require('../../walletUtils/policy_ko.html'),
    ch: require('../../walletUtils/policy_ch.html'),
    tw: require('../../walletUtils/policy_tw.html'),
};
const terms = {
    en: require('../../walletUtils/terms.html'),
    ja: require('../../walletUtils/terms_ja.html'),
    ko: require('../../walletUtils/terms_ko.html'),
    ch: require('../../walletUtils/terms_ch.html'),
    tw: require('../../walletUtils/terms_tw.html'),
};
const AnPolicy = {
    en: { uri: 'file:///android_asset/policy.html' },
    ja: { uri: 'file:///android_asset/policy_ja.html' },
    ko: { uri: 'file:///android_asset/policy_ko.html' },
    ch: { uri: 'file:///android_asset/policy_ch.html' },
    tw: { uri: 'file:///android_asset/policy_tw.html' },

};
const AnTerms = {
    en: { uri: 'file:///android_asset/terms.html' },
    ja: { uri: 'file:///android_asset/terms_ja.html' },
    ko: { uri: 'file:///android_asset/terms_ko.html' },
    ch: { uri: 'file:///android_asset/terms_ch.html' },
    tw: { uri: 'file:///android_asset/terms_tw.html' },
};

const Policy = ({ route }) => {

    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

    const { isPolicy } = route.params;

    const [loading, setLoading] = useState(true);

    let content = isPolicy ?
        policy[selectedLanguageItem.language_name] :
        terms[selectedLanguageItem.language_name];

    return (
        <AppBackground isBusy={loading}>
            <AppHeader showBackButton title={''} />
            {Platform.OS === 'android'
                ? (
                    <WebView
                        style={styles.webview}
                        originWhitelist={['*']}
                        source={isPolicy ? AnPolicy[selectedLanguageItem.language_name] : AnTerms[selectedLanguageItem.language_name]}
                        decelerationRate='normal'
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                    />
                )
                :
                <WebView
                    style={styles.webview}
                    originWhitelist={['*']}
                    source={content}
                    decelerationRate='normal'
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                />
            }
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    webview: {
        flex: 1
    }
});

export default Policy;