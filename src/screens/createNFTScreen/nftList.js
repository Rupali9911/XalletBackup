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

const NFTList = ({
  changeLoadingState,
  position,
  showModal,
  modalItem,
  modalScreen
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
      changeLoadingState(true)
      getCollectionList()
    }
  }, [position])

  useEffect(() => {
    if (modalScreen === "nftList" && modalItem) {
      if (modalItem !== "closed") {
        setNftListDraft([]);
        setNftListCreated([]);
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
        networkType: networkStatus,
      };
      axios.post(url, body)
        .then(collectionList => {
          // console.log(collectionList, "nftlist collectionList")
          if (collectionList.data.success) {

            setCollectionList(collectionList.data.data)
            if (collectionList.data.data.length !== 0) {
              let selectedCollection = collectionList.data.data.find(o => o.chainType === networkType.value);
              setCollection(selectedCollection ? selectedCollection : collectionList.data.data[0])
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
        console.log(res, "nftlist", tog)
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

  const pressToggle = (v) => {
    changeLoadingState(true)
    setNftListDraft([]);
    setNftListCreated([]);
    setToggle(v);
    v == "mint" ?
      setNftListPage(1) : setNftListDraftPage(1);
    getNftList(collection, v, 1)
  }

  const selectItem = (v) => {
    setSelectData(v)
    setModalVisible(true)
  }

  const renderListItem = ({ item, index }) => {
    return (
      <ListItem press={() => selectItem(item)} data={item} />
    )
  }

  return (
    <View style={styles.childCont}>

      <CardCont>
        <CardLabel>Collection</CardLabel>
        <CardField
          inputProps={{ value: collection ? collection.collectionName : "" }}
          onPress={() => showModal({ data: collectionList, title: "Collection List", itemToRender: "collectionName" })}
          pressable
          showRight />
        <View style={[styles.saveBtnGroup, { justifyContent: 'center' }]}>
          <CardButton
            onPress={() => pressToggle("mint")}
            border={toggle !== "mint" ? colors.BLUE6 : null}
            label="Created"
            buttonCont={styles.leftToggle}
          />
          <CardButton
            onPress={() => pressToggle("draft")}
            border={toggle !== "draft" ? colors.BLUE6 : null}
            buttonCont={styles.rightToggle}
            label="Draft"
          />
        </View>

        <View style={styles.listMainCont}>
          {
            (toggle == "mint" && nftListCreated.length !== 0) || (toggle == "draft" && nftListDraft.length !== 0) ?

              <FlatList
                data={toggle == "mint" ? nftListCreated : nftListDraft}
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
              /> :
              <View style={styles.sorryMessageCont} >
                <Text style={styles.sorryMessage} >No Data Found</Text>
              </View>
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
            NFT Detail
          </Text>
          {
            selectData ?
              <ScrollView style={{ marginTop: hp('3%') }}>
                <View style={{ width: "100%", paddingVertical: 8, flexDirection: "row", justifyContent: "space-between" }} >
                  <View style={{ flex: 1 }} >
                    <Text style={{ ...styles.listLabel, fontWeight: "bold" }}>NFT Name:</Text>
                  </View>
                  <View style={{ flex: 1 }} >
                    <Text style={styles.listLabel}>{selectData.name}</Text>
                  </View>
                </View>
                <View style={{ width: "100%", paddingVertical: 8, flexDirection: "row", justifyContent: "space-between" }} >
                  <View style={{ flex: 1 }} >
                    <Text style={{ ...styles.listLabel, fontWeight: "bold" }}>Price:</Text>
                  </View>
                  <View style={{ flex: 1 }} >
                    <Text style={styles.listLabel}>{selectData.minPrice}</Text>
                  </View>
                </View>
                <View style={{ width: "100%", paddingVertical: 8, flexDirection: "row", justifyContent: "space-between" }} >
                  <View style={{ flex: 1 }} >
                    <Text style={{ ...styles.listLabel, fontWeight: "bold" }}>Currency Type:</Text>
                  </View>
                  <View style={{ flex: 1 }} >
                    <Text style={styles.listLabel}>{selectData.basePrice}</Text>
                  </View>
                </View>
                <View style={{ width: "100%", paddingVertical: 8, flexDirection: "row", justifyContent: "space-between" }} >
                  <View style={{ flex: 1 }} >
                    <Text style={{ ...styles.listLabel, fontWeight: "bold" }}>Network:</Text>
                  </View>
                  <View style={{ flex: 1 }} >
                    <Text style={styles.listLabel}>{selectData.chainType}</Text>
                  </View>
                </View>


                <View style={styles.saveBtnGroup}>
                  <CardButton
                    onPress={() => null}
                    label="Edit"
                    buttonCont={{ width: '48%' }}
                  />
                  <CardButton
                    onPress={() => null}
                    border={colors.BLUE6}
                    buttonCont={{ width: '48%' }}
                    label="Delete"
                  />
                </View>
              </ScrollView> : null}
        </View>
      </Modal>
    </View>
  );
};

export default NFTList;
