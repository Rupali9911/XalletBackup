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
                console.log(response, "verify success")
                setError("");
                setshowSuccess("Email verified!");
                const successTO = setTimeout(() => {
                    navigation.navigate('CryptoLogin');
                    clearTimeout(successTO);
                }, 5000);
                navigation.navigate("")
                setLoading(false);
            })
            .catch(error => {
                console.log(error.response, "verify error")
                setError(error.response.data.data);
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
                console.log(response, "r verify success")
                setshowSuccess("Email Sent Successfully!");
                const successTO = setTimeout(() => {
                    setshowSuccess("")
                    clearTimeout(successTO);
                }, 5000);
                setError("");
                setLoading(false);
            })
            .catch(error => {
                console.log(error.response, "r verify error")
                setError(error.response.data.data);
                setLoading(false);
            });
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader showBackButton title={''} />

            <View style={styles.sectionCont} >

                <Text style={[styles.error, { color: colors.GREY14, marginTop: hp(10) }]}>Verification Code has been sent to the email {email}  kindly enter it here to verify your account</Text>
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
                    label="Verification Code"
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
                    label="Verify Code"
                />
                <FormButton
                    onPress={resendVerify}
                    gradient={[colors.white, colors.white]}
                    buttonLabel={{ color: colors.BLUE6 }}
                    buttonCont={{ marginVertical: 0 }}
                    label="Resend Verification Code"
                />

            </View>

        </AppBackground>
    );
}

export default Verify;