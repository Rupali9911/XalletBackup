import * as React from 'react';
import { View, TouchableOpacity, FlatList, SafeAreaView, Image, Text, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { newNFTList, newPageChange } from '../../store/actions/newNFTActions';

import { getNFTList, pageChange } from '../../store/actions/nftTrendList';

import { myNFTList, myPageChange, favoritePageChange } from '../../store/actions/myNFTaction';

import { myCollectionList } from '../../store/actions/myCollection';

import getLanguage from '../../utils/languageSupport';
const langObj = getLanguage();

import styles from './styles';
import { images, colors } from '../../res';
import { Loader } from '../../components';
import NftItem from './nftItem';

const { width } = Dimensions.get('window');

const DetailItemScreen = ({ route }) => {

    const { ListReducer, AuthReducer, NewNFTListReducer, MyNFTReducer, MyCollectionReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [listIndex, setListIndex] = React.useState(route.params.index);
    const [owner, setOwner] = React.useState(route.params.owner);

    const getNFTlistData = React.useCallback((page) => {

        AuthReducer.screenName == "Hot" ?
            dispatch(getNFTList(page, 5)) :
            AuthReducer.screenName == "newNFT" ?
                dispatch(newNFTList(page)) :
                AuthReducer.screenName == "myNFT" ?
                    dispatch(myNFTList(page, owner)) :
                    AuthReducer.screenName == "myCollection" ?
                        dispatch(myCollectionList(page, owner)) : null

    });

    let list = AuthReducer.screenName == "Hot" ?
        ListReducer.nftList :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newNftList :
            AuthReducer.screenName == "myNFT" ?
                MyNFTReducer.myList :
                AuthReducer.screenName == "myCollection" ?
                    MyCollectionReducer.myCollection : [];

    let loading = AuthReducer.screenName == "Hot" ?
        ListReducer.nftListLoading :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newNftListLoading :
            AuthReducer.screenName == "myNFT" ?
                MyNFTReducer.myNftListLoading :
                AuthReducer.screenName == "myCollection" ?
                    MyCollectionReducer.myCollectionListLoading : null;

    let page = AuthReducer.screenName == "Hot" ?
        ListReducer.page :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newListPage :
            AuthReducer.screenName == "myNFT" ?
                MyNFTReducer.page :
                AuthReducer.screenName == "myCollection" ?
                    MyCollectionReducer.page : 1;

    const renderFooter = () => {
        if (loading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
            <View style={styles.modalCont} >
                <View style={styles.header} >
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon} >
                            <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerTextView}>
                        <Text style={styles.topHeaderText}>
                            {'LALALA'}
                        </Text>
                        <Text style={styles.bottomHeaderText}>
                            {'NFTs'}
                        </Text>
                    </View>
                </View>
                {
                    page === 1 && loading ?
                        <Loader /> :
                        // <NftItem item={list.slice(listIndex)[0]} index={list.findIndex(x => x.id === item.id)} />
                        <FlatList
                            initialNumToRender={5}
                            data={list.slice(listIndex)}
                            renderItem={({ item }) => {
                                let findIndex = list.findIndex(x => x.id === item.id);
                                if (item.metaData) {
                                    return (
                                        <NftItem item={item} index={findIndex} />
                                    )
                                }
                            }}
                            onEndReached={() => {
                                let num = AuthReducer.screenName == "Hot" ?
                                    ListReducer.page + 1 :
                                    AuthReducer.screenName == "newNFT" ?
                                        NewNFTListReducer.newListPage + 1 :
                                        AuthReducer.screenName == "myNFT" ?
                                            MyNFTReducer.page + 1 :
                                            AuthReducer.screenName == "twoDArt" ?
                                                MyCollectionReducer.page + 1 : null;
                                getNFTlistData(num)
                            }}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={0.4}
                            keyExtractor={(v, i) => "item_" + i}
                        />
                }
            </View>
        </SafeAreaView>
    )
}

export default DetailItemScreen;
