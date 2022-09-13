import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '../../res';
import styles from './styles';
import { CardCont, CardField, CardLabel, CardButton } from './components';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import { IMAGES } from '../../constants';
import { useSelector } from 'react-redux';
import { NEW_BASE_URL } from '../../common/constants';
import { timeSince } from './helperFunction';
import { translate } from '../../walletUtils';
import Modal from 'react-native-modal';
import { C_Image } from '../../components';
import sendRequest from '../../helpers/AxiosApiRequest';
import { SIZE, SVGS } from 'src/constants';
const { Ethereum } = SVGS;

const ListItem = props => {
    return (
        <TouchableOpacity onPress={props.press} style={styles.listCont}>
            <View style={styles.listCenter}>
                <Text style={styles.listLabel}>{props.data.name}</Text>
            </View>
            <Image source={IMAGES.leftArrow} style={styles.imageStyles(3)} />
        </TouchableOpacity>
    );
};

const basePriceTokens = [
    {
        key: 'ETH',
        value: 'ETH',
        chain: 'ethereum',
        order: 1,
    },
    {
        key: 'USDT',
        value: 'USDT',
        chain: 'ethereum',
        order: 0,
    },
    {
        key: 'ALIA',
        value: 'ALIA',
        chain: 'binance',
        order: 0,
    },
    {
        key: 'BUSD',
        value: 'BUSD',
        chain: 'binance',
        order: 1,
    },

    {
        key: 'BNB',
        value: 'BNB',
        chain: 'binance',
        order: 2,
    },

    {
        key: 'ALIA',
        value: 'ALIA',
        chain: 'polygon',
        order: 0,
    },
    {
        key: 'USDC',
        value: 'USDC',
        chain: 'polygon',
        order: 1,
    },

    {
        key: 'ETH',
        value: 'ETH',
        chain: 'polygon',
        order: 2,
    },

    {
        key: 'MATIC',
        value: 'MATIC',
        chain: 'polygon',
        order: 3,
    },
];

const ModalItems = props => {
    return (
        <View style={styles.modalNftItemCont} >
            <View style={{ flex: 1 }} >
                <Text style={{ ...styles.listLabel, fontWeight: "bold" }}>{props.label}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.listLabel}>{props.value}</Text>
            </View>
        </View>
    )
}

