import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useSelector } from 'react-redux';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppLogo from '../../components/appLogo';
import AppHeader from '../../components/appHeader';
import AppInput from '../../components/appInput';
import ButtonInputContainer from '../../components/buttonInputContainer';
import TextView from '../../components/appText';
import { RF, hp, wp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { translate } from '../../walletUtils';
import Colors from "../../constants/Colors";
import Fonts from '../../constants/Fonts';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Clipboard from '@react-native-clipboard/clipboard';

const Tab = createMaterialTopTabNavigator();

const TabItem = () => {

    const [phrase, setPhrase] = useState("");

    const pastePhrase = async () => {
        const text = await Clipboard.getString();
        setPhrase(text);
    };

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{ flexGrow: 1, flex: 1 }}
        >
            <View style={styles.itemCont} >
                <ButtonInputContainer view={true} containerStyle={[styles.outlineButton, { height: hp("20%") }]} >
                    <TextInput
                        style={styles.input}
                        multiline={true}
                        value={phrase}
                        onChangeText={e => setPhrase(e)}
                        underlineColorAndroid={Colors.transparent}
                    />
                    <TouchableOpacity
                        onPress={() => pastePhrase()}
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            paddingHorizontal: wp('3%'),
                            paddingVertical: hp('1%'),
                        }}>
                        <Text style={{ color: Colors.themeColor, fontSize: RF("1.6"), fontFamily: Fonts.PINGfANG }}>
                            {translate('wallet.common.paste')}
                        </Text>
                    </TouchableOpacity>
                </ButtonInputContainer>
            </View>
        </KeyboardAvoidingView>
    )
}

const ImportWalletScreen = ({ route, navigation }) => {

    const [walletname, setWalletname] = useState("");

    return (
        <AppBackground>
            <ScrollView>
                <AppHeader showBackButton title={''} />

                <View style={CommonStyles.screenContainer}>
                    <AppLogo
                        labelStyle={styles.title}
                        label={translate('wallet.common.importWallet')}
                        logoStyle={styles.logo} />

                    <Text style={styles.inputLabel} >{translate('wallet.common.nameYWallet')}</Text>
                    <AppInput
                        containerStyle={styles.outlineButton}
                        placeholder={translate('wallet.common.walletName')}
                        placeholderTextColor={Colors.greyButtonLabel}
                        value={walletname}
                        onChangeText={e => setWalletname(e)}
                    />

                    <Tab.Navigator
                        tabBarOptions={{
                            activeTintColor: Colors.BLUE4,
                            inactiveTintColor: Colors.GREY1,
                            style: {
                                boxShadow: 'none',
                                elevation: 0,
                                borderBottomWidth: 1,
                                borderBottomColor: Colors.borderLightColor2,
                                shadowOpacity: 0,
                            },
                            tabStyle: {
                                height: hp("7%"),
                                paddingHorizontal: wp('1%'),
                            },
                            labelStyle: {
                                fontSize: RF(1.6),
                                fontFamily: Fonts.PINGfANG,
                                textTransform: 'capitalize',
                            },
                            indicatorStyle: {
                                borderColor: Colors.BLUE4,
                                height: 1,
                            },
                        }}>
                        <Tab.Screen
                            name={translate('wallet.common.phrase')}
                            component={TabItem} />
                        <Tab.Screen
                            name={translate('wallet.common.privateKey')}
                            component={TabItem}
                        />
                        <Tab.Screen
                            name={translate('common.address')}
                            component={TabItem}
                        />
                    </Tab.Navigator>

                    <View style={{ marginTop: hp("6%") }} >
                        <AppButton
                            label={translate('wallet.common.createAccount')}
                            containerStyle={CommonStyles.button}
                            labelStyle={CommonStyles.buttonLabel}
                            onPress={() => {

                            }}
                        />
                        <AppButton
                            label={translate('wallet.common.haveWallet')}
                            containerStyle={styles.outlineButton}
                            labelStyle={CommonStyles.outlineButtonLabel}
                            onPress={() => {

                            }}
                        />
                    </View>

                </View>
            </ScrollView>

        </AppBackground >
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
    logo: {
        ...CommonStyles.imageStyles(25),
    },
    input: {
        fontSize: RF(1.7),
        color: Colors.black,
        width: "100%",
        minHeight: hp('20%'),
        textAlignVertical: 'top',
    },
    itemCont: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: hp('1.5%')
    },
    title: {
        alignSelf: 'center',
        fontFamily: Fonts.ARIAL,
        fontWeight: "500",
        fontSize: RF(2.7),
        marginTop: hp("2%")
    },
    inputLabel: {
        fontSize: RF(1.4),
        color: Colors.tabLabel,
        marginTop: hp("3%"),
        fontWeight: "500",
        fontFamily: Fonts.ARIAL,
        marginLeft: wp("3%")
    },
    outlineButton: {
        backgroundColor: Colors.inputBackground,
        borderColor: Colors.lightBorder1,
        borderWidth: 1
    }
});

export default ImportWalletScreen;
