import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '../../res';
import { networkType as networkStatus } from "../../common/networkType";

import styles from './styles';
import { CardCont, CardField, CardLabel, CardButton } from './components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import { IMAGES } from '../../constants';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL, NEW_BASE_URL } from '../../common/constants';
import { toFixCustom } from './helperFunction';
import { translate } from '../../walletUtils';
import Modal from 'react-native-modal';
import { C_Image } from '../../components';
import sendRequest from '../../helpers/AxiosApiRequest';
import { SIZE, SVGS } from 'src/constants';
const { Ethereum } = SVGS;

const ListItem = props => {
  // let dataToRender = props.toggle == "mint" ? props.data.metaData : props.data;
  return (
    <TouchableOpacity onPress={props.press} style={styles.listCont}>
      <View style={styles.listCenter}>
        <Text style={styles.listLabel}>{props?.data?.nftName}</Text>
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
        <Text style={{ ...styles.listLabel, fontWeight: "bold" }}>{props?.label}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }} >
        {props.label === 'Earned:' && <Ethereum style={{ marginRight: SIZE(5) }} />}
        <Text style={styles.listLabel}>{props?.value}</Text>
      </View>
    </View>
  )
}

const NFTList = ({
  changeLoadingState,
  position,
  showModal,
  modalItem,
  modalScreen,
  nftListDefault,
  switchEditNFT,
  dropDowntitle
}) => {

  const { userData } = useSelector(
    state => state.UserReducer
  );
  const { networkType } = useSelector(
    state => state.WalletReducer
  );

  const { networks } = useSelector(
    state => state.NetworkReducer
  );

  const [collectionList, setCollectionList] = useState([]);
  const [collection, setCollection] = useState(null);
  const [createdCollectedList, setcreatedCollectedList] = useState([{
    id: 1,
    value: 'Created',
  },
  {
    id: 2,
    value: 'Collected',
  },]);
  const [createdCollected, setcreatedCollected] = useState(null);
  const [networkList, setNetworkList] = useState(networks);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [nftListPage, setNftListPage] = useState(1);
  const [nftListDraftPage, setNftListDraftPage] = useState(1);
  const [nftListCreated, setNftListCreated] = useState([]);
  const [nftListDraft, setNftListDraft] = useState([]);
  const [toggle, setToggle] = useState("mint");
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true)
  const [pageLoader, setPageLoader] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectData, setSelectData] = useState(null);


  useEffect(async () => {
    cleanData();
    changeLoadingState(true)
    getCollectionList()
    getNftList(1)
  }, [])

  useEffect(() => {
    if (modalScreen === "nftList" && modalItem) {
      if (modalItem !== "closed") {
        if (dropDowntitle.title === "Created / Collected") {
          setcreatedCollected(modalItem)
        } else if (dropDowntitle.title === "Network") {
          setSelectedNetwork(modalItem)
        } else {
          setCollection(modalItem)
        }
      }
    }
  }, [modalItem])

  const cleanData = () => {
    setNftListPage(1)
    setNftListCreated([])
    // setNftListDraftPage(1)
    // setNftListDraft([])
  }

  // useEffect(() => {
  //   if (position == 1) {
  //     // cleanData()
  //     // changeLoadingState(true)
  //     getCollectionList()

  //     if (nftListDefault) {

  //       setCollection(nftListDefault.collect)
  //       if (nftListDefault.name === "draft") {
  //         pressToggle("draft", nftListDefault.collect)
  //       } else {
  //         pressToggle("mint", nftListDefault.collect)
  //       }
  //     }
  //   }
  // }, [position, nftListDefault])

  const getCollectionList = async () => {
    sendRequest({
      url: `${NEW_BASE_URL}/collections/user-collections`,
      method: 'GET',
      params: {
        networkId: 1
      }
    })
      .then(res => {
        if (res?.data?.length !== 0) {
          setCollectionList(res?.data);
          //   if (res.data.data.length !== 0) {
          //     let selectedCollection = res.data.data.find(o => o.chainType === networkType.value);
          //     // cleanData()
          //     if (!nftListDefault) {
          //       setCollection(selectedCollection ? selectedCollection : res.data.data[0])
          //     }

          //     toggle == "mint" ?
          //       setNftListPage(1) : setNftListDraftPage(1);
          //     // getNftList(selectedCollection, toggle, 1)
          //   } else {
          //     changeLoadingState(false)
          //   }
          // } else {
          //   changeLoadingState(false)
        }
        changeLoadingState(false);
      })
      .catch(e => {
        changeLoadingState(false);
        console.log(e, "nftlist collectionList error");
        // alertWithSingleBtn(
        //   translate("wallet.common.alert"),
        //   translate("wallet.common.error.networkFailed")
        // );
      })
  };

  const getNftList = (num, status) => {
    let params = {
      pageIndex: num,
      pageSize: 50
    }
    if (!status) {
      if (createdCollected) {
        params = {
          ...params,
          ownerNft: createdCollected?.value
        }
      }
      if (selectedNetwork) {
        params = {
          ...params,
          network: selectedNetwork?.id
        }
      }
      if (collection) {
        params = {
          ...params,
          collection: collection?.id
        }
      }
    }
    sendRequest({
      url: `${NEW_BASE_URL}/nfts`,
      method: 'GET',
      params
    })
      .then(res => {
        if (res && res?.list?.length !== 0) {
          setOnEndReachedCalledDuringMomentum(true)
          setNftListCreated((old) => [...old, ...res.list])
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
    setNftListPage(1);
    getNftList(1);
  }

  const resetFilter = () => {
    setCollection(null);
    setcreatedCollected(null);
    setSelectedNetwork(null);
    changeLoadingState(true)
    setNftListPage(1);
    getNftList(1, 'Reset');
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
          image: item?.thumbnailUrl,
          name: item?.nftName,
          // minPrice: parseInt(item.price) / Math.pow(10, 18),
          minPrice: Number(item?.price),
          // basePrice: getCoinName(item.receiveToken, item.network),
          basePrice: item?.marketStatus === 0 ? '' : item?.receiveToken,
          chainType: typeof item?.network === 'string' && item?.network,
          earned: toFixCustom(item?.totalPrice) || 0
        } : item;
        selectItem(objectToRender)
      }} data={item} toggle={toggle} />
    )
  }

  let showList = (toggle == "mint" && nftListCreated.length !== 0) ?
    nftListCreated : (toggle == "draft" && nftListDraft.length !== 0) ?
      nftListDraft : []
  const handleFlastListEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      setPageLoader(true);
      setOnEndReachedCalledDuringMomentum(true);
      let num;
      if (toggle == "mint") {
        num = nftListPage + 1;
        setNftListPage(num)
      } else {
        num = nftListDraftPage + 1;
        setNftListDraftPage(num)
      }
      getNftList(num)
    }
  }

  const _onMomentumScrollBegin = () => {
    setOnEndReachedCalledDuringMomentum(false)
  }

  const keyExtractor = (item, index) => { return 'item_' + index }

  return (
    <View style={styles.childCont}>

      <CardCont style={{ flex: 1 }} >
        <CardLabel>{translate("common.CREATED_COLLECTED")}</CardLabel>
        <CardField
          inputProps={{ value: createdCollected ? createdCollected?.value : "" }}
          onPress={() => showModal({ data: createdCollectedList, title: translate("common.CREATED_COLLECTED"), itemToRender: "value" })}
          pressable
          showRight />
        <CardLabel>{translate("wallet.common.network")}</CardLabel>
        <CardField
          inputProps={{ value: selectedNetwork ? selectedNetwork?.name : "" }}
          onPress={() => showModal({ data: networkList, title: translate("wallet.common.network"), itemToRender: "name" })}
          pressable
          showRight />
        <CardLabel>{translate("wallet.common.collection")}</CardLabel>
        <CardField
          inputProps={{ value: collection ? collection?.name : "" }}
          onPress={() => showModal({ data: collectionList, title: translate("wallet.common.collectionList"), itemToRender: "name" })}
          pressable
          showRight />
        <View style={[styles.saveBtnGroup]}>
          <CardButton
            onPress={() => {
              // setNftListDraft([]);
              setNftListCreated([]);
              searchNFTListWithFilter();
              // pressToggle("mint", collection)
            }}
            disable={createdCollected || selectedNetwork || collection ? false : true}
            border={toggle !== "mint" ? colors.BLUE6 : null}
            label={translate("wallet.common.search")}
            buttonCont={styles.leftToggle}
          />
          <CardButton
            onPress={() => {
              // setNftListDraft([]);
              setNftListCreated([]);
              resetFilter();
              // pressToggle("mint", collection)
            }}
            disable={createdCollected || selectedNetwork || collection ? false : true}
            border={toggle == "mint" ? colors.BLUE6 : null}
            label={translate("wallet.common.saveAsDraft")}
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
        {pageLoader ? (
          <ActivityIndicator size="small" color={'#000000'} />
        ) : null}
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
            {translate("wallet.common.nFTDetail")}
          </Text>
          {
            selectData ?
              <ScrollView>
                <View style={styles.nftImageCont} >
                  <C_Image
                    uri={selectData?.image}
                    imageStyle={{ height: wp(30), width: wp(30) }}
                  />
                </View>
                <ModalItems
                  label={`${translate("common.nftName")}:`}
                  value={selectData?.name}
                />
                <ModalItems
                  label={`${translate("common.price")}:`}
                  value={selectData?.minPrice}
                />
                <ModalItems
                  label={`${translate("wallet.common.currencyType")}:`}
                  value={selectData?.basePrice}
                />
                <ModalItems
                  label={`${translate("wallet.common.network")}:`}
                  value={selectData?.chainType}
                />
                {/* <ModalItems
                  label={`${translate("wallet.common.supply")}:`}
                  value="1/1"
                />
                <ModalItems
                  label={`${translate("wallet.common.status")}:`}
                  value={toggle}
                />
                <ModalItems
                  label={`${translate("common.lastprice")}:`}
                  value={selectData.minPrice}
                />
                <ModalItems
                  label={`${translate("common.trade")}:`}
                  value="-"
                /> */}
                <ModalItems
                  label={`${translate("common.Earned")}:`}
                  value={selectData?.earned}
                />
                {
                  toggle !== "mint" &&
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
                }

              </ScrollView> : null}
        </View>
      </Modal>
    </View>
  );
};

export default NFTList;
