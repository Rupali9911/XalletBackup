import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
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

const NFTList = ({ changeLoadingState, position }) => {

  const [collectionList, setCollectionList] = useState([]);
  const [toggle, setToggle] = useState(false);

  const { wallet, data } = useSelector(
    state => state.UserReducer
  );
  // const { networkType } = useSelector(
  //   state => state.WalletReducer
  // );

  useEffect(() => {
    console.log(position)
    if (position == 1) {
      getCollectionList()
    }
  }, [position])

  const getCollectionList = async () => {
    const publicAddress = wallet.address;
    const privKey = wallet.privateKey;
    if (publicAddress && data.token) {
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
          console.log(collectionList, "nftlist collectionList")
          if (collectionList.data.success) {
            setCollectionList(collectionList.data.data)
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


  return (
    <View style={styles.childCont}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CardCont>
          <CardLabel>Collection</CardLabel>
          <CardField pressable showRight />
          <View style={[styles.saveBtnGroup, { justifyContent: 'center' }]}>
            <CardButton
              onPress={() => setToggle(true)}
              border={!toggle ? colors.BLUE6 : null}
              label="Created"
              buttonCont={styles.leftToggle}
            />
            <CardButton
              onPress={() => setToggle(false)}
              border={toggle ? colors.BLUE6 : null}
              buttonCont={styles.rightToggle}
              label="Draft"
            />
          </View>

          <View style={styles.listMainCont}>
            <ListItem />
            <View style={styles.separator} />
            <ListItem />
            <View style={styles.separator} />
            <ListItem />
            <View style={styles.separator} />
            <ListItem />
            <View style={styles.separator} />
            <ListItem />
          </View>
        </CardCont>
      </ScrollView>
    </View>
  );
};

export default NFTList;
