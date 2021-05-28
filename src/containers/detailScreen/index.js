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
import { Loader, NoInternetModal, C_Image } from '../../components';
import NftItem from './nftItem';

const DetailItemScreen = ({ route }) => {

    const { ListReducer, AuthReducer, NewNFTListReducer, MyNFTReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [listIndex, setListIndex] = React.useState(0);

    React.useEffect(() => {

        const { index } = route.params;
        setListIndex(index)

        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });

        return () => removeNetInfoSubscription();
    }, []);

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
                                        <NftItem item={item} />
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
