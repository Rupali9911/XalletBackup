import {StyleSheet} from 'react-native';
import Colors from './Colors';
import {wp, hp} from './responsiveFunct';

const CommonStyles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.themeColor,
  },
  outlineButton: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.lightBorder,
    borderWidth: 1,
  },
  buttonLabel: {
    color: Colors.white,
  },
  outlineButtonLabel: {
    color: Colors.greyButtonLabel,
  },
  imageStyles: size => ({
    height: wp(`${size}%`),
    width: wp(`${size}%`),
    resizeMode: 'contain',
  }),
  circle: size => ({
    height: wp(`${size}%`),
    width: wp(`${size}%`),
    borderRadius: wp(`${size}%`) / 2,
    overflow: 'hidden',
  }),
  text: (fontFamily, color, size) => ({
    fontFamily,
    color,
    fontSize: size,
  }),
  fullImage: {
    flex: 1,
    height: null,
    width: null,
  },
  screenContainer: {
    flex: 1,
    padding: wp('5%'),
    paddingBottom: 0,
  },
  whiteBackIcon: {
    tintColor: Colors.white,
  },
  flexRow: {
    flexDirection: 'row',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CommonStyles;
