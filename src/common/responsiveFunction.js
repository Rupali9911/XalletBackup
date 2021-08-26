import { Dimensions, PixelRatio } from 'react-native';

let screenWidth = Dimensions.get('window').width;

let screenHeight = Dimensions.get('window').height;

const widthPercentageToDP = (widthPercent) => {
    const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

const heightPercentageToDP = (heightPercent) => {
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 680;

const scale = (size) => screenWidth / guidelineBaseWidth * size;
const verticalScale = (size) => screenHeight / guidelineBaseHeight * size;

const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const responsiveFontSize = (f) => {
    const tempHeight = (16 / 9) * screenWidth;
    return Math.sqrt(Math.pow(tempHeight, 2) + Math.pow(screenWidth, 2)) * (f / 100);
};

const SIZE = size => {
    const newSize = size * screenWidth / guidelineBaseWidth;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else if (Platform.OS === 'android') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return size;
    }
}

export {
    moderateScale,
    verticalScale,
    responsiveFontSize,
    widthPercentageToDP,
    heightPercentageToDP,
    screenWidth,
    screenHeight,
    SIZE
};