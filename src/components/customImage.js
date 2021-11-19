import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import { SVGS, SIZE, IMAGES } from '../constants';
import Colors from '../constants/Colors';

const {
    PlayButtonIcon
} = SVGS;

const C_Image = (props) => {

    let [loadImage, setLoadImage] = useState(false);
    let [brokenUrl, setBrokenUrl] = useState(false);

    return (
        <>
            {
                loadImage && <View style={[styles.imageCont, { backgroundColor: Colors.GREY8 }]}>
                    <ActivityIndicator size="small" color={Colors.themeColor} />
                </View>
            }
            <FastImage
                style={props.imageStyle}
                onLoadStart={() => setLoadImage(true)}
                onLoadEnd={() => setLoadImage(false)}
                onError={({ nativeEvent: { error } }) => setBrokenUrl(true)}
                source={props.uri ?
                    brokenUrl ?
                        IMAGES.brokenIcon :
                        {
                            uri: props.uri,
                            priority: FastImage.priority.high,
                        } : (props.imageType == "profile" ? IMAGES.DEFAULTPROFILE : IMAGES.imagePlaceholder)}
                resizeMode={props.isContain ? FastImage.resizeMode.contain : FastImage.resizeMode.cover}
            />
            {
                props.type === 'mp4' || props.type === 'MP4' || props.type === 'mov' || props.type === 'MOV' ?
                    <View style={styles.imageCont}>
                        <View style={styles.playCont}>
                            <PlayButtonIcon width={SIZE(40)} height={SIZE(40)} />
                        </View>
                    </View>
                    : null
            }
        </>
    )
}

const styles = StyleSheet.create({
    imageCont: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    playCont: {
        width: SIZE(40),
        height: SIZE(40),
        backgroundColor: '#00000030',
        borderRadius: SIZE(40),
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default C_Image;