import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-fast-video';
// import Video from 'react-native-video';

import { SVGS, SIZE, IMAGES, NFT_TYPE_TO_ID } from '../constants';
import Colors from '../constants/Colors';

const {
    PlayButtonIcon
} = SVGS;

const C_Image = (props) => {

    let [loadImage, setLoadImage] = useState(false);
    let [brokenUrl, setBrokenUrl] = useState(false);
    let [isBroken, setIsBroken] = useState(false);

    const checkVideoUrl = props?.category === NFT_TYPE_TO_ID.video;

    return (
        <>
            {
                loadImage && <View style={[styles.imageCont, { backgroundColor: Colors.transparent }]}>
                    <ActivityIndicator size="small" color={Colors.themeColor} />
                </View>
            }{
                // checkVideoUrl ?
                //     Platform.OS === "ios" ?
                //         <Video
                //             source={{ uri: props.uri }}
                //             paused={true}
                //             resizeMode={'cover'}
                //             style={props.imageStyle} />
                //         :
                //         // <Video
                //         //     source={{ uri: props.uri }}
                //         //     resizeMode={'cover'}
                //         //     paused={true}
                //         //     onError={(e) => console.log("error", e)}
                //         //     style={props.imageStyle} />
                //         <FastImage
                //             style={props.imageStyle}
                //             onLoadStart={() => setLoadImage(true)}
                //             onLoadEnd={() => setLoadImage(false)}
                //             onError={({ nativeEvent }) => {
                //                 console.log(nativeEvent, "errror", props.uri)
                //                 setBrokenUrl(true)
                //             }}
                //             source={props.uri ?
                //                 brokenUrl ?
                //                     IMAGES.brokenIcon :
                //                     {
                //                         uri: props.uri,
                //                         priority: FastImage.priority.high,
                //                     } : (props.imageType == "profile" ? IMAGES.DEFAULTPROFILE : IMAGES.imagePlaceholder)}
                //             resizeMode={props.isContain ? FastImage.resizeMode.contain : FastImage.resizeMode.cover}
                //         />
                //     :
                brokenUrl ?
                    <FastImage
                        style={props.imageStyle}
                        onLoadStart={() => setLoadImage(true)}
                        onLoadEnd={() => setLoadImage(false)}
                        onError={({ nativeEvent }) => {
                            console.log(nativeEvent, "errror", props.uri)
                            setIsBroken(true)
                        }}
                        fallback={isBroken ? false : true}
                        source={props.uri ?
                            isBroken ?
                                IMAGES.brokenIcon :
                                {
                                    uri: props.uri,
                                    priority: FastImage.priority.high,
                                } : (props.imageType == "profile" ? IMAGES.DEFAULTPROFILE : IMAGES.imagePlaceholder)}
                        resizeMode={props.isContain ? FastImage.resizeMode.contain : FastImage.resizeMode.cover}
                    />
                    :
                    <FastImage
                        style={props.imageStyle}
                        onLoadStart={() => setLoadImage(true)}
                        onLoadEnd={() => setLoadImage(false)}
                        onError={({ nativeEvent }) => {
                            // console.log(nativeEvent, "errror", props.uri)
                            setBrokenUrl(true)
                        }}
                        source={props.uri ?
                            {
                                uri: props.uri,
                                priority: FastImage.priority.high,
                            } : (props.imageType == "profile" ? IMAGES.DEFAULTPROFILE : IMAGES.imagePlaceholder)}
                        resizeMode={props.isContain ? FastImage.resizeMode.contain : FastImage.resizeMode.cover}
                    />
            }
            {
                checkVideoUrl ?
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
        backgroundColor: '#2125299e',
        borderRadius: SIZE(40),
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default C_Image;
