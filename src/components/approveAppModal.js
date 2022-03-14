import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Colors from '../constants/Colors';
import ImagesSrc from '../constants/Images';
import { hp, RF, wp } from '../constants/responsiveFunct';
import CommonStyles from '../constants/styles';
import { translate } from '../walletUtils';
import AppButton from './appButton';
import TextView from './appText';

const ApproveModalContent = props => {
    const { isCreate } = useSelector(state => state.UserReducer);

    const {appData} = props;

    return (
        <View style={styles.container}>
            {/* <IconButton
                icon={'close'}
                color={Colors.headerIcon2}
                size={20}
                style={styles.closeIcon}
                onPress={() => {
                    props.onClose && props.onClose();
                }}
            /> */}

            <Image style={styles.img} source={{uri: appData?.icon ? appData.icon : 'http://www.newdesignfile.com/postpic/2011/03/ios-7-icon-template_108214.png'}} />

            <TextView style={styles.title}>
                {appData?.name}
            </TextView>
            <TextView style={styles.hint}>
                {translate("wallet.common.connectionRequest",{name: appData?.name})}
            </TextView>

            <View style={styles.buttonContainer}>
                <View>
                    <AppButton
                        label={translate("wallet.common.reject")}
                        containerStyle={styles.outLineButton}
                        labelStyle={CommonStyles.outlineButtonLabel}
                        onPress={() => {
                            props.onRejectPress && props.onRejectPress(appData.id);
                        }}
                    />
                </View>
                <View>
                    <AppButton
                        label={translate("wallet.common.accept")}
                        containerStyle={styles.button}
                        labelStyle={CommonStyles.buttonLabel}
                        onPress={() => {
                            props.onAcceptPress && props.onAcceptPress(appData.id);
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        paddingHorizontal: wp('2%'),
        borderRadius: 15,
        alignItems: 'center',
    },
    closeIcon: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.iconBg,
    },
    img: {
        ...CommonStyles.imageStyles(15),
        // marginVertical: hp('3%'),
        marginTop: hp('3%'),
    },
    title: {
        fontSize: RF(3),
        // marginTop: hp('2%'),
    },
    hint: {
        color: Colors.modalHintText,
        marginTop: '4.7%',
        marginBottom: hp('1%'),
        textAlign: 'center',
        fontSize: RF(1.7),
    },
    button: {
        width: '80%',
        ...CommonStyles.button,
        marginVertical: hp('3%'),
    },
    outLineButton: {
        width: '80%',
        marginVertical: hp('3%'),
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp("2%")
    }
});

export default ApproveModalContent;
