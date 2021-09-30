import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, FlatList, View, ViewPropTypes, Image } from 'react-native';

import { wp, hp, RF } from '../constants/responsiveFunct';
import Colors from "../constants/Colors";
import Separator from './separator';
import TextView from './appText';
import ImagesSrc from '../constants/Images';
import CommonStyles from '../constants/styles';

const ButtonGroup = (props) => {
    const {buttons} = props;
    return (
        <View style={[styles.container, props.style]} >
            <FlatList 
                data={buttons || []}
                renderItem={({ item, index }) => <TouchableOpacity onPress={item.onPress}
                    style={[styles.itemContainer, item.containerStyle]}>
                    <TextView style={[styles.labelStyle, item.labelStyle]}>{item.text}</TextView>
                    <Image style={styles.icon} source={ImagesSrc.leftArrow}/>
                </TouchableOpacity>
                }
                ItemSeparatorComponent={()=> <Separator />}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.buttonGroupBackground,
        borderWidth: 0,
        borderColor: Colors.borderColor,
        borderRadius: 12,
        alignItems: "center",
        alignSelf: "center",
        marginVertical: hp('1%'),
        flexDirection: "row",
    },
    itemContainer: {
        padding: wp("4%"),
        flexDirection: 'row'
    },
    labelStyle: {
        flex: 1,
        fontSize: RF(1.9),
        color: Colors.buttonTxtColor
    },
    icon: {
        ...CommonStyles.imageStyles(3.5),
        tintColor: Colors.arrowColor
    }
})

ButtonGroup.propTypes = {
    ...ViewPropTypes,
    buttons: PropTypes.array
}

export default ButtonGroup;
