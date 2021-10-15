import React from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';

import { RF } from '../constants/responsiveFunct';
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import CommonStyles from "../constants/styles";

import ButtonInputContainer from './buttonInputContainer';

const AppButton = (props) => {

    return (
        <ButtonInputContainer onPress={props.onPress} containerStyle={[styles.container, props.containerStyle, props.view && styles.inActive]} view={props.view}>
            {props.loading ? 
                <ActivityIndicator color={Colors.white}/>
             :
                <Text style={[styles.label, props.labelStyle]} >{props.label}</Text>
            }
            
        </ButtonInputContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        ...CommonStyles.center
    },
    label: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.white, RF(1.8))
    },
    inActive: {
        opacity: 0.4
    }
})

export default AppButton;
