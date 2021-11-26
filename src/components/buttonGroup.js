import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, FlatList, View, ViewPropTypes, Image } from 'react-native';

import { wp, hp, RF } from '../constants/responsiveFunct';
import Colors from "../constants/Colors";
import Separator from './separator';
import TextView from './appText';
import ImagesSrc from '../constants/Images';
import CommonStyles from '../constants/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ButtonGroup = (props) => {
    const {buttons, separatorColor, selectable, selectedIndex} = props;

    return (
        <View style={[styles.container, props.style]} >
            <FlatList
                data={buttons || []}
                renderItem={({ item, index }) => {
                    const isCheck = selectable && index == selectedIndex;
                    return selectable ? <SelectableButton item={item} isCheck={isCheck}/> : <NavButton item={item}/>
                }}
                keyExtractor={(item, index) => `_${index}`}
                ItemSeparatorComponent={() => <Separator style={separatorColor ? { backgroundColor: separatorColor } : {}} />}
            />
        </View>
    )
}

const NavButton = (props) => {
    const {item} = props;
    return (
        <TouchableOpacity onPress={item.onPress}
            style={[styles.itemContainer, item.containerStyle]}>
            <TextView style={[styles.labelStyle, item.labelStyle]}>{item.text}</TextView>
            <Image style={styles.icon} source={ImagesSrc.leftArrow} />
        </TouchableOpacity>
    );
}

const SelectableButton = (props) => {
    const {item, isCheck} = props;
    return (
        <TouchableOpacity onPress={item.onPress}
            style={[styles.itemContainer, item.containerStyle]}>
            <Icon name={isCheck ? 'radio-button-checked' : 'radio-button-unchecked'} size={wp("5%")}/>
            <Image style={styles.selectableIcon} source={item.icon} resizeMode='contain'/>
            <TextView style={[styles.labelStyle, item.labelStyle]}>{item.text}</TextView>
        </TouchableOpacity>
    );
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelStyle: {
        flex: 1,
        fontSize: RF(1.9),
        color: Colors.buttonTxtColor
    },
    icon: {
        ...CommonStyles.imageStyles(3.5),
        tintColor: Colors.arrowColor
    },
    selectableIcon: {
        ...CommonStyles.imageStyles(7.5),
        marginHorizontal: wp("4%"),
    },
    checkIconSize: {
        width: wp("7.5%"),
        height: wp("7.5%"),
    }
})

ButtonGroup.propTypes = {
    ...ViewPropTypes,
    buttons: PropTypes.array,
    separatorColor: PropTypes.string,
    selectable: PropTypes.bool,
    selectedIndex: PropTypes.number
}

export default ButtonGroup;
