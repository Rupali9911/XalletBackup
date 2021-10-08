import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    View, StyleSheet
} from 'react-native';
import { Button } from 'react-native-paper';
import { hp, wp } from '../constants/responsiveFunct';
import Colors from '../constants/Colors';


const ToggleButtons = (props) => {

    const {onPressLeft, onPressRight, labelLeft, labelRight} = props;

    const [activeIndex, setActiveIndex] = useState(props.activeIndex || 0);

    return (
        <View style={styles.container}>
            <Button uppercase={false} color={Colors.white} style={[styles.button, activeIndex==0?styles.activeStyle:styles.unActiveStyle]}
                onPress={() => {
                    setActiveIndex(0);
                    onPressLeft && onPressLeft();
                }}>{labelLeft}</Button>
            <Button uppercase={false} color={Colors.white} style={[styles.button,activeIndex==1?styles.activeStyle:styles.unActiveStyle]}
                onPress={() => {
                    setActiveIndex(1);
                    onPressRight && onPressRight();
                }}>{labelRight}</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "60%",
        flexDirection: 'row',
        marginVertical: hp("2%"),
        alignSelf: 'center'
    },
    button: {
        flex: 1,
        borderRadius: 8,
    },
    activeStyle: {
        backgroundColor: Colors.toggleActiveColor
    },
    unActiveStyle: {
        backgroundColor: "transparent"
    }
});

ToggleButtons.propTypes = {
    activeIndex: PropTypes.oneOf([0, 1]),
    labelLeft: PropTypes.string,
    labelRight: PropTypes.string,
    onPressLeft: PropTypes.func,
    onPressRight: PropTypes.func
}

export default ToggleButtons;