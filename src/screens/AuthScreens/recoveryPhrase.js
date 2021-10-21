import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ImageBackground, Text, TextInput, TouchableOpacity, Keyboard, Alert, ScrollView } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import AppButton from '../../components/appButton';
import FetchingIndicator from '../../components/fetchingIndicator';
import CommonStyles from '../../constants/styles';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import { RF, hp, wp } from '../../constants/responsiveFunct';
import HintText from '../../components/hintText';
import ImagesSrc from '../../constants/Images';
import Colors from '../../constants/Colors';
import { setUserAuthData, startLoader, endLoader, getAddressNonce } from '../../store/reducer/userReducer';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../utils';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import { colors } from '../../res';

const ethers = require('ethers');

const toastConfig = {
    my_custom_type: ({ text1, props, ...rest }) => (
        <View style={{ paddingHorizontal: wp("20%"), borderRadius: wp('10%'), paddingVertical: hp("2%"), backgroundColor: colors.GREY5 }}>
            <Text style={{ color: colors.white, fontWeight: "bold" }} >{text1}</Text>
        </View>
    )
}

const RecoveryPhrase = ({ route, navigation }) => {

    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.UserReducer);

    const { recover } = route.params;
    const [wallet, setWallet] = useState(null);
    // const [phrase, setPhrase] = useState("");
    const [phrase, setPhrase] = useState("deputy miss kitten kiss episode humor chunk surround know omit disease elder");
    const toastRef = useRef(null);

    useEffect(() => {
        if (!recover) {
            getPhraseData()
        }
    }, []);

    const getPhraseData = async () => {
        dispatch(startLoader()).then(async () => {
            var randomSeed = ethers.Wallet.createRandom();
            const account = {
                mnemonic: randomSeed.mnemonic,
                address: randomSeed.address,
                privateKey: randomSeed.privateKey
            }
            console.log(randomSeed.mnemonic);
            console.log(randomSeed.address);
            console.log(randomSeed.privateKey);
            setWallet(account);
            dispatch(endLoader());
        });
    }

    const copyToClipboard = () => {
        toastRef.current.show({
            type: 'my_custom_type',
            text1: translate("wallet.common.phraseCopy"),
            topOffset: hp("10%"),
            visibilityTime: 500,
            autoHide: true,
        });
        Clipboard.setString(wallet.mnemonic.phrase);
    }

    const recoverWallet = () => {
        if (phrase !== "") {
            dispatch(startLoader()).then(async () => {
                let mnemonic = phrase;
                let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
                const account = {
                    mnemonic: mnemonicWallet.mnemonic,
                    address: mnemonicWallet.address,
                    privateKey: mnemonicWallet.privateKey
                }
                console.log(mnemonicWallet.mnemonic);
                console.log(mnemonicWallet.address);
                console.log(mnemonicWallet.privateKey);
                setWallet(account);
                // dispatch(setUserAuthData(account));
                dispatch(getAddressNonce(account, false))
                    .then(() => { })
                    .catch((err) => {
                        alertWithSingleBtn(translate("wallet.common.tryAgain"));
                    });
            }).catch((err) => {
                console.log('err', err.toString());
                if (err.toString() == 'Error: invalid mnemonic' || err.toString() == 'Error: invalid checksum') {

                    alertWithSingleBtn(
                        translate('common.error'),
                        translate('wallet.common.error.invalidPhrase')
                    )

                }
                dispatch(endLoader());
            });
        } else {
            alertWithSingleBtn(
                translate('common.error'),
                translate("wallet.common.requirePhrase")
            )
        }
    }

    const pastePhrase = async () => {
        const text = await Clipboard.getString();
        setPhrase(text);
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader
                showBackButton
                title={translate("wallet.common.backup")}
                showRightButton
                rightButtonComponent={<IconButton icon={ImagesSrc.infoIcon} color={Colors.labelButtonColor} size={20} />}
            />
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} KeyboardShiftStyle={styles.keyboardShift}>
                <View style={styles.container} >
                    <View style={styles.contentContainer}>
                        <View style={styles.padding}>
                            <AppLogo logoStyle={styles.logo} />
                            <TextView style={styles.title}>{translate("wallet.common.yourPhrase")}</TextView>
                            {
                                recover ?
                                    <HintText style={styles.hint}>{translate("wallet.common.phraseSaveInfo1")}</HintText>
                                    :
                                    <HintText style={styles.hint}>{translate("wallet.common.phraseSaveInfo")}</HintText>
                            }
                        </View>
                        <View>
                            {recover ?
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        multiline={true}
                                        value={phrase}
                                        onChangeText={setPhrase}
                                        underlineColorAndroid={Colors.transparent}
                                    />
                                    <TouchableOpacity onPress={() => pastePhrase()} style={{ position: "absolute", right: 0, bottom: 0, paddingHorizontal: wp('3%'), paddingVertical: hp('1%') }} >
                                        <Text style={{ color: Colors.themeColor }} >{translate("wallet.common.paste")}</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.phraseContainer}>
                                    {wallet ?
                                        wallet.mnemonic.phrase.split(' ').map((item, index) => {
                                            return <WordView word={item} index={index + 1} key={`_${index}`} />
                                        }) : null}
                                </View>
                            }
                        </View>
                        <View style={styles.rowPadding}>
                            {recover ? null : wallet && <Button mode={'text'} uppercase={false} color={Colors.labelButtonColor} onPress={() => { copyToClipboard() }}>
                                {translate("wallet.common.copy")}
                            </Button>}

                            {recover ? null : <View style={styles.alertContainer}>
                                <View style={styles.alert}>
                                    <IconButton icon={ImagesSrc.dangerIcon} color={Colors.alertText} size={20} />
                                    <TextView style={styles.alertTxt}>{translate("wallet.common.phraseNote")}</TextView>
                                </View>
                            </View>}
                        </View>
                    </View>

                    <View style={styles.bottomView}>
                        <AppButton label={translate("wallet.common.next")} view={recover ? !recover : !wallet} containerStyle={CommonStyles.button} labelStyle={CommonStyles.buttonLabel}
                            onPress={() => {
                                if (recover) {
                                    recoverWallet();
                                } else {
                                    // dispatch(setUserAuthData(wallet, true));
                                    navigation.replace("verifyPhrase", { wallet })
                                }

                            }} />
                    </View>

                </View>
            </KeyboardAwareScrollView>
            <Toast config={toastConfig} ref={toastRef} />
        </AppBackground>
    );
}

