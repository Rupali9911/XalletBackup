import React, { useState } from 'react';
import { View, Text } from 'react-native';
import AppBackground from '../../../components/appBackground';
import AppHeader from '../../../components/appHeader';
import { useSelector } from 'react-redux';

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

const ForgetCrypto = ({ route }) => {

    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [email, setEmail] = useState("");
    const [showSuccess, setshowSuccess] = useState("");

    const checkValidation = (v) => {
        let errorRend = {}
        setEmail(v)
        let regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!v) {
            errorRend.email = translate("wallet.common.error.emailRequired")
        } else if (!regEmail.test(v)) {
            errorRend.email = translate("wallet.common.error.invalidEmail")
        }
        setError(errorRend)
    }

    const sendEmail = async () => {

        let errorF = {};
        setLoading(true);
        setshowSuccess("");

        let url = `${BASE_URL}/auth/forgot-password`;

        let body = {
            email: email,
            locale: selectedLanguageItem.language_name
        }

        axios.post(url, body)
            .then(response => {
                console.log(response, "forget success")
                setshowSuccess(translate("common.emailsendsuccess"));
                setEmail("")
                setError({});
                setLoading(false);
            })
            .catch(error => {
                console.log(error.response, "forget error")
                errorF.errorForget = error.response.data.errors.email;
                setError(errorF);
                setLoading(false);

            });
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader showBackButton title={''} />

            <View style={styles.sectionCont} >
            <AppLogo/>
                <Label label={translate("common.ForgottenUser")} containerStyle={{ marginTop: hp(6) }} />

                {
                    error["errorForget"] ?
                        <Text style={styles.error}>{error["errorForget"]}</Text>
                        : null
                }

                {
                    showSuccess ?
                        <Text style={[styles.error, { color: colors.GREEN1, fontWeight: "bold" }]}>{showSuccess}</Text>
                        : null
                }

                <InputFields
                    label={translate("common.userEmail")}
                    inputProps={{
                        value: email,
                        onChangeText: (v) => checkValidation(v)
                    }}
                    error={error["email"]}
                />

                <FormButton
                    onPress={sendEmail}
                    disable={!email || Object.keys(error).length !== 0}
                    gradient={[colors.themeL, colors.themeR]}
                    label={translate("common.SENDEMAIL")}
                />

            </View>

        </AppBackground>
    );
}

export default ForgetCrypto;