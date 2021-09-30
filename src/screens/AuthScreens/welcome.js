import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import LanguageSelector from '../../components/languageSelector';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import Checkbox from '../../components/checkbox';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import { RF } from '../../constants/responsiveFunct';
import { translate, setI18nConfig } from '../../utils';
import { useSelector } from 'react-redux';

const Welcome = ({ route, navigation }) => {

    // const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

    // setI18nConfig(selectedLanguageItem.language_name);

    const [openPicker, setOpenPicker] = useState(false);
    const [isCheck, setCheck] = useState(false);

    return (
        <AppBackground >
            <LanguageSelector open={openPicker}/>
            <View style={CommonStyles.screenContainer} onStartShouldSetResponder={() => {
                setOpenPicker(!openPicker)
                return true;
            }}>

                <View style={styles.contentContainer}>
                    <AppLogo logoStyle={styles.logo}/>
                    <TextView style={styles.title}>{translate("common.welcomeTxt")}</TextView>
                </View>

                <View style={styles.bottomView}>
                    <AppButton 
                        label={translate("common.createWallet")} 
                        containerStyle={CommonStyles.button} 
                        labelStyle={CommonStyles.buttonLabel} 
                        onPress={()=>{
                            console.log('legal');
                            navigation.navigate("legal")
                        }}
                        />
                    <AppButton 
                        label={translate("common.haveWallet")} 
                        containerStyle={CommonStyles.outlineButton} 
                        labelStyle={CommonStyles.outlineButtonLabel} 
                        onPress={()=>{
                            navigation.navigate("recoveryPhrase",{recover: true})
                        }}/>
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
    }
});

export default Welcome;