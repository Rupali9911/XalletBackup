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

const ListItem = props => {
  return (
    <TouchableOpacity style={styles.listCont}>
      <View style={styles.listCenter}>
        <Text style={styles.listLabel}>Testing</Text>
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
            setNftListCreated(res.data.data)
          } else {
            setNftListDraft(res.data.data)
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

    setToggle(v);
    v == "mint" ?
      setNftListPage(1) : setNftListDraftPage(1);
    getNftList(collection, v, 1)
  }

  const renderListItem = ({ item, index }) => {
    return (
      <ListItem />
    )
  }

  return (
    <View style={styles.childCont}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

            {/* <View style={styles.separator} /> */}
          </View>
        </CardCont>
      </ScrollView>
    </View>
  );
};

export default NFTList;
