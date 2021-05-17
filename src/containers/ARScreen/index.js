import * as React from 'react';
import { SafeAreaView, StatusBar, ScrollView, View, TouchableOpacity, Image } from 'react-native';

import styles from './styles';
import { colors, fonts, images } from '../../res';

let list = [
    images.one,
    images.two,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
]

const ARScreen = ({ navigation }) => {
    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />

            <ScrollView>
                <View style={styles.imageListCont} >
                    {
                        list.map((v, i) => {
                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => navigation.navigate("ViroARScreen", { type: i })}
                                    style={styles.listItem}
                                >
                                    <Image style={styles.listImage} source={v} resizeMode="cover" />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>

        </View>
    )
}

export default ARScreen;