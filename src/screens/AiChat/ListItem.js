import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {C_Image} from '../../components';
import styles from './style';
import {ImagekitType} from '../../common/ImageConstant';
import {useNavigation} from '@react-navigation/native';
import {setTabTitle} from '../../store/actions/chatAction';
import {useDispatch} from 'react-redux';

const ListItem = ({item, tabTitle, INFT}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const ListNames = item => {
    const getNftName =
      tabTitle === 'Animated'
        ? item?.displayName
          ? item?.displayName
          : item?.nftName
        : item?.name.includes('#')
        ? item?.name.slice(item?.name.lastIndexOf('#'))
        : item?.name;
    return getNftName;
  };

  const ListImage = item => {
    const getImageUrl =
      tabTitle === 'Animated' ? item?.image : item?.smallImage;
    const mainImg = getImageUrl.includes('.png')
      ? getImageUrl.replace('.png', '-thumb.png')
      : getImageUrl;

    return mainImg;
  };

  const NavigationObj = item => {
    const renderNavigateObj = {
      listItems: item,
      nftImage: ListImage(item),
      bot_name: ListNames(item),
      collectionAddress:
        tabTitle === 'Animated'
          ? item?.collectionAddress
          : item?.collection?.address,
      nftId: tabTitle === 'Animated' ? item?.nftId : item?.id,
      tokenId: tabTitle === 'Animated' ? item?.token_id : item?.tokenId,
      isFreeModal: INFT,
    };

    return renderNavigateObj;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setTabTitle(tabTitle));
        navigation.navigate('ChatDetail', {
          chatDetailData: NavigationObj(item),
        });
      }}>
      <View style={styles.nftItemContainer}>
        <View>
          <C_Image
            imageType={'profile'}
            size={ImagekitType.AVATAR}
            uri={ListImage(item)}
            imageStyle={styles.cImageContainer}
          />
        </View>
        <Text style={styles.nftTextShow}>{ListNames(item)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;
