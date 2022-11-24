import React, {useState} from 'react';
import {View, ActivityIndicator, StyleSheet, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SVGS, SIZE, IMAGES, NFT_TYPE_TO_ID} from '../constants';
import Colors from '../constants/Colors';
import Audio from '../assets/pngs/headphone-icon.png';

const {PlayButtonIcon} = SVGS;

const C_Image = props => {
  let [loadImage, setLoadImage] = useState(false);
  let [brokenUrl, setBrokenUrl] = useState(false);
  let [isBroken, setIsBroken] = useState(false);

  const checkVideoUrl = props?.category;

  return (
    <>
      {brokenUrl ? (
        <Image
          style={props.imageStyle}
          onLoadStart={() => setLoadImage(true)}
          onLoadEnd={() => setLoadImage(false)}
          onError={({nativeEvent}) => {
            console.log(nativeEvent, 'errror => 74', props.uri);
            setIsBroken(true);
          }}
          source={
            props.uri
              ? isBroken
                ? IMAGES.brokenIcon
                : {
                    uri: props.uri,
                  }
              : props.imageType == 'profile'
              ? IMAGES.DEFAULTPROFILE
              : IMAGES.imagePlaceholder
          }
          resizeMode={
            props.isContain
              ? FastImage.resizeMode.contain
              : FastImage.resizeMode.cover
          }
        />
      ) : (
        <FastImage
          style={props.imageStyle}
          onLoadStart={() => setLoadImage(true)}
          onLoadEnd={() => setLoadImage(false)}
          onError={({nativeEvent}) => {
            setBrokenUrl(true);
          }}
          source={
            props.uri
              ? {
                  uri: props.uri,
                  priority: FastImage.priority.high,
                }
              : props.imageType == 'profile'
              ? IMAGES.DEFAULTPROFILE
              : IMAGES.imagePlaceholder
          }
          resizeMode={
            props.isContain
              ? FastImage.resizeMode.contain
              : FastImage.resizeMode.cover
          }
        />
      )}

      {loadImage && (
        <View
          style={[
            styles.imageCont,
            {backgroundColor: Colors.transparent},
            {...props?.style},
          ]}>
          <ActivityIndicator size="small" color={Colors.themeColor} />
        </View>
      )}

      {checkVideoUrl === NFT_TYPE_TO_ID.video ? (
        <View style={styles.imageCont}>
          <View style={styles.playCont}>
            <PlayButtonIcon width={SIZE(40)} height={SIZE(40)} />
          </View>
        </View>
      ) : null}
      {checkVideoUrl === NFT_TYPE_TO_ID.audio ? (
        <View style={styles.imageCont}>
          <Image style={{width: 40, height: 40}} source={Audio} />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  imageCont: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCont: {
    width: SIZE(40),
    height: SIZE(40),
    backgroundColor: '#2125299e',
    borderRadius: SIZE(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default C_Image;
