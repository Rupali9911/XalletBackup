import { useIsFocused, useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { IMAGES, SIZE } from '../constants';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import Images from '../constants/Images';
import { hp, RF, wp } from '../constants/responsiveFunct';
import CommonStyles from '../constants/styles';
import { searchNFT, updateNftDetail } from '../store/actions/newNFTActions';
import { translate } from '../walletUtils';
import LoadingView from './LoadingView';
import { Verifiedcollections } from './verifiedCollection';

export default function AppSearch() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [loading, setloading] = useState(false);
  const [searchTxt, setSearchTxt] = useState('');
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    setSearchData([]);
    setSearchTxt('');
  }, [isFocused]);

  useEffect(() => {
    if (searchTxt !== '') {
      setloading(true);
      const delayDebounceFn = setTimeout(() => {
        console.log(searchTxt)
        dispatch(searchNFT(searchTxt))
          .then(response => {
            console.log('search response', response);
            setloading(false);
            if (response?.artistSearch.length > 0 || response?.collectionSearch.length > 0 || response?.nftSearch.length > 0) {
              setDataToList(response);
            } else {
              setSearchData([]);
            }
          })
          .catch(err => {
            console.log('search response error', err);
            setloading(false);
            setSearchData([]);
          });
      }, 1000)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setloading(false);
      setSearchData([]);
    }
  }, [searchTxt])

  const setDataToList = list => {
    let array = [];
    list?.artistSearch?.map((item, index) => {
      array.push({
        ...item,
        type: 'Artist',
      });
    });
    list?.collectionSearch?.map((item, index) => {
      array.push({
        ...item,
        type: 'Collections',
      });
    });
    list?.nftSearch?.map((item, index) => {
      array.push({
        ...item,
        type: 'NFT',
      });
    });
    setSearchData(array);
  };

  const handleFlatListRenderItem = ({ item, index }) => {
    let withTag = false;
    if (index == 0) {
      withTag = true;
    } else if (searchData[index - 1].type !== item.type) {
      withTag = true;
    }
    return (
      <ResultItem
        item={item}
        index={index}
        withTag={withTag}
        onPress={item => {
          if (item.type == 'NFT') {
            navigation.navigate('CertificateDetail', { item: item });
          } else if (item.type == 'Artist') {
            navigation.navigate('ArtistDetail', { id: item?.address });
          } else if (item.type == 'Collections') {
            navigation.push('CollectionDetail', { item: item });
          }
        }}
      />
    );
  }

  const keyExtractor = (item, index) => { return `_${index}` }

  return (
    <View style={styles.container}>
      <Searchbar
        style={styles.searchBar}
        inputStyle={styles.inputStyle}
        selectionColor={Colors.BLACK1}
        placeholder={translate('wallet.common.searchHint')}
        onChangeText={txt => {
          setSearchTxt(txt);
        }}
        value={searchTxt}
        multiline={false}
      />

      {loading || searchData?.length ? (
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color={Colors.themeColor} size={25} />
            </View>
          ) : searchData.length > 0 && searchTxt ? (
            <FlatList
              data={searchData}
              keyboardShouldPersistTaps={'handled'}
              style={styles.flatlistStyle}
              renderItem={handleFlatListRenderItem}
              keyExtractor={keyExtractor}
            />
          ) : null}
        </View>
      ) :
        searchTxt ?
          <View style={[styles.listContainer, styles.noDataFoundStyle]}>
            <Text>{translate('common.noDataFound')}</Text>
          </View>
          : null}
    </View>
  );
}

const ResultItem = ({ item, index, withTag, onPress }) => {
  const [loading, setLoading] = useState(false);
  return (
    <View style={[styles.resultItemContainer]}>
      {withTag && <Text style={styles.labelText}>{item.type}</Text>}
      <TouchableOpacity style={styles.resultItem} onPress={() => onPress(item)}>
        <View style={styles.imageContainer}>
          <Image
            source={
              item.type == 'NFT'
                ? { uri: item.smallImage }
                : item.type == 'Collections' ? { uri: item.iconImage } : item.avatar
                  ? { uri: item.avatar }
                  : Images.default_user
            }
            style={styles.image}
            resizeMode={'cover'}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => {
              setLoading(false);
            }}
          />
          {loading && <LoadingView />}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {item?.name ? item.name : '---'}
          <View style={{ paddingLeft: 5 }}>{Verifiedcollections.find((id) => id === item._id) && (
            <Image
              style={styles.verifyIcon}
              source={IMAGES.tweetPng}
            />
          )}
          </View>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    top: hp('1.5%')
  },
  searchBar: {
    borderWidth: 1,
    borderColor: Colors.borderLightColor3,
    borderRadius: hp('3%'),
    width: wp('95%'),
    height: hp('5%'),
    paddingVertical: 0,
  },
  verifyIcon: {
    width: SIZE(10),
    height: SIZE(10),
    borderRadius: SIZE(10)
  },
  inputStyle: {
    fontSize: RF(1.8),
    fontFamily: Fonts.PINGfANG,
    color: Colors.BLACK1,
    height: '100%',
    margin: 0,
    padding: 0
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: hp('0.5%'),
    marginHorizontal: wp('2%'),
    borderRadius: wp('1%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    flex: 1,
    color: Colors.black,
  },
  resultItemContainer: {},
  flatlistStyle: {
    height: Platform.OS === 'ios' ? hp('51%') : hp('48%')
  },
  resultItem: {
    padding: wp('2%'),
    paddingHorizontal: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    width: wp('100%'),
    backgroundColor: Colors.inputBackground,
    padding: wp('2%'),
    paddingHorizontal: wp('3.5%'),
    fontWeight: 'bold',
  },
  imageContainer: {
    borderRadius: wp('3.5%'),
    overflow: 'hidden',
    marginRight: wp('2%'),
  },
  image: {
    ...CommonStyles.imageStyles(7),
    borderRadius: wp('3.5%'),
  },
  loaderContainer: {
    padding: wp('2%'),
  },
  noDataFoundStyle: {
    width: '95%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