const WordView = (props) => {
    return (
        <View style={styles.word}>
            <TextView style={styles.wordTxt}>
                <Text style={{ color: Colors.townTxt }}>{props.index} </Text>
                {props.word}
            </TextView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    bottomView: {
        paddingHorizontal: wp("5%")
    },
    logo: {
        ...CommonStyles.imageStyles(25)
    },
    title: {
        alignSelf: 'center',
        fontSize: RF(2.7)
    },
    phraseContainer: {
        // height: hp("20%"),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        padding: wp("5%"),
        paddingBottom: 0
    },
    img: {
        ...CommonStyles.imageStyles(40),
        ...CommonStyles.center
    },
    alertContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    alert: {
        flexDirection: 'row',
        backgroundColor: Colors.alertBg,
        padding: wp("4%"),
        borderRadius: wp("2%"),
        alignItems: 'center',
    },
    alertTxt: {
        color: Colors.alertText,
        flex: 1,
        fontSize: RF(1.5)
    },
    word: {
        flexDirection: 'row',
        borderColor: Colors.borderLightColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: wp("2%"),
        paddingHorizontal: wp("3%"),
        margin: wp("1%")
    },
    wordTxt: {
        fontSize: RF(1.8),
        color: Colors.black
    },
    inputContainer: {
        padding: wp("3.5%"),
        backgroundColor: Colors.inputBackground2
    },
    input: {
        fontSize: RF(2),
        color: Colors.black,
        minHeight: hp("20%"),
        textAlignVertical: 'top'
    },
    padding: {
        padding: wp("5%"),
        paddingBottom: 0
    },
    rowPadding: {
        flex: 1,
        paddingHorizontal: wp("5%")
    },
    scrollContent: {
        flexGrow: 1,
    },
    keyboardShift: {
        flex: 1,
    }
});

export default RecoveryPhrase;
