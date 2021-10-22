import React, { useState } from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    Modal,
    StyleSheet,
    SafeAreaView,
    Text,
} from 'react-native';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import CommonStyles from '../../constants/styles';
import Fonts from '../../constants/Fonts';
import { RF, wp, hp } from '../../constants/responsiveFunct';
import ButtonGroup from '../buttonGroup';
import { translate } from '../../walletUtils';
import Separator from '../separator';
import AppButton from '../appButton';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from "@react-native-community/blur";

const NotEnoughGold = (props) => {

    const navigation = useNavigation();

    const { visible, onRequestClose } = props;
    const [opacity, setOpacity] = useState(0);
    const [selectedMethod, setSelectedMethod] = useState(null);

    return (
        <Modal
            visible={visible}
            animationType={'slide'}
            transparent
            onShow={() => setOpacity(0.4)}
            onRequestClose={() => {
                // setOpacity(0);
                onRequestClose();
            }}>
            <View style={[styles.container, { backgroundColor: Colors.whiteOpacity(opacity) }]}>
                <BlurView
                    style={styles.absolute}
                    blurType="light"
                    blurAmount={10}
                >
                    <TouchableOpacity style={styles.emptyArea} onPress={() => {
                        // setOpacity(0);
                        onRequestClose();
                    }}>
                        <View style={styles.contentContainer}>
                            <TouchableOpacity onPress={() => {
                                // setOpacity(0);
                                onRequestClose();
                            }}>
                                <Image style={styles.closeIcon} source={ImagesSrc.closeIcon} resizeMode={'contain'} />
                            </TouchableOpacity>

                            <View style={styles.centerAlign}>

                                <View style={styles.imgContainer}>
                                    <Image source={ImagesSrc.goldcoin1} style={styles.img} />
                                </View>

                                <Text style={[styles.title, {fontSize: RF(2.4)}]}>{translate("wallet.common.buyGoldErr1")}</Text>
                                <Text style={[styles.title, {fontSize: RF(1.6), color: Colors.modalHintText}]}>{translate("wallet.common.buyGoldErr2")}</Text>

                                <AppButton
                                    label={translate("wallet.common.buyGold")}
                                    containerStyle={[CommonStyles.button, styles.button]}
                                    labelStyle={[CommonStyles.buttonLabel, { color: Colors.white, fontFamily: Fonts.ARIAL_BOLD, fontSize: RF(1.6) }]}
                                    onPress={() => {
                                        props.onNavigate();
                                        navigation.navigate('BuyGold')
                                    }}
                                />
                            </View>

                        </View>
                    </TouchableOpacity>
                </BlurView>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1
    },
    container: {
        flex: 1,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(95, 148, 255, 0.6)"
    },
    emptyArea: {
        flex: 1,
        justifyContent: 'center',
    },
    centerAlign: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: hp("2%"),
        paddingBottom: hp("3%")
    },
    contentContainer: {
        backgroundColor: Colors.white,
        padding: "4%",
        margin: wp("7%"),
        borderRadius: wp("4%"),
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    closeIcon: {
        alignSelf: 'flex-end',
        ...CommonStyles.imageStyles(7),
    },
    title: {
        width: "70%",
        fontFamily: Fonts.ARIAL,
        fontSize: RF(2),
        textAlign: 'center',
        alignSelf: 'center',
        marginVertical: wp("3%"),
        color: Colors.BLACK1
    },
    button: {
        width: "70%",
        marginTop: hp("5%")
    },
    imgContainer: {
        padding: wp("5%"),
        alignSelf: 'center',
        borderRadius: wp("25%") / 2,
        marginBottom: hp("3%")
    },
    img: {
        width: wp("30%"),
        height: wp("30%"),
        resizeMode: "contain"
    }
});

export default NotEnoughGold;