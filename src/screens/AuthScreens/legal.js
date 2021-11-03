import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import Checkbox from '../../components/checkbox';
import AppLogo from '../../components/appLogo';
import { hp } from '../../constants/responsiveFunct';
import HintText from '../../components/hintText';
import ButtonGroup from '../../components/buttonGroup';
import { translate } from '../../walletUtils';

const Legal = ({ navigation }) => {

    const [openPicker, setOpenPicker] = useState(false);
    const [isCheck, setCheck] = useState(false);

    return (
        <AppBackground >
            <AppHeader showBackButton title={translate("wallet.common.legal")} />
            <View style={CommonStyles.screenContainer} onStartShouldSetResponder={() => {
                setOpenPicker(!openPicker)
                return true;
            }}>

                <View style={styles.contentContainer}>
                    <AppLogo logoStyle={styles.logo} />
                    <HintText style={styles.hint}>{translate("wallet.common.legalHint1") + '\n' + translate("wallet.common.legalHint2")}</HintText>
                    <ButtonGroup buttons={[
                        {
                            text: translate("wallet.common.privacyPolicy"),
                            onPress: () => navigation.navigate("policy", { isPolicy: true })
                        },
                        {
                            text: translate("wallet.common.termsServices"),
                            onPress: () => navigation.navigate("policy", { isPolicy: false })
                        }
                    ]} />
                </View>

                <View>
                    <Checkbox isCheck={isCheck} onChecked={setCheck} label={translate("wallet.common.termDeclaration")} />
                    <AppButton label={translate("wallet.common.next")} view={!isCheck} containerStyle={CommonStyles.button} labelStyle={CommonStyles.buttonLabel}
                        onPress={() => navigation.navigate("backup")} />
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
    hint: {
        marginTop: hp("3%")
    }
});

export default Legal;