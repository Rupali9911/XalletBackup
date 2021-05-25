import * as React from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { getNFTList, handleLikeDislike, pageChange } from '../../store/actions';
import styles from './styles';
import { images, colors } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';

const DetailItemScreen = ({ route }) => {

    const { ListReducer, AuthReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isOffline, setOfflineStatus] = React.useState(false);
    const [listIndex, setListIndex] = React.useState(0);

    React.useEffect(() => {
        const { index } = route.params;
        setListIndex(index)

        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });

        return () => removeNetInfoSubscription();
    }, [])

    const getNFTlist = React.useCallback((page) => {

        dispatch(getNFTList(page))
        isOffline && setOfflineStatus(false);

    }, [isOffline]);

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <View style={styles.modalCont} >
                <View style={styles.header} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon} >
                        <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                {
                    ListReducer.nftListLoading ?
                        <Loader /> :
                        <FlatList
                            initialNumToRender={10}
                            data={ListReducer.nftList.slice(listIndex)}
                            renderItem={({ item }) => {
                                let findIndex = ListReducer.nftList.findIndex(x => x.id === item.id);
                                if (item.metaData) {
                                    return (
                                        <View>
                                            <View style={styles.bgImageCont} >
                                                <C_Image uri={item.metaData.image} imageStyle={styles.bgImage} />
                                                <View style={[styles.bgImageCont, { backgroundColor: colors.black_opacity(0.8) }]} />
                                            </View>
                                            <C_Image uri={item.metaData.image} imageStyle={styles.modalImage} />

                                            <View style={styles.bottomModal} >
                                                <View style={styles.modalLabelCont} >
                                                    <Text style={styles.modalLabel} >{item.metaData.name}</Text>
                                                    {
                                                        AuthReducer.accountKey ?
                                                            <TouchableOpacity onPress={() => dispatch(handleLikeDislike(item, findIndex))} >
                                                                <Image style={styles.heartIcon} source={item.like == 1 ? images.icons.heartA : images.icons.heart} />
                                                            </TouchableOpacity> : null
                                                    }
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
                                                <Text style={styles.description} >{item.metaData.description}</Text>
                                                <TouchableOpacity>
                                                    <LinearGradient colors={[colors.themeL, colors.themeR]} style={styles.modalBtn}>
                                                        <Text style={[styles.modalLabel, { color: colors.white }]} >Buy</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }
                            }}
                            onEndReached={() => {
                                let num = ListReducer.page + 1;
                                getNFTlist(num)
                                dispatch(pageChange(num))
                            }}

                            onEndReachedThreshold={1}
                            keyExtractor={(v, i) => "item_" + i}
                        />
                }
                <NoInternetModal
                    show={isOffline}
                    onRetry={() => {
                        getNFTlist(1)
                        dispatch(pageChange(1))
                    }}
                    isRetrying={ListReducer.nftListLoading}
                />
            </View>
        </SafeAreaView >
    )
}

export default DetailItemScreen;
