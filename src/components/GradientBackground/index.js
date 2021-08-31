import React from "react";
import LinearGradient from "react-native-linear-gradient";

import {
    COLORS
} from 'src/constants';

function GradientBackground(props) {
    return (
        <LinearGradient
            colors={[COLORS.GRADIENTLIGHT, COLORS.GRADIENTDARK]}
            locations={[0, 1]}
            start={{ x: 0.5, y: 0.5 }}
            style={props.contentStyle}>
            {
                props.children
            }
        </LinearGradient>
    )
}

export default GradientBackground;