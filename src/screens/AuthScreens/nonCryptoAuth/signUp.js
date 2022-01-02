import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import AppBackground from '../../../components/appBackground';
import AppHeader from '../../../components/appHeader';
import { useSelector } from 'react-redux';
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
        if (!v) {
            errorRend.email = "Email is required!"
        } else if (!regEmail.test(v)) {
            errorRend.email = "Please enter a valid email address"
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
                errorF.signUpScreen = error.response.data.data;
                setError(errorF);
                setLoading(false);
            });
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader showBackButton title={''} />

            <ScrollView>
                <View style={styles.sectionCont} >

                    <Label label="Sign Up" containerStyle={{ marginTop: hp(6) }} />

                    {
                        error["signUpScreen"] ?
                            <Text style={styles.error}>{error["signUpScreen"]}</Text>
                            : null
                    }

                    <InputFields
                        label="User Name"
                        inputProps={{
                            value: name,
                            onChangeText: (v) => {
                                let errorRend = { ...error };
                                setName(v)
                                if (errorRend.hasOwnProperty('signUpScreen')) {
                                    delete errorRend.signUpScreen
                                }
                                if (!v) {
                                    errorRend.name = "Username is required!"
                                } else {
                                    if (errorRend.hasOwnProperty('name')) {
                                        delete errorRend.name
                                    }
                                }
                                setError(errorRend)
                            }
                        }}
                        error={error["name"]}
                    />
                    <InputFields
                        label="Email Address"
                        inputProps={{
                            value: email,
                            onChangeText: (v) => checkValidation(v),
                        }}
                        error={error["email"]}
                    />
                    <InputFields
                        label="Password"
                        error={error["password"]}
                        inputProps={{
                            value: password,
                            onChangeText: (v) => {
                                let errorRend = { ...error };
                                let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
                                setPassword(v)
                                if (errorRend.hasOwnProperty('signUpScreen')) {
                                    delete errorRend.signUpScreen
                                }
                                if (!v) {
                                    errorRend.password = "Password is required!"
                                } else if (!passwordRegex.test(v)) {
                                    errorRend.password = "Your password should be more than 8 digits with alphanumeric characters."
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
                        label="Enter Confirm Password"
                        error={error["cPassword"]}
                        inputProps={{
                            value: cpassword,
                            onChangeText: (v) => {
                                let errorRend = { ...error };
                                setCPassword(v)
                                if (errorRend.hasOwnProperty('signUpScreen')) {
                                    delete errorRend.signUpScreen
                                }
                                if (!v) {
                                    errorRend.cPassword = "Confirm Password is required!"
                                } else if (v !== password) {
                                    errorRend.cPassword = "Your Password doesn't match"
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
                        label="Next"
                    />

                </View>
            </ScrollView>

        </AppBackground>
    );
}

export default SignupCrypto;