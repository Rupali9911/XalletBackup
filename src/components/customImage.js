import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SVGS, SIZE, IMAGES, NFT_TYPE_TO_ID} from '../constants';
import Colors from '../constants/Colors';
import Audio from '../assets/pngs/headphone-icon.png';
import {SvgUri} from 'react-native-svg';
import {getFileType} from '../common/function';
import {getImageUri} from '../common/ImageConstant';

const {PlayButtonIcon} = SVGS;

const C_Image = props => {
  const [loadImage, setLoadImage] = useState(false);
  const [brokenUrl, setBrokenUrl] = useState(false);
  const [isBroken, setIsBroken] = useState(false);

  let fileType = getFileType(props?.uri);
  let imageUri = getImageUri(props?.uri, props?.size);
  const checkVideoUrl = props?.category;

  useEffect(() => {
    if (
      fileType?.toLowerCase() === 'svg' ||
      fileType?.toLowerCase()?.includes('svg')
    ) {
      setLoadImage(true);
    }
  }, [fileType]);

  return (
    <>
      {fileType?.toLowerCase() === 'svg' ||
      fileType?.toLowerCase()?.includes('svg') ? (
        <View style={props?.imageStyle}>
          <SvgUri
            width="100%"
            height="100%"
            uri={props?.uri}
            onLoad={o => setLoadImage(false)}
            onError={({nativeEvent}) => {
              console.log(nativeEvent, 'svg errror => 60', props?.uri);
              setLoadImage(false);
              setIsBroken(true);
            }}
          />
        </View>
      ) : brokenUrl ? (
        <Image
          style={props.imageStyle}
          onLoadStart={() => setLoadImage(true)}
          onLoadEnd={() => setLoadImage(false)}
          onError={({nativeEvent}) => {
            console.log(nativeEvent, 'errror => 74', imageUri);
            setIsBroken(true);
          }}
          source={
            imageUri
              ? isBroken
                ? IMAGES.brokenIcon
                : {
                    uri: imageUri,
                    cache: 'only-if-cached',
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
            imageUri
              ? {
                  uri: imageUri,
                  priority: FastImage.priority.high,
                  cache: 'cacheOnly',
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

export default React.memo(C_Image);
