import * as React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles';
import { images, colors } from '../../res';

let listArr = [
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
    { image: images.one, like: false },
]

const DetailItemScreen = ({ navigation }) => {

    const [like, setLike] = React.useState({});
    return (
        <SafeAreaView style={{flex: 1}} >
        <View style={styles.modalCont} >
            <View style={styles.bgImageCont} >
                <Image style={styles.bgImage} source={images.one} />
                <View style={[styles.bgImageCont, { backgroundColor: colors.black_opacity(0.8) }]} />
            </View>
            <View style={styles.header} >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon} >
                    <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {
                    listArr.map((v, i) => {
                        return (
                            <View key={i}>
                                <Image source={v.image} style={styles.modalImage} />

                                <View style={styles.bottomModal} >
                                    <View style={styles.modalLabelCont} >
                                        <Text style={styles.modalLabel} >Penguin Name</Text>
                                        <TouchableOpacity onPress={() => {
                                            let likeList = like
                                            likeList[i] = !likeList[i]
                                            setLike({ ...like, ...likeList })
                                        }} >
                                            <Image style={styles.heartIcon} source={like[i] ? images.icons.heartA : images.icons.heart} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.modalSectCont} >
                                        <View style={{ flex: 1 }} >
                                            <Text style={styles.modalIconLabel} >Current price</Text>
                                            <View style={styles.iconCont} >
                                                <Image style={styles.iconsImage} source={images.icons.pIcon} />
                                                <Text style={styles.iconLabel} >25</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.8 }} >
                                            <Text style={styles.modalIconLabel} >Last price</Text>
                                            <View style={styles.iconCont} >
                                                <Image style={styles.iconsImage} source={images.icons.pIcon} />
                                                <Text style={styles.iconLabel} >25</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.separator} />
                                    <View style={styles.modalSectCont} >
                                        <View style={{ flex: 1 }} >
                                            <Text style={styles.modalIconLabel} >Owner</Text>
                                            <View style={styles.iconCont} >
                                                <Image style={styles.profileIcon} source={images.icons.profileIcon} />
                                                <Text style={[styles.iconLabel, { fontWeight: "400" }]} >Queen</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.8 }} >
                                            <Text style={styles.modalIconLabel} >Artist</Text>
                                            <View style={styles.iconCont} >
                                                <Image style={styles.profileIcon} source={images.icons.profileIcon} />
                                                <Text style={[styles.iconLabel, { fontWeight: "400" }]} >Queen</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.separator} />
                                    <Text style={styles.description} >Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
                                    <TouchableOpacity>
                                        <LinearGradient colors={[colors.themeL, colors.themeR]} style={styles.modalBtn}>
                                            <Text style={[styles.modalLabel, { color: colors.white }]} >Buy</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
        </SafeAreaView>
    )
}

export default DetailItemScreen;
