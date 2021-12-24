import React from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Image
} from 'react-native';
import Colors from '../../../constants/Colors';
import { startLoader } from '../../../store/reducer/userReducer';
import { wp, hp, RF } from '../../../constants/responsiveFunct';
import ImagesSrc from '../../../constants/Images';
import TextView from '../../../components/appText';
import Checkbox from '../../../components/checkbox';
import { networkChain } from '../../../walletUtils';
import {useSelector} from "react-redux";

const NetworkPicker = (props) => {

    const { visible, onRequestClose, network, onItemSelect } = props;
    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

    return (
        <Modal
            visible={visible}
            transparent
            onRequestClose={onRequestClose}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.emptyView} onPress={onRequestClose} />
                <View style={styles.contentContainer}>
                    <FlatList
                        data={networkChain}
                        keyExtractor={(item, index) => `_${index}`}
                        renderItem={({ item, index }) => {
                            const isCheck = network ? network.name === item.name : false;
                            return <TouchableOpacity style={styles.listItem} onPress={() => onItemSelect(item)}>
                                <TextView style={styles.text}>{selectedLanguageItem.language_name === 'ja' ? item.translatedName : item.name}</TextView>
                                <Image style={[styles.logoSize, props.logoStyle]} resizeMode="contain" source={isCheck ? ImagesSrc.checkIcon : ImagesSrc.unCheckIcon} />
                            </TouchableOpacity>
                        }} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.transparentModal
    },
    emptyView: {
        flex: 1,
    },
    contentContainer: {
        backgroundColor: Colors.white,
        padding: wp("4%"),
        paddingBottom: hp("4%")
    },
    listItem: {
        flexDirection: 'row',
        paddingVertical: hp("1%"),
        alignItems: 'center'
    },
    text: {
        flex: 1,
        fontSize: RF(2.3),
        color: Colors.black,
    },
    logoSize: {
        width: wp("7.5%"),
        height: wp("7.5%"),
    }
});

export default NetworkPicker;
