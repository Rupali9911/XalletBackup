import React, { useState } from 'react';
import { View, Text } from 'react-native';
import AppBackground from '../../../components/appBackground';
import AppHeader from '../../../components/appHeader';
import { useSelector } from 'react-redux';
import {
    useNavigation
} from '@react-navigation/native';
import styles from "./styles";
import { Label, FormButton, InputFields } from "./components";
import { colors } from '../../../res';
import {
    heightPercentageToDP as hp,
} from '../../../common/responsiveFunction';
import axios from "axios";
import { BASE_URL } from '../../../common/constants';
import AppLogo from '../../../components/appLogo';
import { translate } from '../../../walletUtils';

const Verify = ({ route }) => {
    const navigation = useNavigation();

    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [showSuccess, setshowSuccess] = useState("");
    const { email } = route.params;

    const sendVerify = () => {
        setError("")
        setLoading(true);

        let url = `${BASE_URL}/auth/verify-email`;
        // let url = `https://api.xanalia.com/auth/verify-email`;

        let body = {
            code: code
        }

        axios.post(url, body, {})
            .then(response => {
                setError("");
                setshowSuccess(translate("common.emailverified"));
                const successTO = setTimeout(() => {
                    navigation.navigate('CryptoLogin');
                    clearTimeout(successTO);
                    setLoading(false);
                }, 5000);
            })
            .catch(error => {
                console.log(error.response, "verify error")
                setError(translate(`common.${error.response.data.error_code}`));
                setLoading(false);
            });
    }

    const resendVerify = () => {
        setError("")
        setLoading(true);

        let url = `${BASE_URL}/auth/resend-email`;

        let body = {
            email: email,
            locale: selectedLanguageItem.language_name,
        }

        axios.post(url, body)
            .then(response => {
                setshowSuccess(translate("common.emailsendsuccess"));
                const successTO = setTimeout(() => {
                    setshowSuccess("")
                    clearTimeout(successTO);
                }, 5000);
                setError("");
                setLoading(false);
            })
            .catch(error => {
                console.log(error.response, "r verify error")
                setError(translate(`common.${error.response.data.error_code}`));
                setLoading(false);
            });
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader showBackButton title={''} />

            <View style={styles.sectionCont} >

                <AppLogo />

                <Text style={[styles.error, { color: colors.GREY14, marginTop: hp(10) }]}>{translate("common.verificationCode")}{email}{translate("common.kindlyEnter")}</Text>
                {
                    error ?
                        <Text style={styles.error}>{error}</Text>
                        : null
                }
                {
                    showSuccess ?
                        <Text style={[styles.error, { color: colors.GREEN1, fontWeight: "bold" }]}>{showSuccess}</Text>
                        : null
                }

                <InputFields
                    label={translate("common.VerificationCode")}
                    inputProps={{
                        value: code,
                        onChangeText: (v) => {
                            setError("")
                            setCode(v)
                        }
                    }}
                />

                <FormButton
                    onPress={sendVerify}
                    disable={!code || error}
                    gradient={[colors.themeL, colors.themeR]}
                    label={translate("common.VERIFYEMAIL")}
                />
                <FormButton
                    onPress={resendVerify}
                    gradient={[colors.white, colors.white]}
                    buttonLabel={{ color: colors.BLUE6 }}
                    buttonCont={{ marginVertical: 0 }}
                    label={translate("common.ResendVerificationCode")}
                />

            </View>

        </AppBackground>
    );
}

export default Verify;