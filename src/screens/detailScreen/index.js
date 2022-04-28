import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { View, FlatList, SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { newNFTList, newPageChange, favoriteNFTList } from '../../store/actions/newNFTActions';

import { getNFTList, pageChange, gifNFTList, movieNFTList } from '../../store/actions/nftTrendList';

import { myNFTList, myPageChange } from '../../store/actions/myNFTaction';

import { myCollectionList, myCollectionPageChange } from '../../store/actions/myCollection';

import { getAwardsNftList, awardsNftPageChange } from '../../store/actions/awardsAction';

import { nftBlindSeriesCollectionList, nftDataCollectionList, nftDataCollectionPageChange, } from '../../store/actions/nftDataCollectionAction';

import styles from './styles';
import { colors } from '../../res';
import { Loader, AppHeader } from '../../components';
import NftItem from './nftItem';

const DetailItemScreen = (props) => {
    const { route } = props;
    const isFocusedHistory = useIsFocused();

    const {
        ListReducer,
        AuthReducer,
        NewNFTListReducer,
        MyNFTReducer,
        MyCollectionReducer,
        AwardsNFTReducer,
        NftDataCollectionReducer
    } = useSelector(state => state);

    const { sort } = useSelector(state => state.ListReducer);
    const dispatch = useDispatch();

    const { collectionType, index, collectionAddress, showNFT } = route.params;

    const [owner, setOwner] = React.useState(route.params.owner);
    const [stopVideos, setStopVideos] = React.useState(true);
    const [listNFT, setNFTList] = React.useState([]);
    const [nftLoad, setNFTLoad] = React.useState(false);

    React.useEffect(() => {
        if (isFocusedHistory) {
            setNFTLoad(true)
            loadData()
        }
        console.log(AuthReducer.screenName, "isFocusedHistoryisFocusedHistory", index)
    }, [isFocusedHistory])

    const loadData = () => {

        const data = AuthReducer.screenName == "Hot" ?
            ListReducer.nftList :
            AuthReducer.screenName == "newNFT" ?
                NewNFTListReducer.newNftList :
                AuthReducer.screenName == "myNFT" ?
                    MyNFTReducer.myList :
                    AuthReducer.screenName == "myCollection" ?
                        MyCollectionReducer.myCollection :
                        AuthReducer.screenName == "awards" ?
                            AwardsNFTReducer.awardsNftList :
                            AuthReducer.screenName == 'photoNFT' ?
                                NewNFTListReducer.favoriteNftList :
                                AuthReducer.screenName == 'gitNFT' ?
                                    ListReducer.gifList :
                                    AuthReducer.screenName == 'movieNFT' ?
                                        ListReducer.movieList :
                                        AuthReducer.screenName == "dataCollection" ?
                                            NftDataCollectionReducer.nftDataCollectionList :
                                            AuthReducer.screenName == 'blindSeriesCollection' ?
                                                NftDataCollectionReducer.nftBlindSeriesCollectionList : [];

        setNFTList(data)
        setNFTLoad(false)

    }

    const renderItem = (item) => {
        if (AuthReducer.screenName == 'blindSeriesCollection') item.metaData = item;
        if (item && item.hasOwnProperty("metaData") && item.metaData) {
            return (
                <NftItem videoStatus={stopVideos} item={item} index={index} minHeight={true} />
            )
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={styles.modalCont} >
                <AppHeader
                    showBackButton
                    titleComponent={<View style={styles.headerTextView}>
                    </View>}
                />
                {
                    nftLoad ?
                        <Loader /> :
                        renderItem(listNFT[index])
                }
            </View>
        </SafeAreaView>
    );
};
export default DetailItemScreen;
