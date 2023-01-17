import React, { useState } from "react";
import { KeyboardAvoidingView, Image, TouchableOpacity, View, Text } from "react-native";

import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import AppButton from '../../components/appButton';
import AppInput from '../../components/appInput';
import { translate } from '../../walletUtils';
import { images, colors } from '../../res';
import styles from './styles';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF, SIZE } from '../../common/responsiveFunction';

const LabelInput = (props) => {
  const { placeholder, value, onChangeText, ...other } = props;
  return (
    <View style={styles.labelInputContainer}>
      <Text style={styles.placeholderStyle}>{placeholder}</Text>
      <AppInput
        containerStyle={{ borderColor: colors.BLACK2 }}
        value={value}
        errorStyle={{ width: "100%" }}
        onChangeText={onChangeText}
        {...other}
      />
    </View>
  );
}

function ChangePassword({ navigation }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});

  const changePassword = () => {
    let errorList = {};
    !oldPassword ?
      errorList["oldPassword"] = translate("wallet.common.error.fieldRequired") :
      !newPassword ? errorList["newPassword"] = translate("wallet.common.error.fieldRequired") :
        !confirmPassword ? errorList["newCPassword"] = translate("wallet.common.error.fieldRequired") :
          newPassword !== confirmPassword ? errorList["newCPassword"] = translate("wallet.common.error.passwordDoesntMatch") : {};

    setError(errorList)
    if (Object.keys(errorList).length == 0) {
      setError({});
      // let body = {
      //     userName: userName ? userName : email ? email : phone,
      //     currentPassword: oldPassword,
      //     newPassword,
      //     newPasswordConfirm: confirmPassword
      // }
      // dispatch(updatePassword(body, navigation))

    }
  }

  return (
    <AppBackground>
      <AppHeader
        showBackButton
        title={translate("common.changePassword")}
      />

      <KeyboardAvoidingView>

        <View style={styles.formCont} >
          <LabelInput
            value={oldPassword}
            onChangeText={(e) => setOldPassword(e)}
            placeholder={translate("common.oldPassword")}
            secureTextEntry={true}
            error={error["oldPassword"]}
          />

          <LabelInput
            value={newPassword}
            onChangeText={(e) => setNewPassword(e)}
            placeholder={translate("common.newPassword")}
            secureTextEntry={true}
            error={error["newPassword"]}
          />

          <LabelInput
            value={confirmPassword}
            onChangeText={(e) => setConfirmPassword(e)}
            placeholder={translate("wallet.common.confirmNewPassword")}
            secureTextEntry={true}
            error={error["newCPassword"]}
          />

          <AppButton
            onPress={changePassword}
            label={translate("common.changePassword")}
            containerStyle={styles.button}
            labelStyle={styles.buttonLabel}
          />
        </View>

      </KeyboardAvoidingView>

    </AppBackground>
  )
}

export default ChangePassword;