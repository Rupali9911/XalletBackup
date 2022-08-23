import
React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import Checkbox from '../../components/checkbox';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import { hp, RF } from '../../constants/responsiveFunct';
import HintText from '../../components/hintText';
import ImagesSrc from '../../constants/Images';
import { translate } from '../../walletUtils';
import { SIZE } from 'src/constants';
import { startLoader, endLoader, getAddressNonce } from '../../store/reducer/userReducer';
import { useDispatch } from 'react-redux';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Colors from '../../constants/Colors';
import { alertWithSingleBtn } from '../../common/function';
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";
import bip39 from 'react-native-bip39'
import { hdkey } from 'ethereumjs-wallet'
const Web3 = require('web3');

const Backup = ({ navigation }) => {

    const dispatch = useDispatch();
    // const { loading } = useSelector(state => state.UserReducer);
    const [loading, setLoading] = useState(true);
    const [openPicker, setOpenPicker] = useState(false);
    const [isCheck, setCheck] = useState(false);
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        getPhraseData()
    }, []);

    const getPhraseData = async () => {
        let randomSeed = await bip39.generateMnemonic()
        const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(randomSeed));
        const path = "m/44'/60'/0'/0/0";
        const wallet = hdwallet.derivePath(path).getWallet();
        const address = `0x${wallet.getAddress().toString('hex')}`;
        const privateKey = `0x${wallet.getPrivateKey().toString('hex')}`;
       
        const Web3 = require("web3");
         var web3 = new Web3(Web3.givenProvider);
        // var web3 = new Web3('https://bsc-dataseed.binance.org/');
        

        console.log('HD wallet ----------------->', hdwallet)
        console.log('wallet ----------------->', wallet)
        console.log('address ----------------->', address)
        console.log(await web3.eth.accounts.sign('Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!', privateKey));
        const account = {
            mnemonic: {
                phrase: randomSeed
            },
            address: address,
            privateKey: privateKey
        }
        setWallet(account);
        setLoading(false);
    }

    const saveWallet = () => {
        dispatch(getAddressNonce(wallet, false, true))
            .then(() => { })
            .catch((err) => {
                alertWithSingleBtn(translate('wallet.common.alert'), translate("wallet.common.tryAgain"));
            });
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader showBackButton title={translate("wallet.common.backup")} />
            <View style={CommonStyles.screenContainer} onStartShouldSetResponder={() => {
                setOpenPicker(!openPicker)
                return true;
            }}>

                <View style={styles.contentContainer}>
                    <AppLogo />
                    <TextView style={styles.title}>{translate("wallet.common.backupTxt")} !</TextView>
                    <HintText >{translate("wallet.common.phraseHint")}</HintText>
                    <View style={styles.imgContainer}>
                        <ImageBackground style={styles.img} source={ImagesSrc.backupImg}>
                            <Image source={ImagesSrc.backupLoaderImg} style={{ ...CommonStyles.imageStyles(16.8), marginRight: SIZE(5) }} />
                        </ImageBackground>

                    </View>
                </View>

                <View>
                    <Checkbox isCheck={isCheck} onChecked={setCheck} label={translate("wallet.common.phraseAlert")} />
                    <AppButton label={translate("wallet.common.next")} view={!isCheck} containerStyle={CommonStyles.button} labelStyle={CommonStyles.buttonLabel}
                        onPress={() => {
                            navigation.navigate("recoveryPhrase", { hide: false, wallet });
                        }}
                    />
                    <Button
                        uppercase={false}
                        color={Colors.themeColor}
                        style={{ marginBottom: hp("1%") }}
                        onPress={saveWallet}>
                        {translate("wallet.common.doItLater")}
                    </Button>
                </View>

            </View>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
    title: {
        alignSelf: 'center',
        fontSize: RF(2.7)
    },
    imgContainer: {
        flex: 1,
        ...CommonStyles.center
    },
    img: {
        ...CommonStyles.imageStyles(40),
        ...CommonStyles.center
    }
});

export default Backup;
