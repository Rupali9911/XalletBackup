import * as React from 'react';
import { View, TouchableOpacity, FlatList, SafeAreaView, Image, Text, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { newNFTList, newPageChange } from '../../store/actions/newNFTActions';

import { getNFTList, pageChange } from '../../store/actions/nftTrendList';

import { myNFTList, myPageChange, favoritePageChange } from '../../store/actions/myNFTaction';

import { myCollectionList, myCollectionPageChange } from '../../store/actions/myCollection';

import { getAwardsNftList, awardsNftPageChange } from '../../store/actions/awardsAction';

import getLanguage from '../../utils/languageSupport';
const langObj = getLanguage();

import styles from './styles';
import { images, colors } from '../../res';
import { Loader } from '../../components';
import NftItem from './nftItem';

const { width } = Dimensions.get('window');

const DetailItemScreen = ({ route }) => {

    const { ListReducer, AuthReducer, NewNFTListReducer, MyNFTReducer, MyCollectionReducer, AwardsNFTReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [listIndex, setListIndex] = React.useState(route.params.index);
    const [owner, setOwner] = React.useState(route.params.owner);

    const getNFTlistData = React.useCallback((page) => {

        AuthReducer.screenName == "Hot" ?
            dispatch(getNFTList(page, 24)) :
            AuthReducer.screenName == "newNFT" ?
                dispatch(newNFTList(page, 24)) :
                AuthReducer.screenName == "myNFT" ?
                    dispatch(myNFTList(page, 24, owner)) :
                    AuthReducer.screenName == "myCollection" ?
                        dispatch(myCollectionList(page, 24, owner)) :
                        AuthReducer.screenName == "awards" ?
                            dispatch(getAwardsNftList(page, 24, owner)) : null

    });

    const getPage = React.useCallback((page) => {

        AuthReducer.screenName == "Hot" ?
            dispatch(pageChange(page)) :
            AuthReducer.screenName == "newNFT" ?
                dispatch(newPageChange(page)) :
                AuthReducer.screenName == "myNFT" ?
                    dispatch(myPageChange(page)) :
                    AuthReducer.screenName == "myCollection" ?
                        dispatch(myCollectionPageChange(page)) :
                        AuthReducer.screenName == "awards" ?
                            dispatch(awardsNftPageChange(page)) : null

    });

    let list = AuthReducer.screenName == "Hot" ?
        ListReducer.nftList :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newNftList :
            AuthReducer.screenName == "myNFT" ?
                MyNFTReducer.myList :
                AuthReducer.screenName == "myCollection" ?
                    MyCollectionReducer.myCollection :
                    AuthReducer.screenName == "awards" ?
                        AwardsNFTReducer.awardsNftList : [];

    let loading = AuthReducer.screenName == "Hot" ?
        ListReducer.nftListLoading :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newNftListLoading :
            AuthReducer.screenName == "myNFT" ?
                MyNFTReducer.myNftListLoading :
                AuthReducer.screenName == "myCollection" ?
                    MyCollectionReducer.myCollectionListLoading :
                    AuthReducer.screenName == "awards" ?
                        AwardsNFTReducer.awardsNftLoading : null;

    let page = AuthReducer.screenName == "Hot" ?
        ListReducer.page :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newListPage :
            AuthReducer.screenName == "myNFT" ?
                MyNFTReducer.myListPage :
                AuthReducer.screenName == "myCollection" ?
                    MyCollectionReducer.page :
                    AuthReducer.screenName == "awards" ?
                        AwardsNFTReducer.awardsNftPage : 1;

    let totalCount = AuthReducer.screenName == "Hot" ?
        ListReducer.totalCount :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newTotalCount :
            AuthReducer.screenName == "myNFT" ?
                MyNFTReducer.myNftTotalCount :
                AuthReducer.screenName == "myCollection" ?
                    MyCollectionReducer.myCollectionTotalCount :
                    AuthReducer.screenName == "awards" ?
                        AwardsNFTReducer.awardsTotalCount : 1;

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    const renderItem = ({ item }) => {
        let findIndex = list.findIndex(x => x.id === item.id);
        if (item.metaData) {
            return (
                <NftItem item={item} index={findIndex} />
            )
        }
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
                        <FlatList
                            initialNumToRender={5}
                            data={list.slice(listIndex)}
                            renderItem={renderItem}
                            onEndReached={() => {
                                if (!loading && totalCount !== list.length) {
                                    let num = AuthReducer.screenName == "Hot" ?
                                        ListReducer.page + 1 :
                                        AuthReducer.screenName == "newNFT" ?
                                            NewNFTListReducer.newListPage + 1 :
                                            AuthReducer.screenName == "myNFT" ?
                                                MyNFTReducer.page + 1 :
                                                AuthReducer.screenName == "twoDArt" ?
                                                    MyCollectionReducer.page + 1 :
                                                    AuthReducer.screenName == "awards" ?
                                                        AwardsNFTReducer.awardsNftPage + 1 : null;
                                    getNFTlistData(num);
                                    getPage(num);
                                }
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
