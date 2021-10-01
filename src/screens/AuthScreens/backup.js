import React, { useState } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import LanguageSelector from '../../components/languageSelector';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import Checkbox from '../../components/checkbox';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import { RF } from '../../constants/responsiveFunct';
import HintText from '../../components/hintText';
import ButtonGroup from '../../components/buttonGroup';
import ImagesSrc from '../../constants/Images';
import { translate } from '../../walletUtils';

const Backup = ({route, navigation}) => {

    const [openPicker, setOpenPicker] = useState(false);
    const [isCheck, setCheck] = useState(false);

    return (
        <AppBackground >
            <AppHeader showBackButton title={translate("wallet.common.backup")}/>
            <View style={CommonStyles.screenContainer} onStartShouldSetResponder={() => {
                setOpenPicker(!openPicker)
                return true;
            }}>

                <View style={styles.contentContainer}>
                    <AppLogo logoStyle={styles.logo}/>
                    <TextView style={styles.title}>{translate("wallet.common.backupTxt")} !</TextView>
                    <HintText style={styles.hint}>{translate("wallet.common.phraseHint")}</HintText>
                    <View style={styles.imgContainer}>
                        <ImageBackground style={styles.img} source={ImagesSrc.backupImg}>
                            <Image source={ImagesSrc.backupLoaderImg}/>
                        </ImageBackground>

                    </View>
                </View>

                <View style={styles.bottomView}>
                    <Checkbox isCheck={isCheck} onChecked={setCheck} label={translate("wallet.common.phraseAlert")}/>
                    <AppButton label={translate("wallet.common.next")} view={!isCheck} containerStyle={CommonStyles.button} labelStyle={CommonStyles.buttonLabel}
                        onPress={() => {
                            navigation.navigate("recoveryPhrase", { hide: false });
                        }}
                    />
                </View>

            </View>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },  
    bottomView: {

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