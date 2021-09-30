import { Dimensions, PixelRatio } from 'react-native';

let screenWidth = Dimensions.get('window').width;

let screenHeight = Dimensions.get('window').height;

const widthPercentageToDP = (widthPercent) => {
    const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

const heightPercentageToDP = (heightPercent) => {
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
    // console.log('',PixelRatio.get());
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size) => screenWidth / guidelineBaseWidth * size;
const verticalScale = (size) => screenHeight / guidelineBaseHeight * size;

const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const responsiveFontSize = (f) => {
    const tempHeight = (16 / 9) * screenWidth;
    return Math.sqrt(Math.pow(tempHeight, 2) + Math.pow(screenWidth, 2)) * (f / 100);
};

export {
    moderateScale,
    verticalScale,
    responsiveFontSize as RF,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    screenWidth,
    screenHeight
};