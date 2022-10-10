import { View, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchResult, searchText, nftLoadSuccessList, nftLoadStart } from '../../store/actions/chatAction';
import styles from './style';
import { SVGS } from '../../constants';
import { translate } from '../../walletUtils';
import { Searchbar } from 'react-native-paper';
import Colors from '../../constants/Colors';

const { SearchIcon } = SVGS;

const SearchInput = () => {

  // =============== Getting data from States ======================== 
  const [searchTxt, setSearchTxt] = useState('');

  // =============== Getting data from reducer ======================== 
  const { userData } = useSelector(state => state.UserReducer);
  const owner = userData.userWallet.address;
  const dispatch = useDispatch();

  // =============== Use-effect call ================================= 
  useEffect(() => {
    if (searchTxt) {
      const delayDebounceFn = setTimeout(() => {
        dispatch(searchText(searchTxt));
        dispatch(nftLoadStart());
        dispatch(getSearchResult(searchTxt, owner))
          .then(response => {
            let res = {
              nftList: {
                ownerNFTS: [],
                otherNFTs: []
              }
            };
            if (response?.otherNFTs || response?.ownerNFTS) {
              res.nftList.ownerNFTS = response.ownerNFTS;
              res.nftList.otherNFTs = response.otherNFTs;
            }
            dispatch(nftLoadSuccessList(res));

          })
          .catch(err => {
            console.log('search response error', err);
          });
      }, 1000)
      return () => clearTimeout(delayDebounceFn);
    }
    else {
      dispatch(searchText(''));
    }

  }, [searchTxt]);

  // =============== Main Return Function =================================
  return (
    <View>
      <Searchbar
        style={styles.searchBar}
        inputStyle={styles.inputStyle}
        selectionColor={Colors.BLACK1}
        placeholder={translate("common.search")}
        onChangeText={txt => {
          setSearchTxt(txt);
        }}
        value={searchTxt}
        multiline={false}
      />
    </View>

    // <View style={styles.searchBar}>
    //   <SearchIcon width={20} height={20} />
    //   <TextInput
    //     style={{ paddingLeft: 10 }}
    //     placeholder={translate("common.search")}
    //     onChangeText={text => { setSearchTxt(text) }}
    //     inputStyle={styles.inputStyle}
    //     value={searchTxt}
    //     multiline={false}
    //   />
    // </View>
  )
}

export default SearchInput;

