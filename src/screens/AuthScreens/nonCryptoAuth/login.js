import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Touchable } from 'react-native';
import AppBackground from '../../../components/appBackground';
import AppHeader from '../../../components/appHeader';
import { useDispatch, useSelector } from 'react-redux';
import KeyboardAwareScrollView from '../../../components/keyboardAwareScrollView';

import styles from "./styles";
import { Label, InputFields, FormButton } from "./components";
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
import { setUserData, startLoading, endLoading } from '../../../store/reducer/userReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginCrypto = ({ route, navigation }) => {
    const dispatch = useDispatch();

    const { loading } = useSelector(state => state.UserReducer);

    const [error, setError] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {

        return () => {
            setEmail('');
            setPassword('');
            setError({});
        };
    }, []);

    const login = () => {

        let errorF = {};
        dispatch(startLoading());

        let url = `${BASE_URL}/auth/signin`;

        let body = {
            email: email,
            password: password
        }

        axios.post(url, body)
            .then(async response => {
                console.log(response.data.data, "Sign in success")
                if (response.data.success) {
                    let tempData = {
                        user: response.data.data.user,
                        token: response.data.data.accessToken
                    }
                    await AsyncStorage.setItem('@userData', JSON.stringify(tempData));
                    dispatch(
                        setUserData({
                            data: tempData,
                            wallet: "",
                            isCreate: false,
                            showSuccess: false,
                        }),
                    );
                }
                setError({});
                dispatch(endLoading());

            })
            .catch(error => {
                dispatch(endLoading());

                console.log(error.response.data, "Sign in error")
                if (!error.response.data.success) {
                    if (error.response.data.data == "Please verify your email") {
                        navigation.navigate("CryptoVerify", { email })
                    } else {
                        errorF.password = translate(`common.${error.response.data.error_code}`);
                        setError(errorF);
                    }
                } else {
                    errorF.password = translate(`common.${error.response.data.error_code}`);
                    setError(errorF);
                }
            });
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader showBackButton title={translate('wallet.common.loginWithAccount')} />
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContent}
                KeyboardShiftStyle={styles.keyboardShift}>
                <View style={styles.sectionCont} >

                    <AppLogo />

                    <Label label={translate("common.UserLogin")} containerStyle={{ marginTop: hp(6) }} />

                    <InputFields
                        label={translate("common.emailAddressUsername")}
                        inputProps={{
                            value: email,
                            onChangeText: (v) => {
                                let errorRend = {}
                                setEmail(v)
                                if (!v) {
                                    errorRend.email = translate("common.emailUserRequired")
                                }
                                setError(errorRend)
                            }
                        }}
                        error={error["email"]}
                    />
                    <InputFields
                        label={translate("common.password")}
                        inputProps={{
                            secureTextEntry: true,
                            value: password,
                            onChangeText: (v) => {
                                let errorRend = {};
                                setPassword(v)
                                if (!v) {
                                    errorRend.password = translate("common.passwordReq")
                                }
                                setError(errorRend)
                            }
                        }}
                        error={error["password"]}
                    />
                    <FormButton
                        onPress={login}
                        disable={!email || !password || Object.keys(error).length !== 0}
                        gradient={[colors.themeL, colors.themeR]}
                        label={translate("common.signIn")}
                    />

                    <View style={styles.bottomLogin} >
                        <TouchableOpacity onPress={() => navigation.navigate("CryptoSignUp")} >
                            <Text style={styles.loginBTxt} >{translate("common.createNewAccount")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("CryptoForget")} >
                            <Text style={styles.loginBTxt} >{translate("common.ForgottenUser")}?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </AppBackground>
    );
}

export default LoginCrypto;
