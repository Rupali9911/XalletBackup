import React from 'react';
import * as Progress from 'react-native-progress';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';

import { colors } from '../res';

const Image = createImageProgress(FastImage);

const C_Image = (props) => {
    return (
        <Image
            indicator={Progress.Pie}
            indicatorProps={{
                size: 50,
                borderWidth: 0,
                color: colors.themeL,
                unfilledColor: 'rgba(200, 200, 200, 0.2)'
            }}
            style={props.imageStyle}
            source={{
                uri: props.uri,
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
        />
    )
}

export default C_Image;