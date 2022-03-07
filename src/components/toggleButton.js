import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';
import {hp, wp} from '../constants/responsiveFunct';
import Colors from '../constants/Colors';

const ToggleButtons = props => {
  const {onPressLeft, onPressRight, labelLeft, labelRight} = props;

  const [activeIndex, setActiveIndex] = useState(props.activeIndex || 0);

  return (
    <View style={styles.container}>
      {/* <Button uppercase={false} color={Colors.white} style={[styles.button, activeIndex==0?styles.activeStyle:styles.unActiveStyle]}
                onPress={() => {
                    setActiveIndex(0);
                    onPressLeft && onPressLeft();
                }}>{labelLeft}</Button> 
         <Button uppercase={false} color={Colors.white} style={[styles.button,activeIndex==1?styles.activeStyle:styles.unActiveStyle]}
                onPress={() => {
                    setActiveIndex(1);
                    onPressRight && onPressRight();
                }}>{labelRight}</Button> */}
      <View style={styles.textContainer}>
        <Text style={styles.tokenStyle}>{labelLeft}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '60%',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: hp('2%'),
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    height: 25,
    marginTop: 5,
    justifyContent: 'center',
  },
  tokenStyle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  activeStyle: {
    backgroundColor: Colors.toggleActiveColor,
  },
  unActiveStyle: {
    backgroundColor: 'transparent',
  },
});

ToggleButtons.propTypes = {
  activeIndex: PropTypes.oneOf([0, 1]),
  labelLeft: PropTypes.string,
  labelRight: PropTypes.string,
  onPressLeft: PropTypes.func,
  onPressRight: PropTypes.func,
};

export default ToggleButtons;