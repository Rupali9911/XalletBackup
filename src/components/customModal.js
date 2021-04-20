import * as React from 'react';
import { StyleSheet, Modal, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors, fonts, images } from '../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, screenHeight, screenWidth } from "../common/responsiveFunction";

const CustomModal = (props) => {

    const [like, setLike] = React.useState(false);

    return (
        <Modal animationType="slide" visible={props.visible} >
            <View style={styles.modalCont} >
                <View style={styles.bgImageCont} >
                    <Image style={styles.bgImage} source={props.active} />
                    <View style={[styles.bgImageCont, { backgroundColor: colors.black_opacity(0.8) }]} />
                </View>
                <ScrollView>
                    <View style={styles.header} >
                        <TouchableOpacity onPress={() => props.close()} style={styles.backIcon} >
                            <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>

                    <Image source={props.active} style={styles.modalImage} />

                    <View style={styles.bottomModal} >
                        <View style={styles.modalLabelCont} >
                            <Text style={styles.modalLabel} >Penguin Name</Text>
                            <TouchableOpacity onPress={() => setLike(!like)} >
                                <Image style={styles.heartIcon} source={like ? images.icons.heartA : images.icons.heart} />
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
                </ScrollView>
            </View>
        </Modal>
    )
}

export default CustomModal;

const styles = StyleSheet.create({
    modalCont: {
        flex: 1,
        backgroundColor: colors.white
    },
    bgImageCont: {
        position: 'absolute',
        top: 0,
        height: screenHeight,
        width: screenWidth
    },
    bgImage: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: "cover"
    },
    header: {
        height: hp('6%'),
        width: '100%',
    },
    backIcon: {
        width: wp('10%'),
        height: "100%",
        paddingLeft: wp('3%'),
        justifyContent: 'center',
    },
    headerIcon: {
        height: wp('4%'),
        width: wp('4%')
    },
    modalImage: {
        width: wp('100%'),
        height: wp('100%'),
        resizeMode: "cover",
        marginTop: hp('3%')
    },
    bottomModal: {
        width: '85%',
        alignSelf: "center",
        paddingVertical: hp('3%')
    },
    modalLabelCont: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    modalLabel: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: fonts.SegoeUIBold
    },
    heartIcon: {
        height: wp('7%'),
        width: wp('7%'),
        resizeMode: "contain"
    },
    modalSectCont: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: hp('1%')
    },
    modalIconLabel: {
        fontSize: 11,
        fontFamily: fonts.SegoeUIRegular,
        color: colors.white,
    },
    iconCont: {
        flexDirection: "row",
        marginTop: hp('1%'),
        marginBottom: hp('0.5%'),
        alignItems: "center"
    },
    iconsImage: {
        height: wp('6%'),
        width: wp('6%'),
        borderRadius: wp('6%') / 2
    },
    profileIcon: {
        height: wp('5%'),
        width: wp('5%'),
        borderRadius: wp('5%') / 2
    },
    iconLabel: {
        fontSize: 15,
        fontFamily: fonts.SegoeUIBold,
        fontWeight: "bold",
        color: colors.white,
        marginLeft: wp('1.5%')
    },
    separator: {
        width: '100%',
        height: 0.5,
        backgroundColor: colors.white
    },
    modalBtn: {
        width: '100%',
        height: hp('5%'),
        marginVertical: hp('2%'),
        borderRadius: wp('3%'),
        justifyContent: "center",
        alignItems: "center"
    },
    description: {
        fontSize: 10,
        fontFamily: fonts.SegoeUIRegular,
        color: colors.white,
        marginVertical: hp('1.5%')
    }
})