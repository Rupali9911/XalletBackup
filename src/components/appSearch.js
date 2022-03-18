import {useIsFocused, useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
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
import {Searchbar} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import Images from '../constants/Images';
import {hp, RF, wp} from '../constants/responsiveFunct';
import CommonStyles from '../constants/styles';
import {searchNFT, updateNftDetail} from '../store/actions/newNFTActions';
import {translate} from '../walletUtils';
import LoadingView from './LoadingView';

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
                        if (response.success) {
                            setDataToList(response.data);
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

    const searchNftType = txt => {
    if (txt !== '') {
      setloading(true);
      dispatch(searchNFT(txt))
        .then(response => {
          console.log('search response', response);
          setloading(false);
          if (response.success) {
            setDataToList(response.data);
          } else {
            setSearchData([]);
          }
        })
        .catch(err => {
          console.log('search response error', err);
          setloading(false);
          setSearchData([]);
        });
    } else {
      setloading(false);
      setSearchData([]);
    }
  };

  const setDataToList = list => {
    let array = [];
    list[0]?.artist?.map((item, index) => {
      array.push({
        ...item,
        type: 'Artist',
      });
    });
      list[1]?.collections?.map((item, index) => {
          array.push({
              ...item,
              type: 'Collections',
          });
      });
    list[2]?.nft?.map((item, index) => {
      array.push({
        ...item,
        type: 'NFT',
      });
    });
    setSearchData(array);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        style={styles.searchbar}
        inputStyle={styles.inputStyle}
        selectionColor={Colors.BLACK1}
        placeholder={translate('wallet.common.searchHint')}
        onChangeText={txt => {
          setSearchTxt(txt);
        }}
        value={searchTxt}
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
              renderItem={({item, index}) => {
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
                        const image = item.metaData.image || item.thumbnailUrl;
                        const fileType = image
                          ? image.substring(image.lastIndexOf('.') + 1)
                          : '';
                        navigation.navigate('CertificateDetail', {
                          id: item.newtokenId,
                          name: item.metaData.name,
                          description: item.metaData.description,
                          thumbnailUrl: item.thumbnailUrl,
                          video: item.metaData.image,
                          fileType: fileType,
                          price: item.price,
                          chain: item.chain,
                          tokenId: item.tokenId,
                          item: item
                        });
                      } else if (item.type == 'Artist') {
                        const id =
                          item.role === 'crypto' ? item.username : item._id;
                        navigation.navigate('ArtistDetail', {id: id});
                      }else if (item.type == 'Collections') {
                          navigation.push('CollectionDetail', { isBlind: false, collectionId: item._id });
                          //navigation.push('CollectionDetail', { isBlind: true, collectionId: item._id });
                      }
                    }}
                  />
                );
              }}
              keyExtractor={(item, index) => `_${index}`}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const ResultItem = ({item, index, withTag, onPress}) => {
  const [loading, setLoading] = useState(false);
  return (
    <View style={[styles.resultItemContainer]}>
      {withTag && <Text style={styles.labelText}>{item.type}</Text>}
      <TouchableOpacity style={styles.resultItem} onPress={() => onPress(item)}>
        <View style={styles.imageContainer}>
          <Image
            source={
              item.type == 'NFT'
                ? {uri: item.thumbnailUrl}
                : item.type == 'Collections' ? {uri: item.iconImage} : item.profile_image
                ? {uri: item.profile_image}
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
          {item.type == 'NFT' ? item.metaData?.name : item.type == 'Collections' ? item.collectionName : item?.title ? item.title : item?.username}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginVertical: hp("6%"),
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  searchbar: {
    borderWidth: 1,
    borderColor: Colors.borderLightColor3,
    borderRadius: hp('3%'),
    marginHorizontal: wp('2'),
    marginTop: wp('2%'),
    width: wp('88%'),
    height: hp('4.3%'),
    paddingVertical: 0,
  },
  inputStyle: {
    fontSize: RF(1.8),
    fontFamily: Fonts.PINGfANG,
    color: Colors.BLACK1,
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
    height:Platform.OS === 'ios' ? hp('51%') : hp('48%')
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
});
