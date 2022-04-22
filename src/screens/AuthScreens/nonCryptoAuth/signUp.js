import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import AppBackground from '../../../components/appBackground';
import AppHeader from '../../../components/appHeader';
import { useSelector } from 'react-redux';
import KeyboardAwareScrollView from '../../../components/keyboardAwareScrollView';
import {
    useNavigation
} from '@react-navigation/native';
import styles from "./styles";
import { Label, FormButton, InputFields } from "./components";
import { colors, fonts } from '../../../res';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    responsiveFontSize as RF,
} from '../../../common/responsiveFunction';
import axios from "axios";
import { BASE_URL } from '../../../common/constants';
import AppLogo from '../../../components/appLogo';
import { translate } from '../../../walletUtils';

const SignupCrypto = ({ route }) => {

    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");

    const [error, setError] = useState({});

    const checkValidation = (v) => {
        let errorRend = { ...error }
        setEmail(v)
        let regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (errorRend.hasOwnProperty('signUpScreen')) {
            delete errorRend.signUpScreen
        }
        // if (!v) {
        //     errorRend.email = translate("wallet.common.error.emailRequired")
        // } else
            if (v && !regEmail.test(v)) {
            errorRend.email = translate("common.emailval")
        } else {
            if (errorRend.hasOwnProperty('email')) {
                delete errorRend.email
            }
        }
        setError(errorRend)
    }

    const SignUp = () => {
        let errorF = {};
        setLoading(true);

        let url = `${BASE_URL}/auth/signup`;

        let body = {
            locale: selectedLanguageItem.language_name,
            referralCode: "",
            username: name,
            email: email,
            password: password,
        }
        console.log(body, "Sign up body")

        axios.post(url, body)
            .then(response => {
                console.log(response, "Sign up success")
                navigation.navigate("CryptoVerify", { email })
                setError({});
                setLoading(false);
            })
            .catch(error => {
                console.log(error.response, "Sign up error")
                errorF.signUpScreen = translate(`common.${error.response.data.error_code}`);
                setError(errorF);
                setLoading(false);
            });
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader showBackButton title={''} />

            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContent}
                KeyboardShiftStyle={styles.keyboardShift}>
                <View style={styles.sectionCont} >
                    <AppLogo />
                    <Label label={translate("common.signup")} containerStyle={{ marginTop: hp(6) }} />

                    {
                        error["signUpScreen"] ?
                            <Text style={styles.error}>{error["signUpScreen"]}</Text>
                            : null
                    }

                    <InputFields
                        label={translate("common.UserName")}
                        inputProps={{
                            value: name,
                            onChangeText: (v) => {
                                let errorRend = { ...error };
                                setName(v)
                                if (errorRend.hasOwnProperty('signUpScreen')) {
                                    delete errorRend.signUpScreen
                                }
                                // if (!v) {
                                //     errorRend.name = translate("wallet.common.error.fieldRequired")
                                // } else {
                                    if (errorRend.hasOwnProperty('name')) {
                                        delete errorRend.name
                                    }
                               // }
                                setError(errorRend)
                            }
                        }}
                        error={error["name"]}
                    />
                    <InputFields
                        label={translate("common.userEmail")}
                        inputProps={{
                            value: email,
                            onChangeText: (v) => checkValidation(v),
                        }}
                        error={error["email"]}
                    />
                    <InputFields
                        label={translate("common.password")}
                        error={error["password"]}
                        inputProps={{
                            value: password,
                            onChangeText: (v) => {
                                let errorRend = { ...error };
                                const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/

                                setPassword(v)
                                if (errorRend.hasOwnProperty('signUpScreen')) {
                                    delete errorRend.signUpScreen
                                }
                                // if (!v) {
                                //     errorRend.password = translate("common.passwordReq")
                                // } else
                                    if (v && !passwordRegex.test(v)) {
                                    errorRend.password = translate("common.PassVal")
                                } else {
                                    if (errorRend.hasOwnProperty('password')) {
                                        delete errorRend.password
                                    }
                                }
                                setError(errorRend)
                            },
                            secureTextEntry: true
                        }}
                    />
                    <InputFields
                        label={translate("common.confirmPassword")}
                        error={error["cPassword"]}
                        inputProps={{
                            value: cpassword,
                            onChangeText: (v) => {
                                let errorRend = { ...error };
                                setCPassword(v)
                                if (errorRend.hasOwnProperty('signUpScreen')) {
                                    delete errorRend.signUpScreen
                                }
                                // if (!v) {
                                //     errorRend.cPassword = translate("wallet.common.error.confirmPasswordRequired")
                                // } else
                                    if (v && v !== password) {
                                    errorRend.cPassword = translate("common.passwordmismatch")
                                } else {
                                    if (errorRend.hasOwnProperty('cPassword')) {
                                        delete errorRend.cPassword
                                    }
                                }
                                setError(errorRend)
                            },
                            secureTextEntry: true
                        }}
                    />

                    <FormButton
                        onPress={SignUp}
                        disable={!name || !email || !password || !cpassword || Object.keys(error).length !== 0}
                        gradient={[colors.themeL, colors.themeR]}
                        label={translate("common.NEXT")}
                    />

                </View>
            </KeyboardAwareScrollView>

        </AppBackground>
    );
}

export default SignupCrypto;
