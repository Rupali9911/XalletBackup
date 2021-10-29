import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

import { RF } from '../constants/responsiveFunct';
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import CommonStyles from "../constants/styles";

import ButtonInputContainer from './buttonInputContainer';

const AppInput = (props) => {

    return (
        <View>
            <ButtonInputContainer view={true} containerStyle={[props.containerStyle]} isGreyBg={props.isGreyBg} >
                {
                    props.showLeftComponent && props.leftComponent
                }
                <TextInput
                    value={props.value}
                    placeholder={props.placeholder}
                    onChangeText={props.onChangeText}
                    keyboardType={props.keyboardType}
                    returnKeyType={props.returnKeyType}
                    secureTextEntry={props.secureTextEntry}
                    underlineColorAndroid={Colors.transparent}
                    placeholderTextColor={props.placeholderTextColor ? props.placeholderTextColor : Colors.titleColor}
                    style={[styles.input, props.inputStyle]}
                    onSubmitEditing={props.onSubmitEditing}
                    editable={props.editable}
                    maxLength={props.maxLength}
                    onKeyPress={props.onKeyPress}
                />
                {
                    props.showRightComponent && props.rightComponent
                }
            </ButtonInputContainer>
            {
                props.error ? <Text style={styles.error} >{props.error}</Text> : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.black, RF(1.6)),
        padding: 0,
        flex: 1,
    },
    error: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.danger, RF(1.6)),
        width: "85%",
        alignSelf: "center"
    }
})

export default AppInput;
