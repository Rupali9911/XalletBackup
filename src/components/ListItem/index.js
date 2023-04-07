import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { responsiveFontSize as RF } from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';
import { translate } from '../../walletUtils';
import styles from './styles';


const ListItem = props => {
    const { isBackup } = useSelector(state => state.UserReducer);
    return (
        <TouchableOpacity
            disabled={props.disableView}
            onPress={props.onPress}
            style={styles.itemCont}>
            <View style={styles.centerProfileCont}>
                <View>
                    <Text style={styles.listLabel}>{props.label}</Text>
                    {props.subLabel && (
                        <Text
                            style={[
                                styles.listSubLabel,
                                { color: isBackup ? Colors.badgeGreen : Colors.alert },
                            ]}>
                            {
                                isBackup ? translate('wallet.common.backupSuccess')
                                    : translate('wallet.common.notBackedUp')
                            }
                        </Text>
                    )}
                </View>
                {props.rightText ? (
                    <Text style={styles.listLabel}>{props.rightText}</Text>
                ) : props.right ? (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.listLabel}>{props.right}</Text>
                        <EntypoIcon
                            size={RF(2.5)}
                            color={Colors.GREY8}
                            name="chevron-right"
                        />
                    </View>
                ) : props.rightComponent ? (
                    props.rightComponent
                ) : props.noArrow ? null : (
                    <EntypoIcon
                        size={RF(2.5)}
                        color={Colors.GREY8}
                        name="chevron-right"
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default ListItem;