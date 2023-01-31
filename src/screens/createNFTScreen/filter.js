import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '../../res';
import { networkType as networkStatus } from "../../common/networkType";

import styles from './styles';
import { CardCont, CardField, CardLabel, CardButton } from './components';
import { heightPercentageToDP as hp } from '../../common/responsiveFunction';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../common/constants';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';
import Modal from 'react-native-modal';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import { Portal } from '@gorhom/portal';

const ListItem = props => {
  return (
    <View style={styles.listCont} >
      <TouchableOpacity onPress={props.press} style={{ flex: 1 }}>
        <View style={styles.listCenter}>
          <Text style={styles.listLabel}>{props.label}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.deletePress} >
        <Image style={styles.imageStyles(5)} source={require("../../../assets/images/delete.png")} />
      </TouchableOpacity>
    </View>
  );
};

const filterTypeList = [
  {
    name: "Text",
    code: "wallet.common.text"
  },
  {
    name: "Number",
    code: "wallet.common.number"
  }
]

const Filter = ({
  changeLoadingState,
  position,
  showModal,
  modalItem,
  modalScreen
}) => {

  const [collectionList, setCollectionList] = useState([]);
  const [collection, setCollection] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [listLoader, setlistLoader] = useState(false);

  const [filterList, setFilterList] = useState([]);
  const [filterActive, setFilterActive] = useState(null);
  const [filterActiveStatus, setFilterActiveStatus] = useState("");

  const [activeModal, setActiveModal] = useState("");

  const { userData } = useSelector(
    state => state.UserReducer
  );
  const { networkType } = useSelector(
    state => state.WalletReducer
  );

  useEffect(() => {
    if (position == 4) {
      // changeLoadingState(true)
      // getCollectionList()
    }
  }, [position])

  useEffect(() => {
    if (modalScreen === "filter" && modalItem) {
      if (modalItem !== "closed") {
        if (activeModal === "collection") {
          setCollection(modalItem)
          getFiltersList(modalItem._id)
        } else {
          let filterActiveItem = filterActive && { ...filterActive };
          if (filterActiveItem) {
            filterActiveItem.filter_type = modalItem.name;
            filterActiveItem.filter_value = "";
            filterActiveItem.filter_value2 = "";
            setFilterActive(filterActiveItem)
          }
        }
      }
      setActiveModal("")
    }

  }, [modalItem])

  const getCollectionList = async () => {
    if (userData.access_token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
      const url = `${BASE_URL}/user/view-collection`;
      const body = {
        page: 1,
        limit: 50,
        chainType: networkType.value,
        networkType: networkStatus,
      };
      axios.post(url, body)
        .then(collectionList => {
          if (collectionList.data.success) {

            setCollectionList(collectionList.data.data)
            if (collectionList.data.data.length !== 0) {
              let selectedCollection = collectionList.data.data.find(o => o.chainType === networkType.value);
              let selectedData = selectedCollection ? selectedCollection : collectionList.data.data[0];
              setCollection(selectedData)
              getFiltersList(selectedData._id)
            } else {
              changeLoadingState(false)
            }
          } else {
            changeLoadingState(false)
          }
        })
        .catch(e => {
          changeLoadingState(false);
          // alertWithSingleBtn(
          //   translate("wallet.common.alert"),
          //   translate("wallet.common.error.networkFailed")
          // );
        })
    }
  };

  const getFiltersList = async (id) => {
    setlistLoader(true)
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.access_token}`,
      };
      const url = `${BASE_URL}/user/get-Filter-collection`;
      const dataToSend = {
        collectionId: id,
      };
      let result = await axios.post(url, dataToSend, { headers: headers });
      if (result?.data?.success) {
        setFilterList(result.data.data);
      }
      setlistLoader(false)
    } catch (err) {
      setlistLoader(false)
    }
    changeLoadingState(false)
  }

  const saveFilter = () => {
    setFilterActiveStatus("")
    setModalVisible(false)
    changeLoadingState(true)

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.access_token}`,
    };
    const url = `${BASE_URL}/user/create-Filter-collection`;

    let dataToSend = {
      collectionId: collection?._id,
      filter_name: filterActive?.filter_name,
      filter_type: filterActive?.filter_type,
      filter_value: filterActive?.filter_value,
      filter_value2: filterActive.hasOwnProperty("filter_value2") ? filterActive?.filter_value2 : ""
    };

    axios
      .post(url, dataToSend, { headers: headers })
      .then(res => {
        getFiltersList(collection?._id)
      })
      .catch(err => {
        changeLoadingState(false)
      });

  }

  const deleteFilter = (item) => {
    setFilterActiveStatus("")
    setModalVisible(false)
    changeLoadingState(true)

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.access_token}`,
    };
    const url = `${BASE_URL}/user/delete-Filter-collection`;

    let dataToSend = {
      collectionId: collection?._id,
      requestId: item._id,
    };
    axios
      .post(url, dataToSend, { headers: headers })
      .then(res => {
        getFiltersList(collection?._id);
      })
      .catch(err => {
        changeLoadingState(false)
      });
  }

  const editFilter = () => {
    setFilterActiveStatus("")
    setModalVisible(false)
    changeLoadingState(true)

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.access_token}`,
    };
    const url = `${BASE_URL}/user/edit-Filter-collection`;

    let dataToSend = {
      collectionId: collection?._id,
      requestId: filterActive._id,
      filter_name: filterActive?.filter_name,
      filter_type: filterActive?.filter_type,
      filter_value: filterActive?.filter_value,
      filter_value2: filterActive.hasOwnProperty("filter_value2") ? filterActive?.filter_value2 : ""
    };

    axios
      .post(url, dataToSend, { headers: headers })
      .then(res => {
        getFiltersList(collection?._id)
      })
      .catch(err => {
        changeLoadingState(false)
      });
  }

  const renderListItem = ({ item, index }) => {
    return (
      <ListItem
        press={() => {
          setFilterActive(item)
          setModalVisible(true)
        }}
        deletePress={() => deleteFilter(item)}
        label={item.filter_name} />
    )
  }
  const saveEditDisble = filterActive && filterActive.filter_name &&
    filterActive.filter_value &&
    (filterActive.filter_type === "Number" ?
      filterActive.filter_value2 : true)
  const addNewFilterDisable = collection && collection.collectionName.toLowerCase() == "xanalia";

  const keyExtractor = (item, index) => { return 'item_' + index }
  const handleItemSeparatorComponent = () => (<View style={styles.separator} />)
  return (
    <View style={styles.childCont}>
      <CardCont>
        <CardLabel>{translate("wallet.common.collection")}</CardLabel>
        <CardField
          inputProps={{ value: collection ? collection.collectionName : "" }}
          onPress={() => {
            setActiveModal("collection")
            showModal({ data: collectionList, title: translate("wallet.common.collectionList"), itemToRender: "collectionName" })
          }}
          pressable
          showRight />
      </CardCont>
      <CardCont style={{ flex: 1 }} >

        {
          listLoader ?
            <View style={styles.progressLoader} >
              <ActivityIndicator size="small" color={colors.BLUE6} />
            </View> :
            filterList.length !== 0 ?
              <FlatList
                data={filterList}
                renderItem={renderListItem}
                ItemSeparatorComponent={handleItemSeparatorComponent}
                keyExtractor={keyExtractor}
              /> : null
        }

        <CardButton
          onPress={() => {
            let filterItem = {
              filter_name: "",
              filter_type: "Number",
              filter_value: ""
            }
            setFilterActive(filterItem)
            setFilterActiveStatus("New");
            setModalVisible(true)
          }}
          disable={addNewFilterDisable}
          buttonCont={{ width: '48%', backgroundColor: addNewFilterDisable ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }}
          label={translate("wallet.common.addFilter")}
        />
      </CardCont>
      <Portal>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={() => {
            setFilterActiveStatus("")
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
            <Text style={styles.modalTitle}>{translate("wallet.common.filter")}</Text>
            <CardLabel style={{ marginTop: hp(5) }}>{translate("wallet.common.filterName")}</CardLabel>
            <CardField
              inputProps={{
                placeholder: translate("wallet.common.filterName"),
                value: filterActive ? filterActive.filter_name : "",
                onChangeText: (e) => {
                  let filterActiveItem = filterActive ? { ...filterActive } : null;
                  if (filterActiveItem) {
                    filterActiveItem.filter_name = e;
                    setFilterActive(filterActiveItem)
                  }
                }
              }}
            />
            <CardLabel>{translate("common.type")}</CardLabel>
            <CardField
              onPress={() => {
                setActiveModal("filterType")
                showModal({ data: filterTypeList, title: translate("common.selectType"), itemToRender: "name", translate: "code" })
              }}
              inputProps={{
                value: filterActive ? translate(`wallet.common.${filterActive.filter_type.toLowerCase()}`) : "",
              }}
              pressable
              showRight
            />
            <CardLabel>{translate("wallet.common.value")}</CardLabel>
            {
              filterActive && filterActive.filter_type == "Number" ?
                <>
                  <View style={styles.groupField}>
                    <CardField
                      inputProps={{
                        placeholder: translate("wallet.common.number"),
                        keyboardType: "number-pad",
                        value: filterActive ? filterActive.filter_value : "",
                        onChangeText: (e) => {
                          let filterActiveItem = filterActive ? { ...filterActive } : null;
                          if (filterActiveItem) {
                            filterActiveItem.filter_value = e;
                            setFilterActive(filterActiveItem)
                          }
                        }
                      }}
                      contStyle={{ width: '38%' }}
                    />
                    <View style={styles.centerFieldCont}>
                      <Text style={styles.titleDes}>{translate("common.toFilter")}</Text>
                    </View>
                    <CardField
                      inputProps={{
                        placeholder: translate("wallet.common.number"),
                        keyboardType: "number-pad",
                        value: filterActive && filterActive.hasOwnProperty("filter_value2") ? filterActive.filter_value2 : "",
                        onChangeText: (e) => {
                          let filterActiveItem = filterActive ? { ...filterActive } : null;
                          if (filterActive) {
                            filterActiveItem.filter_value2 = e;
                            setFilterActive(filterActiveItem)
                          }
                        }
                      }}
                      contStyle={{ width: '38%' }}
                    />
                  </View>
                </> :
                <CardField
                  inputProps={{
                    value: filterActive ? filterActive.filter_value : "",
                    onChangeText: (e) => {
                      let filterActiveItem = filterActive ? { ...filterActive } : null;
                      if (filterActiveItem) {
                        filterActiveItem.filter_value = e;
                        setFilterActive(filterActiveItem)
                      }
                    }
                  }}
                />
            }

            <View style={styles.saveBtnGroup}>
              <CardButton
                onPress={filterActiveStatus === "New" ? saveFilter : editFilter}
                disable={!saveEditDisble}
                label={filterActiveStatus === "New" ? translate("common.save") : translate("wallet.common.edit")}
                buttonCont={{ width: '48%', backgroundColor: !saveEditDisble ? '#rgba(59,125,221,0.5)' : colors.BLUE6 }} />
              <CardButton
                border={colors.BLUE6}
                buttonCont={{ width: '48%' }}
                label={translate("common.Cancel")}
                onPress={() => {
                  setFilterActiveStatus("")
                  setModalVisible(false)
                }}
              />
            </View>

          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default Filter;
