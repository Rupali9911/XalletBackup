import * as React from 'react';
import {
  Animated,
  Dimensions,
  findNodeHandle,
  Keyboard,
  Platform,
  TextInput,
  UIManager,
} from 'react-native';

export default class KeyboardShift extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shift: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      this.setState({
        keyboardDidShowListener: Keyboard.addListener(
          'keyboardDidShow',
          this.handleKeyboardDidShow,
        ),
        keyboardDidHideListener: Keyboard.addListener(
          'keyboardDidHide',
          this.handleKeyboardDidHide,
        ),
      });
    }
  }

  componentWillUnmount() {
    if (Platform.OS == 'ios') {
      if (this.state.keyboardDidShowListener)
        this.state.keyboardDidShowListener.remove();
      if (this.state.keyboardDidHideListener)
        this.state.keyboardDidHideListener.remove();
    }
  }

  render() {
    return (
      <Animated.View
        style={[
          {transform: [{translateY: this.state.shift}]},
          this.props.style,
        ]}>
        {this.props.children}
      </Animated.View>
    );
  }

  handleKeyboardDidShow = event => {
    const {height: windowHeight} = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInput.State.currentlyFocusedInput
      ? findNodeHandle(TextInput.State.currentlyFocusedInput())
      : TextInput.State.currentlyFocusedField();
    if (currentlyFocusedField == null) return;

    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height + 20;
        const fieldTop = pageY;
        const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
        if (gap >= 0) {
          return;
        }
        Animated.timing(this.state.shift, {
          toValue: gap,
          duration: 500,
          useNativeDriver: true,
        }).start();
      },
    );
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
}
