import { View, Text, SafeAreaView, TouchableOpacity, StatusBar, SectionList, Image, Platform, TextInput, FlatList, KeyboardAvoidingView, } from 'react-native';
import { AppHeader } from '../../components';
import Colors from '../../constants/Colors';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAiChat } from '../../store/reducer/chatReducer';
import { getOtherDataNft, getMyDataNft } from '../../store/actions/chatAction';
import ImagesSrc from '../../constants/Images';
import { translate } from '../../walletUtils';
import styles from './style';
import AppSearch from '../../components/appSearch';
import { Searchbar } from 'react-native-paper';



const AiChat = () => {
  const dispatch = useDispatch();

  //================== Components State Declaration ===================
  const [message, setMessage] = useState('');
  const [chatMessage, setChatMessage] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const [searchTxt, setSearchTxt] = useState('');

  const flatList = React.useRef(null);

  // =============== Getting data from reducer ========================
  const { chatSuccess, isChatLoading, error } = useSelector(state => state.chatReducer);
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);
  const { chatReducer } = useSelector(state => state);

  const collectionList = chatReducer.chatNftCollectionList;

  console.log('CollectionList is Here >>>>>>> ', collectionList);

  const { userData } = useSelector(
    state => state.UserReducer,
  );

  console.log(userData);

  useEffect(() => {

    console.log('Use effect called============')
    dispatch(getMyDataNft())
    dispatch(getOtherDataNft(userData.userWallet.address))
  }, []);




  //=====================(Main return Function)=============================
console.log('Collection List Length : ', collectionList.length, );
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
      <AppHeader
        showBackButton
        isWhite
        containerStyle={{ backgroundColor: Colors.themeColor, }}
      />
      <Searchbar
        style={styles.searchBar}
        placeholder="Search..."
        onChangeText={txt => {
          setSearchTxt(txt);
        }}
        inputStyle={styles.inputStyle}
        value={searchTxt}
        multiline={false}
      />
      {collectionList.length !== 0 ? (
            <View style={{backgroundColor: Colors.white , marginHorizontal: 10 ,paddingLeft: 10,}}>
              <Text style={{paddingVertical: 10,  fontWeight: 'bold'}}>Others</Text>
              <FlatList
              // style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              data={collectionList}
              // inverted
              // keyExtriactor={(time, index) => index.toString()}
              renderItem={({ item }) => {
                let metaData = item.metadata;
                let data = JSON.parse(metaData);
                return (
                 
                      <View style={{flexDirection: 'row', backgroundColor: Colors.white, paddingVertical:5 ,}}>
                      
                      <Image source={{ uri: data.image }} style={{ height: 30, width: 30, borderRadius: 30/2 }} />
                        <Text style={{ paddingVertical: 10, paddingStart: 5, marginLeft: 10}}>
                          {data.name}</Text>
                      </View>
                
                )
              }} />
              </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.sorryMessageCont}>
                        <Text style={styles.sorryMessage}>{translate('common.noNFTsFound')}</Text>
                    </View>
                </View>
            )
          }















      

      {/* <FlatList
        style={{ flex: 1 }}
        data={data}
        inverted
        keyExtriactor={(time, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View>
              <View style={styles.container}>
                <View style={{ backgroundColor: '#529FF3', margin: 10 }}>
                  <Text style={{ paddingVertical: 10, fontSize: 15, paddingStart: 5, paddingEnd: 16, color: 'black' }}>
                    {item.text}</Text>
                  <Image source={{ uri: item.imgUrl }} style={{ height: 100, width: 100 }} />
                </View>
              </View>
            </View>
          )
        }} /> */}



    </SafeAreaView>
  )
}

export default AiChat;

