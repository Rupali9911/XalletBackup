import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';

import { ScanBottomView } from './components/scanBottomView';

import { useSelector, useDispatch } from 'react-redux';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import PriceText from '../../components/priceText';
import Separator from '../../components/separator';
import GradientBackground from '../../components/gradientBackground';
import Colors from '../../constants/Colors';
import { wp, hp, RF } from '../../constants/responsiveFunct';
import { translate } from '../../walletUtils';
import TextView from '../../components/appText';
import ImagesSrc from '../../constants/Images';

function ScanToConnect({ route, navigation }) {

    const dispatch = useDispatch();

    const [leftSelect, setLeftSelect] = useState(true);
    const [rightSelect, setRightSelect] = useState(false);

    let refScanner = useRef(null);

    const onSuccess = (e) => {
        let scannerType = rightSelect ? 'BarCode' : 'QR';
        // processScanResult(e,scannerType).then((user)=>{
        //     // navigation.navigate('Paid')
        //     if(user){
        //         receiveMoney(user);
        //     }
        // }).catch(()=>{
        //     alertWithSingleBtn(
        //         translate("common.error.invalidCode"),
        //         translate("common.error.scanCodeAlert"),
        //         () => {
        //             refScanner && refScanner.reactivate();
        //         }
        //     );
        // });
    };

    return (
        <AppBackground 
            safeAreaColor={Colors.black}  
            lightStatus>

            <AppHeader
                containerStyle={styles.header}
                showBackButton={true}
                isWhite={true}
                title={translate("common.connect")}
            />

            <QRCodeScanner
                ref={(scanner)=>refScanner=scanner}
                onRead={onSuccess}
                showMarker={true}
                customMarker={<TouchableOpacity disabled style={{zIndex: 1000, bottom: hp('15%')}} >
                    <Image style={styles.scanStyle} source={ImagesSrc.scanRectangle} />
                </TouchableOpacity>}
                cameraStyle={styles.qrCameraStyle}
            />

            <GradientBackground containerStyle={styles.bottomContainerStyle} >
                <TextView style={styles.scanText}>{translate("common.scanTxt")}</TextView>
            </GradientBackground>

        </AppBackground>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.black
    },
    qrCameraStyle: {
        height: "100%"
    },
    barStyle: {
        width: wp("40%"),
        height: wp("40%"),
        resizeMode: "contain",
    },
    scanStyle: {
        width: wp("30%"),
        height: wp("70%"),
        resizeMode: "contain",
    },
    priceTxtCont: {
        marginTop: hp("5%")
    },
    separator: {
        width: '90%',
        backgroundColor: Colors.white
    },
    scanBottomStyle: {
        position: "relative",
        bottom: 0,
        marginVertical: hp("5%")
    },
    bottomContainerStyle: {
        height: hp("33%"),
        position: "absolute",
        zIndex: 999,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center'
    },
    scanText: {
        maxWidth: "90%",
        alignSelf: "center",
        // marginVertical: hp("10%"),
        fontSize: RF(2.2),
        color: Colors.white,
        textAlign: 'center'
    }
})

export default ScanToConnect;
