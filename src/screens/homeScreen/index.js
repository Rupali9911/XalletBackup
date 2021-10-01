import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { getNFTList, getAllArtist, nftLoadStart, pageChange, nftListReset } from '../../store/actions/nftTrendList';
import { changeScreenName } from '../../store/actions/authAction';
import { updateCreateState } from '../../store/reducer/userReducer';

import { responsiveFontSize as RF } from '../../common/responsiveFunction';
import styles from './styles';
import { colors, fonts } from '../../res';
import ImageSrc from '../../constants/Images';
import { Loader, DetailModal, C_Image } from '../../components';
import AppModal from '../../components/appModal';
import SuccessModal from '../../components/successModal';
import NotificationActionModal from '../../components/notificationActionModal';
import {
    SIZE,
} from 'src/constants';

import NewNFT from './newNFT';
import Favorite from './favorite';
import getLanguage from '../../utils/languageSupport';
import CommonStyles from '../../constants/styles';
const langObj = getLanguage();

const Tab = createMaterialTopTabNavigator();

const Hot = () => {

    const { ListReducer } = useSelector(state => state);
    const [modalData, setModalData] = useState();
    const [isModalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        dispatch(nftLoadStart());
        dispatch(nftListReset());
        getNFTlist(1);
        dispatch(pageChange(1));
    }, [])

    const getNFTlist = useCallback((page, limit) => {
        dispatch(getNFTList(page, limit));
    }, []);

    const refreshFunc = () => {
        dispatch(nftListReset());
        getNFTlist(1);
        dispatch(pageChange(1));
    }

    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                ListReducer.nftListLoading ?
                    <Loader /> :
                    ListReducer.nftList.length !== 0 ?
                        <FlatList
                            data={ListReducer.nftList}
                            horizontal={false}
                            numColumns={3}
                            initialNumToRender={15}
                            onRefresh={() => {
                                dispatch(nftLoadStart())
                                refreshFunc()
                            }}
                            refreshing={ListReducer.nftListLoading}
                            renderItem={({ item }) => {
                                let findIndex = ListReducer.nftList.findIndex(x => x.id === item.id);
                                if (item.metaData) {
                                    return (
                                        <TouchableOpacity
                                            onLongPress={() => {
                                                setModalData(item);
                                                setModalVisible(true);
                                            }}
                                            onPress={() => {
                                                dispatch(changeScreenName("Hot"));
                                                navigation.navigate("DetailItem", { index: findIndex });
                                            }}
                                            style={styles.listItem}>
                                            {
                                                item.thumbnailUrl !== undefined || item.thumbnailUrl ?
                                                    <C_Image
                                                        uri={item.thumbnailUrl}
                                                        type={item.metaData.image.split('.')[item.metaData.image.split('.').length - 1]}
                                                        imageStyle={styles.listImage} />
                                                    : <View style={styles.sorryMessageCont}>
                                                        <Text style={{ textAlign: "center" }} >No Image to Show</Text>
                                                    </View>
                                            }
                                        </TouchableOpacity>
                                    )
                                }
                            }}
                            onEndReached={() => {
                                let num = ListReducer.page + 1;
                                getNFTlist(num);
                                dispatch(pageChange(num));
                            }}
                            onEndReachedThreshold={1}
                            keyExtractor={(v, i) => "item_" + i}
                        />
                        :
                        <View style={styles.sorryMessageCont} >
                            <Text style={styles.sorryMessage} >{langObj.common.noNFT}</Text>
                        </View>
            }
            {
                modalData &&
                <DetailModal
                    data={modalData}
                    isModalVisible={isModalVisible}
                    toggleModal={() => setModalVisible(false)}
                />
            }
        </View>
    )
}

const HomeScreen = ({ navigation }) => {

    const { ListReducer } = useSelector(state => state);
    const { wallet, isCreate } = useSelector(state => state.UserReducer);
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(isCreate);
    const [isSuccessVisible, setSuccessVisible] = useState(isCreate);
    const [isNotificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        dispatch(getAllArtist());
    }, []);

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
                <View style={styles.header}>
                    <View style={styles.headerMenuContainer}>

                    </View>
                    <Text style={styles.headerTitle}>
                        {'Home'}
                    </Text>
                    <View style={styles.headerMenuContainer}>
                        <TouchableOpacity onPress={() => { navigation.navigate('Certificate') }} hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                            <Image source={ImageSrc.scanIcon} style={styles.headerMenu} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate('Create') }} hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                            <Image source={ImageSrc.addIcon} style={styles.headerMenu} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {
                            ListReducer.artistList &&
                            ListReducer.artistList.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={() => navigation.navigate('ArtistDetail', { data: item })} key={`_${index}`}>
                                        <View style={styles.userCircle}>
                                            <Image source={{ uri: item.profile_image }} style={{ width: '100%', height: '100%' }} />
                                        </View>
                                        <Text numberOfLines={1} style={styles.userText}>
                                            {item.username}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </ScrollView>
                </View>
                <Tab.Navigator tabBarOptions={{
                    activeTintColor: colors.BLUE4,
                    inactiveTintColor: colors.GREY1,
                    style: {
                        boxShadow: 'none',
                        elevation: 0,
                        borderTopColor: '#EFEFEF',
                        borderTopWidth: 1,
                        shadowOpacity: 0,
                    },
                    tabStyle: {
                        height: SIZE(40)
                    },
                    labelStyle: {
                        fontSize: RF(1.4),
                        fontFamily: fonts.SegoeUIRegular,
                        textTransform: 'capitalize'
                    },
                    indicatorStyle: {
                        borderBottomColor: colors.BLUE4,
                        height: 1,
                        marginBottom: SIZE(39)
                    }
                }} >
                    <Tab.Screen name={langObj.common.hot} component={Hot} />
                    <Tab.Screen name={langObj.common.following} component={NewNFT} />
                    <Tab.Screen name={langObj.common.Discover} component={Favorite} />
                </Tab.Navigator>
            </SafeAreaView>
            <AppModal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                {isSuccessVisible ?
                    <SuccessModal
                        onClose={() => setModalVisible(false)}
                        onDonePress={() => {
                            setSuccessVisible(false);
                            setNotificationVisible(true);
                            dispatch(updateCreateState());
                        }}
                    />
                    : null}

                {isNotificationVisible ?
                    <NotificationActionModal
                        onClose={() => setModalVisible(false)}
                        onDonePress={() => {
                            setModalVisible(false);
                        }}
                    />
                    : null}
            </AppModal>
        </>
    )
}

export default HomeScreen;
