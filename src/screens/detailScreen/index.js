import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { View, SafeAreaView, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { colors } from '../../res';
import { Loader, AppHeader } from '../../components';
import NftItem from './nftItem';
import Images from '../../constants/Images';
import { hp } from '../../constants/responsiveFunct';

//================= Unused Imports ==============================
// import { newNFTList, newPageChange, favoriteNFTList } from '../../store/actions/newNFTActions';
// import { getNFTList, pageChange, gifNFTList, movieNFTList } from '../../store/actions/nftTrendList';
// import { myNFTList, myPageChange } from '../../store/actions/myNFTaction';
// import { myCollectionList, myCollectionPageChange } from '../../store/actions/myCollection';
// import { getAwardsNftList, awardsNftPageChange } from '../../store/actions/awardsAction';
// import { nftBlindSeriesCollectionList, nftDataCollectionList, nftDataCollectionPageChange, } from '../../store/actions/nftDataCollectionAction';

const DetailItemScreen = (props) => {
    const dispatch = useDispatch();
    const isFocusedHistory = useIsFocused();

    // =============== Props Destructuring ========================
    const { id, index, sName } = props.route.params;

    // =============== Getting data from reducer ========================
    const { sort } = useSelector(state => state.ListReducer);

    const data = sName == "Hot" ?
        useSelector(state => state.ListReducer.nftList) :
        sName == "newNFT" ?
            useSelector(state => state.NewNFTListReducer.newNftList) :
            sName == "myNFT" ?
                useSelector(state => state.MyNFTReducer.myList) :
                sName == "myCollection" ?
                    useSelector(state => state.MyCollectionReducer.myCollection) :
                    sName == "awards" ?
                        useSelector(state => state.AwardsNFTReducer.awardsNftList) :
                        sName == 'photoNFT' ?
                            useSelector(state => state.NewNFTListReducer.favoriteNftList) :
                            sName == 'gitNFT' ?
                                useSelector(state => state.ListReducer.gifList) :
                                sName == 'movieNFT' ?
                                    useSelector(state => state.ListReducer.movieList) :
                                    sName == "dataCollection" ?
                                        useSelector(state => state.NftDataCollectionReducer.nftDataCollectionList) :
                                        sName == 'blindSeriesCollection' ?
                                            useSelector(state => state.NftDataCollectionReducer.nftBlindSeriesCollectionList) : [];

    //================== Components State Declaration ===================
    const [stopVideos, setStopVideos] = React.useState(true);
    const [listNFT, setNFTList] = React.useState([]);
    const [nftLoad, setNFTLoad] = React.useState(true);
    const [objNft, setObjNft] = React.useState({});
    const [ownerID, setOwnerID] = React.useState(id);

    //===================== UseEffect Function =========================
    React.useEffect(() => {
        if (isFocusedHistory) {
            loadData();
        }
    }, [isFocusedHistory, id])

    const loadData = () => {
        if (!ownerID || ownerID !== id) {
            setObjNft(data[index]);
        }
        setNFTLoad(false)
    }

    //===================== Render Loader Function =========================
    const renderLoader = () => {
        return (
            <View style={styles.loader}>
                <Image source={Images.loadergif} />
            </View>
        )
    }

    //===================== Render Item Detail Function =========================
    const renderItem = (item) => {
        // if (sName == 'blindSeriesCollection' || sName == 'dataCollection' && item) {
        //     // if (item && item.hasOwnProperty("metaData")) {
        //         item.metaData = item
        //     // }
        // }
        if (Object.keys(item).length) {
            if (item && item.hasOwnProperty("metaData") && item.metaData) {
                return (
                    <NftItem screenName={sName} videoStatus={stopVideos} item={item} index={index} minHeight={true} />
                )
            } else {
                item.metaData = { description: item.description, externalLink: item.externalLink, image: item.image, name: item.name, properties: item.properties, thumbnft: item.thumbnft, totalSupply: item.totalSupply }
                item.tokenId = item.newprice?.tokenId
                return (
                    <NftItem screenName={sName} videoStatus={stopVideos} item={item} index={index} minHeight={true} />
                )
            }
        }
    }

    const memoizedValue = React.useMemo(() => renderItem(objNft), [objNft]);

    //=====================(Main return Function)=============================
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={styles.modalCont} >
                <AppHeader
                    showBackButton
                    titleComponent={<View style={styles.headerTextView}>
                    </View>}
                />
                {nftLoad ? renderLoader() : memoizedValue}
            </View>
        </SafeAreaView>
    );
};
export default DetailItemScreen;
