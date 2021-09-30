import React from "react";
import LinearGradient from "react-native-linear-gradient";

import Colors from "../constants/Colors";
import { SafeAreaView } from "react-native";

function GradientBackground(props) {
    return (
        <LinearGradient
            colors={[Colors.gradientLight, Colors.gradientMid, Colors.gradientDark]}
            // locations={[0, 1]}
            // start={{ x: 0.5, y: 0.5 }}
            style={props.containerStyle}>
            <SafeAreaView>
                {
                    props.children
                }
            </SafeAreaView>
        </LinearGradient>
    )
}

export default GradientBackground;
