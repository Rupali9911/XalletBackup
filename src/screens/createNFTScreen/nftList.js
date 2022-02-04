import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, FlatList } from 'react-native';
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
import { BASE_URL } from '../../common/constants';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';
import Modal from 'react-native-modal';
import { C_Image } from '../../components';

const ListItem = props => {
  let dataToRender = props.toggle == "mint" ? props.data.metaData : props.data;
  return (
    <TouchableOpacity onPress={props.press} style={styles.listCont}>
      <View style={styles.listCenter}>
        <Text style={styles.listLabel}>{dataToRender.name}</Text>
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
      <View style={{ flex: 1 }} >
        <Text style={styles.listLabel}>{props.value}</Text>
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
  switchEditNFT
}) => {

  const [collectionList, setCollectionList] = useState([]);
  const [collection, setCollection] = useState(null);
  const [nftListPage, setNftListPage] = useState(1);
  const [nftListDraftPage, setNftListDraftPage] = useState(1);
  const [nftListCreated, setNftListCreated] = useState([]);
  const [nftListDraft, setNftListDraft] = useState([]);
  const [toggle, setToggle] = useState("mint");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectData, setSelectData] = useState(null);

  const { data } = useSelector(
    state => state.UserReducer
  );
  const { networkType } = useSelector(
    state => state.WalletReducer
  );

  useEffect(() => {
    if (position == 1) {
      cleanData()
      changeLoadingState(true)

      if (nftListDefault) {

        setCollection(nftListDefault.collect)
        if (nftListDefault.name === "draft") {
          pressToggle("draft", nftListDefault.collect)
        } else {
          pressToggle("mint", nftListDefault.collect)
        }
      } else {
        getCollectionList()
      }
    }
  }, [position, nftListDefault])

  const cleanData = () => {
    setNftListPage(1)
    setNftListDraftPage(1)
    setNftListCreated([])
    setNftListDraft([])
  }

  useEffect(() => {
    if (modalScreen === "nftList" && modalItem) {
      if (modalItem !== "closed") {
        cleanData()
        setCollection(modalItem)
        getNftList(modalItem, toggle, 1)
      }
    }

  }, [modalItem])

  const getCollectionList = async () => {
    if (data.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
      const url = `${BASE_URL}/user/view-collection`;
      const body = {
        page: 1,
        limit: 50,
        chainType: networkType.value,
        networkType: networkStatus
      };
      axios.post(url, body)
        .then(collectionList => {
          console.log(collectionList, "nftlist collectionList")
          if (collectionList.data.success) {

            setCollectionList(collectionList.data.data)
            if (collectionList.data.data.length !== 0) {
              let selectedCollection = collectionList.data.data.find(o => o.chainType === networkType.value);
              cleanData()
              if (!nftListDefault) {
                setCollection(selectedCollection ? selectedCollection : collectionList.data.data[0])
              }

              toggle == "mint" ?
                setNftListPage(1) : setNftListDraftPage(1);
              getNftList(selectedCollection, toggle, 1)
            } else {
              changeLoadingState(false)
            }
          } else {
            changeLoadingState(false)
          }
        })
        .catch(e => {
          changeLoadingState(false);
          console.log(e, "nftlist collectionList error");
          alertWithSingleBtn(
            translate("wallet.common.alert"),
            translate("wallet.common.error.networkFailed")
          );
        })
    }
  };

  const getNftList = (collect, tog, page) => {
    const url = `${BASE_URL}/user/listing-nft`;
    let body = {
      collectionAddress: collect.collectionAddress,
      page: page,
      limit: 50,
      status: tog,
    };

    axios.post(url, body)
      .then(res => {
        console.log(res, "nftlist", tog, collect)
        if (res.data.success) {
          if (tog == "mint") {
            setNftListCreated((old) => [...old, ...res.data.data])
          } else {
            setNftListDraft((old) => [...old, ...res.data.data])
          }
        }
        changeLoadingState(false)

      })
      .catch(e => {
        changeLoadingState(false);
        console.log(e, "nftlist collectionList error");
        alertWithSingleBtn(
          translate("wallet.common.alert"),
          translate("wallet.common.error.networkFailed")
        );
      })

  }

  const pressToggle = (v, collect) => {
    changeLoadingState(true)
    setToggle(v);
    v == "mint" ?
      setNftListPage(1) : setNftListDraftPage(1);
    getNftList(collect, v, 1)
  }

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
          image: item.metaData.image,
          name: item.metaData.name,
          minPrice: parseInt(item.newprice[0].price) / Math.pow(10, 18),
          basePrice: getCoinName(item.newprice[0].baseCurrency, item.newprice[0].mainChain),
          chainType: item.newprice?.[0]?.mainChain
        } : item;
        selectItem(objectToRender)
      }} data={item} toggle={toggle} />
    )
  }

  let showList = (toggle == "mint" && nftListCreated.length !== 0) ?
    nftListCreated : (toggle == "draft" && nftListDraft.length !== 0) ?
      nftListDraft : []
  return (
    <View style={styles.childCont}>

      <CardCont style={{ flex: 1 }} >
        <CardLabel>{translate("wallet.common.collection")}</CardLabel>
        <CardField
          inputProps={{ value: collection ? collection.collectionName : "" }}
          onPress={() => showModal({ data: collectionList, title: translate("wallet.common.collectionList"), itemToRender: "collectionName" })}
          pressable
          showRight />
        <View style={[styles.saveBtnGroup, { justifyContent: 'center' }]}>
          <CardButton
            onPress={() => {
              setNftListDraft([]);
              setNftListCreated([]);
              pressToggle("mint", collection)
            }}
            border={toggle !== "mint" ? colors.BLUE6 : null}
            label={translate("wallet.common.created")}
            buttonCont={styles.leftToggle}
          />
          <CardButton
            onPress={() => {
              setNftListDraft([]);
              setNftListCreated([]);
              pressToggle("draft", collection)
            }}
            border={toggle !== "draft" ? colors.BLUE6 : null}
            buttonCont={styles.rightToggle}
            label={translate("common.saveAsDraft")}
          />
        </View>

        <View style={styles.listMainCont}>
          {
            showList.length !== 0 &&

            <FlatList
              data={showList}
              showsVerticalScrollIndicator={false}
              initialNumToRender={50}
              renderItem={renderListItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              onEndReached={() => {
                let num;
                if (toggle == "mint") {
                  num = nftListPage + 1;
                  setNftListPage(num)
                } else {
                  num = nftListDraftPage + 1;
                  setNftListDraftPage(num)
                }
                getNftList(collection, toggle, num)
              }}
              onEndReachedThreshold={0.4}
              keyExtractor={(v, i) => 'item_' + i}
            />
          }

        </View>
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
                    uri={selectData.image}
                    imageStyle={{ height: wp(30), width: wp(30) }}
                  />
                </View>
                <ModalItems
                  label={`${translate("common.nftName")}:`}
                  value={selectData.name}
                />
                <ModalItems
                  label={`${translate("common.price")}:`}
                  value={selectData.minPrice}
                />
                <ModalItems
                  label={`${translate("wallet.common.currencyType")}:`}
                  value={selectData.basePrice}
                />
                <ModalItems
                  label={`${translate("wallet.common.network")}:`}
                  value={selectData.chainType}
                />
                <ModalItems
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
                />
                <ModalItems
                  label={`${translate("common.Earned")}:`}
                  value="-"
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