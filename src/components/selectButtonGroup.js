import React, { useState } from 'react';
import {View,TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import { hp, wp } from '../constants/responsiveFunct';
import TextView from './appText';

const SelectButtongroup = (props) => {
    
    const {buttons, onButtonPress} = props;
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <View style={[styles.container, props.style]}>
            {buttons.map((item,index) => {
                return (
                    <TouchableOpacity key={`_${index}`} style={[styles.button, {borderBottomWidth: selectedIndex == index ? 1 : 0}]} onPress={() => {
                        setSelectedIndex(index);
                        onButtonPress && onButtonPress(item, index)
                    }}>
                        <TextView style={[styles.text, {color: selectedIndex == index ? Colors.accentColor2 : Colors.GREY1}]}>{item}</TextView>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLightColor2,
        marginTop: hp("4%"),
        marginBottom: hp("2%")
    },
    button: {
        flex: 1,
        alignItems: 'center',
        padding: wp("2%"),
        borderBottomColor: Colors.accentColor2,
        borderBottomWidth: 0
    },
    text: {
        color: Colors.accentColor2
    }
});

export default SelectButtongroup;