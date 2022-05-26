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

    const {id, index, sName } = route.params;

    const [stopVideos, setStopVideos] = React.useState(true);
    const [listNFT, setNFTList] = React.useState([]);
    const [nftLoad, setNFTLoad] = React.useState(false);
    const [objNft, setObjNft] = React.useState({});
    const [ownerID, setOwnerID] = React.useState('');

    React.useEffect(() => {
        if (isFocusedHistory) {
            setOwnerID(id);
            setNFTLoad(true);
            loadData();
        }
        console.log(sName, "isFocusedHistoryisFocusedHistory", index)
    }, [isFocusedHistory, id])

    const loadData = () => {

        const data = sName == "Hot" ?
            ListReducer.nftList :
            sName == "newNFT" ?
                NewNFTListReducer.newNftList :
                sName == "myNFT" ?
                    MyNFTReducer.myList :
                    sName == "myCollection" ?
                        MyCollectionReducer.myCollection :
                        sName == "awards" ?
                            AwardsNFTReducer.awardsNftList :
                            sName == 'photoNFT' ?
                                NewNFTListReducer.favoriteNftList :
                                sName == 'gitNFT' ?
                                    ListReducer.gifList :
                                    sName == 'movieNFT' ?
                                        ListReducer.movieList :
                                        sName == "dataCollection" ?
                                            NftDataCollectionReducer.nftDataCollectionList :
                                            sName == 'blindSeriesCollection' ?
                                                NftDataCollectionReducer.nftBlindSeriesCollectionList : [];

        // setNFTList(data)
        if (ownerID == '' || ownerID !== id) {
            setObjNft(data[index]);
        }
        setNFTLoad(false)

    }

    const renderItem = (item) => {
        console.log('renderItem 83', item, sName)
        // if (sName == 'blindSeriesCollection' || sName == 'dataCollection' && item) {
        //     // if (item && item.hasOwnProperty("metaData")) {
        //         item.metaData = item
        //     // }
        // }
        if (item && item.hasOwnProperty("metaData") && item.metaData) {
            return (
                <NftItem screenName={sName} videoStatus={stopVideos} item={item} index={index} minHeight={true} />
            )
        }
    }

    const memoizedValue = React.useMemo(() => renderItem(objNft), [objNft]);
    // console.log("🚀 ~ file: index.js ~ line 78 ~ listNFT", listNFT, index, sName)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={styles.modalCont} >
                <AppHeader
                    showBackButton
                    titleComponent={<View style={styles.headerTextView}>
                    </View>}
                />
                {nftLoad ? <Loader /> : memoizedValue}
            </View>
        </SafeAreaView>
    );
};
export default DetailItemScreen;
