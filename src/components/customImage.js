import React from 'react';
import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';

import { SVGS, SIZE, IMAGES } from 'src/constants';
import { colors } from '../res';

const {
    PlayButtonIcon
} = SVGS;
const Image = createImageProgress(FastImage);

const C_Image = (props) => {
    return (
        <>
            <Image
                indicator={Progress.Pie}
                indicatorProps={{
                    size: 50,
                    borderWidth: 0,
                    color: colors.themeL,
                    unfilledColor: 'rgba(200, 200, 200, 0.2)'
                }}
                style={props.imageStyle}
                source={props.uri ? {
                    uri: props.uri,
                    priority: FastImage.priority.normal,
                } : IMAGES.DEFAULTPROFILE}
                resizeMode={FastImage.resizeMode.cover}
            />
            {
                props.type === 'mp4' || props.type === 'MP4' || props.type === 'mov' || props.type === 'MOV' ?
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            width: SIZE(40),
                            height: SIZE(40),
                            backgroundColor: '#00000030',
                            borderRadius: SIZE(40),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <PlayButtonIcon width={SIZE(40)} height={SIZE(40)} />
                        </View>
                    </View>
                    : null
            }
        </>
    )
}

export default C_Image;