const CollectionList = ({
    changeLoadingState,
    position,
    showModal,
    modalItem,
    modalScreen,
    nftListDefault,
    switchEditNFT,
    dropDowntitle
}) => {

    const { networks } = useSelector(
        state => state.NetworkReducer
    );

    const [collectionList, setCollectionList] = useState([]);
    const [collectionListPage, setcollectionListPage] = useState(1);
    const [networkList, setNetworkList] = useState(networks);
    const [selectedNetwork, setSelectedNetwork] = useState(null);
    const [nftListDraftPage, setNftListDraftPage] = useState(1);
    const [toggle, setToggle] = useState("mint");
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true)
    const [pageLoader, setPageLoader] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectData, setSelectData] = useState(null);

    const [createdCollected, setcreatedCollected] = useState(null);
    const [nftListPage, setNftListPage] = useState(1);
    const [nftListCreated, setNftListCreated] = useState([]);
    const [nftListDraft, setNftListDraft] = useState([]);

    useEffect(async () => {
        cleanData();
        changeLoadingState(true)
        getActualCollectionList(1)
    }, [])

    useEffect(() => {
        if (modalScreen === "collectionList" && modalItem) {
            if (modalItem !== "closed") {
                setSelectedNetwork(modalItem)
            }
        }
    }, [modalItem])

    const cleanData = () => {
        setcollectionListPage(1)
        setCollectionList([])
    }

    const getActualCollectionList = (num) => {
        let params = {
            page: num,
            limit: 5,
            status: 1
        }
        if (selectedNetwork) {
            params = {
                ...params,
                networkId: selectedNetwork.id
            }
        }
        sendRequest({
            url: `${NEW_BASE_URL}/collections/actual-collections`,
            method: 'GET',
            params
        })
            .then(res => {
                if (res.data.length !== 0) {
                    setOnEndReachedCalledDuringMomentum(true)
                    setCollectionList((old) => [...old, ...res.data])
                }
                changeLoadingState(false)
                setPageLoader(false);
            })
            .catch(e => {
                changeLoadingState(false);
                console.log(e, "nftlist collectionList error");
                // alertWithSingleBtn(
                //   translate("wallet.common.alert"),
                //   translate("wallet.common.error.networkFailed")
                // );
            })
    }

    const searchNFTListWithFilter = () => {
        changeLoadingState(true)
        setcollectionListPage(1);
        getActualCollectionList(1);
    }

    // const pressToggle = (v, collect) => {
    //   setToggle(v);
    //   {
    //     collect && ((v == "mint" ?
    //       setNftListPage(1) : setNftListDraftPage(1)), getNftList(collect, v, 1), changeLoadingState(true))
    //   }
    // }

    const selectItem = (v) => {
        setSelectData(v)
        setModalVisible(true)
    }

    const getCoinName = (token, chainType) => {
        let foundCoin = "";
        if (token && chainType) {
            for (let coin in basePriceTokens) {
                if (basePriceTokens[coin]?.chain == chainType && basePriceTokens[coin]?.order == token) {
                    foundCoin = basePriceTokens[coin]?.value;
                }
            }
        }
        return foundCoin;
    }

    const renderListItem = ({ item, index }) => {
        return (
            <ListItem press={() => {
                let objectToRender = toggle == "mint" ? {
                    image: item.iconImage,
                    name: item.name,
                    symbol: item.symbol ? item.symbol : '',
                    contractAddress: item.contractAddress ? item.contractAddress : '',
                    network: item?.network?.name,
                    status: item.status,
                    createdAt: timeSince(new Date(item.createdAt)),
                    nftCreated: item.totalNft,
                    type: item.type
                } : item;
                selectItem(objectToRender)
            }} data={item} toggle={toggle} />
        )
    }

    let showList = (collectionList.length !== 0) ?
        collectionList : []

    const handleFlastListEndReached = () => {
        if (!onEndReachedCalledDuringMomentum) {
            setPageLoader(true);
            setOnEndReachedCalledDuringMomentum(true);
            let num;
            if (toggle == "mint") {
                num = collectionListPage + 1;
                setcollectionListPage(num)
            } else {
                num = nftListDraftPage + 1;
                setNftListDraftPage(num)
            }
            getActualCollectionList(num)
        }
    }

    const _onMomentumScrollBegin = () => {
        setOnEndReachedCalledDuringMomentum(false)
    }

    const keyExtractor = (item, index) => { return 'item_' + index }

    return (
        <View style={styles.childCont}>

            <CardCont style={{ flex: 1 }} >
                <CardLabel>{translate("wallet.common.network")}</CardLabel>
                <CardField
                    inputProps={{ value: selectedNetwork ? selectedNetwork.name : "" }}
                    onPress={() => showModal({ data: networkList, title: translate("wallet.common.network"), itemToRender: "name" })}
                    pressable
                    showRight />
                <View style={[styles.saveBtnGroup, { justifyContent: 'center' }]}>
                    <CardButton
                        onPress={() => {
                            setCollectionList([]);
                            searchNFTListWithFilter();
                        }}
                        disable={selectedNetwork ? false : true}
                        border={toggle !== "mint" ? colors.BLUE6 : null}
                        label={translate("wallet.common.search")}
                        buttonCont={styles.leftToggle}
                    />
                    {/* <CardButton
            onPress={() => {
              setNftListDraft([]);
              setNftListCreated([]);
              pressToggle("draft", collection)
            }}
            border={toggle !== "draft" ? colors.BLUE6 : null}
            buttonCont={styles.rightToggle}
            label={translate("common.saveAsDraft")}
          /> */}
                </View>

                <View style={styles.listMainCont}>
                    {
                        showList.length !== 0 &&

                        <FlatList
                            data={showList}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={50}
                            renderItem={renderListItem}
                            keyExtractor={keyExtractor}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            onEndReachedThreshold={0.1}
                            onEndReached={handleFlastListEndReached}
                            onMomentumScrollBegin={_onMomentumScrollBegin}
                        />
                    }
                </View>
                {pageLoader && <ActivityIndicator size="small" color={'#000000'} />}
            </CardCont>
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => {
                    setModalVisible(false)
                }}
                backdropColor="#B4B3DB"
                backdropOpacity={0.8}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}>
                <View style={styles.modalCont}>
                    <Text style={styles.modalTitle}>
                        {translate("common.collected")}{' '}{translate("wallet.common.detail")}
                    </Text>
                    {
                        selectData ?
                            <ScrollView>
                                <View style={styles.nftImageCont} >
                                    <C_Image
                                        uri={selectData.image}
                                        imageStyle={{ height: wp(30), width: wp(30) }}
                                    />
                                </View>
                                <ModalItems
                                    label={`${translate("common.nftName")}:`}
                                    value={selectData.name}
                                />
                                <ModalItems
                                    label={`${translate("common.LIST_COLLECTION_TABLE_SYMBOL")}:`}
                                    value={selectData.symbol}
                                />
                                <ModalItems
                                    label={`${translate("wallet.common.contractAddress")}:`}
                                    value={selectData.contractAddress}
                                />
                                <ModalItems
                                    label={`${translate("wallet.common.network")}:`}
                                    value={selectData.network}
                                />
                                <ModalItems
                                    label={`${translate("wallet.common.status")}:`}
                                    value={selectData.status}
                                />
                                <ModalItems
                                    label={`${translate("wallet.common.created")}:`}
                                    value={selectData.createdAt}
                                />
                                <ModalItems
                                    label={`${translate("common.NFT")} ${translate("common.created")}:`}
                                    value={selectData.nftCreated}
                                />
                                {/* <ModalItems
                                    label={`${translate("common.trade")}:`}
                                    value="-"
                                />
                                <ModalItems
                                    label={`${translate("common.Earned")}:`}
                                    value={selectData.earned}
                                /> */}
                                {/* {
                                    selectData.type === 4 &&
                                    <View style={styles.saveBtnGroup}>
                                        <CardButton
                                            onPress={() => {
                                                setModalVisible(false)
                                                switchEditNFT(selectData)
                                            }}
                                            label={translate("wallet.common.edit")}
                                            buttonCont={{ width: '48%' }}
                                        />
                                        <CardButton
                                            onPress={() => null}
                                            border={colors.BLUE6}
                                            buttonCont={{ width: '48%' }}
                                            label={translate("wallet.common.delete")}
                                        />
                                    </View>
                                } */}

                            </ScrollView> : null}
                </View>
            </Modal>
        </View>
    );
};

export default CollectionList;
