import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ImageBackground, Text, TextInput, Keyboard, Alert, ScrollView } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';

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
import { setUserAuthData, endLoader, getAddressNonce } from '../../store/reducer/userReducer';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../utils';
// import SingleSocket from '../../helpers/SingleSocket';
// import { Events } from '../../navigations';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ethers = require('ethers');

const VerifyPhrase = ({ route, navigation }) => {

    const dispatch = useDispatch();
    const { wallet } = route.params;
    const [loading, setLoading] = useState(false);
    const [phrase, setPhrase] = useState([]);
    const [covertWallet, setConvertWallet] = useState([]);
    const [message, setMessage] = useState({ status: "", message: "" });

    useEffect(() => {

        setLoading(true);
        let convertStringToArray = wallet.mnemonic.phrase.split(" ");
        for (let i = convertStringToArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [convertStringToArray[i], convertStringToArray[j]] = [convertStringToArray[j], convertStringToArray[i]];
        }
        setConvertWallet(convertStringToArray);
        setLoading(false)
    }, [])

    const addSelectedPhrase = (item, index) => {
        let phraseArr = [...phrase, item];
        setPhrase(phraseArr)
        setConvertWallet(covertWallet.filter((value, i) => i != index))
        checkingOrder(phraseArr)
    }

    const removeSelectedPhrase = (item, index) => {
        let phraseArr = phrase.filter((value, i) => i != index);
        setPhrase(phraseArr)
        setConvertWallet([...covertWallet, item])
        checkingOrder(phraseArr)
    }

    const checkingOrder = (phraseArr) => {
        let convertStringToArray = wallet.mnemonic.phrase.split(" ");
        let walletListConvert = convertStringToArray.slice(0, phraseArr.length)

        if (phraseArr.length == 0) {
            setMessage({ status: "", message: "" })
            return;
        } else if (walletListConvert.join(" ") !== phraseArr.join(" ")) {
            setMessage({ status: "error", message: translate("wallet.common.invalidOrder") })
            return;
        } if (JSON.stringify(walletListConvert) === JSON.stringify(phraseArr) && phraseArr.length === convertStringToArray.length) {
            setMessage({ status: "success" })
            return;
        } else {
            setMessage({ status: "", message: "" })
            return;
        }
    }

    return (
        <AppBackground>
            {
                loading &&
                <FetchingIndicator />
            }
            <AppHeader
                showBackButton
                title={translate("wallet.common.backup")}
                showBackButton
                showRightButton
                rightButtonComponent={<IconButton icon={ImagesSrc.infoIcon} color={Colors.labelButtonColor} size={20} />}
            />
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} KeyboardShiftStyle={styles.keyboardShift}>
                <View style={styles.container} >
                    <View style={styles.contentContainer}>
                        <View style={styles.padding}>
                            <AppLogo logoStyle={styles.logo} />
                            <TextView style={styles.title}>{translate("wallet.common.verifyPhrase")}</TextView>
                            <HintText style={styles.hint} >{translate("wallet.common.verifyHint1") + '\n' + translate("wallet.common.verifyHint2")}</HintText>
                        </View>

                        <View style={styles.phraseMainCont} >
                            <View style={styles.selectedPhraseCont} >
                                {phrase ?
                                    phrase.map((item, index) => {
                                        return (
                                            <WordView
                                                onPress={() => removeSelectedPhrase(item, index)}
                                                word={item}
                                                index={index + 1}
                                                key={`_${index}`}
                                            />
                                        )
                                    }) : null
                                }
                            </View>
                            <View style={styles.bottomMessageCont} >
                                <Text style={{ marginTop: hp('1%'), textAlign: "center", color: Colors.danger }} >{message.message}</Text>
                            </View>
                        </View>

                        <View>
                            <View style={styles.phraseContainer}>
                                {covertWallet ?
                                    covertWallet.map((item, index) => {
                                        return (
                                            <WordView
                                                onPress={() => addSelectedPhrase(item, index)}
                                                hideNumber={true}
                                                word={item}
                                                index={index + 1}
                                                key={`_${index}`}
                                            />
                                        )
                                    }) : null
                                }
                            </View>
                        </View>
                    </View>

                </View>
            </KeyboardAwareScrollView>
            <View style={styles.bottomView}>
                <AppButton
                    label={translate("wallet.common.next")}
                    view={message.status === "success" ? false : true}
                    containerStyle={CommonStyles.button}
                    labelStyle={CommonStyles.buttonLabel}
                    onPress={() => {
                        if (wallet) {
                            setLoading(true);
                            dispatch(getAddressNonce(wallet, true)).then(() => {
                                setLoading(false);
                            }).catch((err) => {
                                setLoading(false);
                                alertWithSingleBtn(translate("wallet.common.tryAgain"));
                            });
                        }
                    }}
                />
            </View>
        </AppBackground>
    );
}

const WordView = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={[styles.word, { backgroundColor: !props.hideNumber ? Colors.white : "transparent" }]}>
            <TextView style={styles.wordTxt}>
                {!props.hideNumber ?
                    <Text style={{ color: Colors.townTxt }}>{props.index} </Text>
                    : null}
                {props.word}
            </TextView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
    hint: {
        marginVertical: hp("2%")
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
    },
    phraseMainCont: {
        backgroundColor: Colors.inputBackground2,
        width: "100%",
        minHeight: hp("22%"),
        paddingVertical: hp("2%"),
        paddingHorizontal: wp("3%"),
        justifyContent: 'center',
        overflow: "hidden"
    },
    selectedPhraseCont: {
        justifyContent: 'center',
        width: "100%",
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    bottomMessageCont: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    }
});

export default VerifyPhrase;