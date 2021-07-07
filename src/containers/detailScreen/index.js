import * as React from 'react';
import { View, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { newNFTList, newPageChange } from '../../store/actions/newNFTActions';

import { getNFTList, pageChange } from '../../store/actions/nftTrendList';

import { myNFTList, myPageChange, favoritePageChange } from '../../store/actions/myNFTaction';

import { twoPageChange } from '../../store/actions/twoDAction';
import getLanguage from '../../utils/languageSupport';
const langObj = getLanguage();

import styles from './styles';
import { images } from '../../res';
import { Loader } from '../../components';
import NftItem from './nftItem';

const DetailItemScreen = ({ route }) => {

    const { ListReducer, AuthReducer, NewNFTListReducer, MyNFTReducer, TwoDReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [listIndex, setListIndex] = React.useState(0);

    React.useEffect(() => {

        const { index } = route.params;
        setListIndex(index)

    }, []);

    const getNFTlistData = React.useCallback((page) => {

        AuthReducer.screenName == "Trend" ?
            dispatch(getNFTList(page)) :
            AuthReducer.screenName == "newNFT" ?
                dispatch(newNFTList(page)) :
                AuthReducer.screenName == "favourite" ?
                    dispatch(myNFTList(page, "favorite", 1000)) :
                    AuthReducer.screenName == "twoDArt" ?
                        dispatch(myNFTList(page, "2D", 30)) : null

    });

    const handlePageChange = (page) => {
        AuthReducer.screenName == "Trend" ?
            dispatch(pageChange(page)) :
            AuthReducer.screenName == "newNFT" ?
                dispatch(newPageChange(page)) :
                AuthReducer.screenName == "favourite" ?
                    dispatch(favoritePageChange(page)) :
                    AuthReducer.screenName == "twoDArt" ?
                        dispatch(twoPageChange(page)) : null
    }

    let list = AuthReducer.screenName == "Trend" ?
        ListReducer.nftList :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newNftList :
            AuthReducer.screenName == "favourite" ?
                MyNFTReducer.favorite :
                AuthReducer.screenName == "twoDArt" ?
                    TwoDReducer.twoDNftList : [];

    let loading = AuthReducer.screenName == "Trend" ?
        ListReducer.nftListLoading :
        AuthReducer.screenName == "newNFT" ?
            NewNFTListReducer.newNftListLoading :
            AuthReducer.screenName == "favourite" ?
                MyNFTReducer.myNftListLoading :
                AuthReducer.screenName == "twoDArt" ?
                    TwoDReducer.twoDListLoading : null;
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
                                        <NftItem item={item} index={findIndex} />
                                    )
                                }
                            }}
                            onEndReached={() => {
                                let num = AuthReducer.screenName == "Trend" ?
                                    ListReducer.page + 1 :
                                    AuthReducer.screenName == "newNFT" ?
                                        NewNFTListReducer.newListPage + 1 :
                                        AuthReducer.screenName == "favourite" ?
                                            MyNFTReducer.favoritePage + 1 :
                                            AuthReducer.screenName == "twoDArt" ?
                                                TwoDReducer.page + 1 : null;
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
