import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Touchable } from 'react-native';
import AppBackground from '../../../components/appBackground';
import AppHeader from '../../../components/appHeader';
import { useSelector } from 'react-redux';

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

const LoginCrypto = ({ route, navigation }) => {

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {

        let errorF = {};
        setLoading(true);

        let url = `${BASE_URL}/auth/signin`;

        let body = {
            email: email,
            password: password
        }

        axios.post(url, body)
            .then(response => {
                console.log(response, "Sign in success")
                setError({});
                setLoading(false);
            })
            .catch(error => {
                console.log(error.response, "Sign in error")
                errorF.email = error.response.data.errors._error;
                errorF.password = error.response.data.errors.password;
                setError(errorF);
                setLoading(false);
            });
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader title={''} />
            <View style={styles.sectionCont} >

                <Label label="User Login" containerStyle={{ marginTop: hp(6) }} />

                <InputFields
                    label="Email Address / User Name"
                    inputProps={{
                        value: email,
                        onChangeText: (v) => {
                            let errorRend = {}
                            setEmail(v)
                            if (!v) {
                                errorRend.email = "Email/Username is required!"
                            }
                            setError(errorRend)
                        }
                    }}
                    error={error["email"]}
                />
                <InputFields
                    label="Password"
                    inputProps={{
                        secureTextEntry: true,
                        value: password,
                        onChangeText: (v) => {
                            let errorRend = {};
                            setPassword(v)
                            if (!v) {
                                errorRend.password = "Password is required!"
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
                    label="Login"
                />

                <View style={styles.bottomLogin} >
                    <TouchableOpacity onPress={() => navigation.navigate("CryptoSignUp")} >
                        <Text style={styles.loginBTxt} >Create an account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("CryptoForget")} >
                        <Text style={styles.loginBTxt} >Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </AppBackground>
    );
}

export default LoginCrypto;