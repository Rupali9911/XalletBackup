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

const ethers = require('ethers');

const Backup = ({ navigation }) => {

    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.UserReducer);

    const [openPicker, setOpenPicker] = useState(false);
    const [isCheck, setCheck] = useState(false);
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        getPhraseData()
    }, []);

    const getPhraseData = async () => {
        dispatch(startLoader()).then(async () => {
            var randomSeed = ethers.Wallet.createRandom();
            const account = {
                mnemonic: randomSeed.mnemonic,
                address: randomSeed.address,
                privateKey: randomSeed.privateKey
            }
            console.log(randomSeed.mnemonic);
            console.log(randomSeed.address);
            console.log(randomSeed.privateKey);
            setWallet(account);
            dispatch(endLoader());
        });
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
                    <AppLogo logoStyle={styles.logo} />
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
                        // disabled={!isCheck}
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
    logo: {
        ...CommonStyles.imageStyles(25)
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
