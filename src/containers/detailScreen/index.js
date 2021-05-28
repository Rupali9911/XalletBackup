import * as React from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { newNFTList, newPageChange } from '../../store/actions/newNFTActions';

import { getNFTList, handleLikeDislike, pageChange } from '../../store/actions/nftTrendList';

import { myNFTList, myPageChange } from '../../store/actions/myNFTaction';

import styles from './styles';
import { images, colors } from '../../res';
import { Loader, C_Image } from '../../components';

const DetailItemScreen = ({ route }) => {

    const { ListReducer, AuthReducer, NewNFTListReducer, MyNFTReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [listIndex, setListIndex] = React.useState(0);

    React.useEffect(() => {

        const { index } = route.params;
        setListIndex(index)

    }, [])

    const getNFTlistData = React.useCallback((page) => {

        AuthReducer.screenName == "Trend" ?
            dispatch(getNFTList(page)) :
            AuthReducer.screenName == "newNFT" ?
                dispatch(newNFTList(page)) :
                AuthReducer.screenName == "favourite" ?
                    dispatch(myNFTList(page)) : null

    });

    const handlePageChange = (page) => {
        AuthReducer.screenName == "Trend" ?
            dispatch(pageChange(page)) :
            AuthReducer.screenName == "newNFT" ?
                dispatch(newPageChange(page)) :
                AuthReducer.screenName == "favourite" ?
                    dispatch(myPageChange(page)) : null
    }

    let list = AuthReducer.screenName == "Trend" ?
        ListReducer.nftList :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newNftList :
            AuthReducer.screenName == "favourite" ?
                MyNFTReducer.favorite : [];

    let loading = AuthReducer.screenName == "Trend" ?
        ListReducer.nftListLoading :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newNftListLoading :
            AuthReducer.screenName == "favourite" ?
                MyNFTReducer.myNftListLoading : null;
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <View style={styles.modalCont} >
                <View style={styles.header} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon} >
                        <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                {
                    loading ?
                        <Loader /> :
                        <FlatList
                            initialNumToRender={10}
                            data={list.slice(listIndex)}
                            renderItem={({ item }) => {
                                let findIndex = list.findIndex(x => x.id === item.id);
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
                                let num = AuthReducer.screenName == "Trend" ?
                                    ListReducer.page + 1 :
                                    AuthReducer.screenName == "newNFT" ?
                                        NewNFTListReducer.newListPage + 1 :
                                        AuthReducer.screenName == "favourite" ?
                                            MyNFTReducer.myListPage + 1 : null;
                                getNFTlistData(num)
                                handlePageChange(num)
                            }}

                            onEndReachedThreshold={1}
                            keyExtractor={(v, i) => "item_" + i}
                        />
                }

            </View>
        </SafeAreaView >
    )
}

export default DetailItemScreen;
