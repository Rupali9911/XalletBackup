import React, {useState} from 'react';
import {Box, Flex, HStack, Pressable, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, View} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {C_Image} from '../../components';
import {SVGS} from '../../constants';
import {fonts} from '../../res';
import {translate} from '../../walletUtils';
import {NEW_BASE_URL} from '../../common/constants';
import {ImagekitType} from '../../common/ImageConstant';
import sendRequest from '../../helpers/AxiosApiRequest';
import {alertWithSingleBtn, numberWithCommas} from '../../utils';
import {styles} from './styled';

const {ThreeDotsVerticalIcon, HeartWhiteIcon, HeartActiveIcon} = SVGS;

export const handleLike = async nftItem => {
  let getNftItem = {...nftItem};
  return new Promise(async (resolve, reject) => {
    let data = {
      nftId: nftItem.nftId,
      status: Number(nftItem.isLike) === 1 ? 0 : 1,
    };
    sendRequest({
      url: `${NEW_BASE_URL}/nfts/like`,
      method: 'POST',
      data,
    })
      .then(response => {
        if (response.generatedMaps.length > 0 || response.affected) {
          getNftItem.isLike = data.status;
          getNftItem.totalLike = data.status
            ? Number(getNftItem.totalLike) + 1
            : Number(getNftItem.totalLike) - 1;
          resolve(getNftItem);
        } else {
          reject(nftItem);
        }
      })
      .catch(err => {
        reject(nftItem);
      });
  });
};

function discoverItem({item}) {
  console.log('@@@ Discover Item =======>');
  const navigation = useNavigation();

  const [nftItem, setNftItem] = useState(item);

  let creatorImage = nftItem?.creator?.avatar ? nftItem.creator.avatar : null;
  let ownerImage = nftItem?.owner?.avatar ? nftItem.owner.avatar : null;

  let creatorName = nftItem?.creator?.name
    ? nftItem.creator.name
    : nftItem?.creator?.address?.includes('0x')
    ? nftItem.creator.address.substring(0, 6)
    : '---';

  let ownerName = nftItem?.owner?.name
    ? nftItem.owner.name
    : nftItem?.owner?.address?.includes('0x')
    ? nftItem.owner.address.substring(0, 6)
    : '---';

  const avatarpress = v => {
    if (v === 'owner') {
      if (nftItem?.owner?.address)
        navigation.push('Profile', {id: nftItem?.owner?.address});
    } else {
      if (nftItem?.creator?.address)
        navigation.push('Profile', {id: nftItem?.creator?.address});
    }
  };

  const handleLikeMethod = async () => {
    const nftData = await handleLike(nftItem);
    if (nftData) {
      setNftItem(nftData);
    }
  };

  return (
    <Box>
      <HStack py={2} w="90%" alignSelf="center">
        <Flex flex={1}>
          <Pressable
            onPress={() => avatarpress('creator')}
            _pressed={{opacity: 60}}>
            <HStack>
              <C_Image
                imageType={'profile'}
                uri={creatorImage}
                size={ImagekitType.AVATAR}
                imageStyle={styles.avatar}
                style={styles.avatarView}
              />
              <Box px="3">
                <Text
                  color="black"
                  fontFamily={fonts.SegoeUIRegular}
                  fontSize="11">
                  {translate('common.creator')}
                </Text>
                <Text
                  color="black"
                  fontFamily={fonts.ARIAL}
                  fontSize="11"
                  fontWeight="bold">
                  {creatorName}
                </Text>
              </Box>
            </HStack>
          </Pressable>
        </Flex>
        <Flex flex={1}>
          <Pressable
            onPress={() => avatarpress('owner')}
            _pressed={{opacity: 60}}>
            <HStack>
              <C_Image
                imageType={'profile'}
                uri={ownerImage}
                size={ImagekitType.AVATAR}
                imageStyle={styles.avatar}
                style={styles.avatarView}
              />
              <Box px="3">
                <Text
                  color="black"
                  fontFamily={fonts.SegoeUIRegular}
                  fontSize="11">
                  {translate('common.owner')}
                </Text>
                <Text
                  color="black"
                  fontFamily={fonts.ARIAL}
                  fontSize="11"
                  fontWeight="bold">
                  {ownerName}
                </Text>
              </Box>
            </HStack>
          </Pressable>
        </Flex>
      </HStack>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate('CertificateDetail', {
            networkName: item?.network?.networkName,
            collectionAddress: item?.collection?.address,
            nftTokenId: item?.tokenId,
            setNftItem,
          });
        }}>
        <C_Image
          uri={nftItem.mediaUrl}
          size={ImagekitType.FULLIMAGE}
          category={nftItem.category}
          imageStyle={styles.modalImage}
        />
      </TouchableOpacity>
      <Box px={4} py={3}>
        <HStack justifyContent="space-between">
          <TouchableOpacity onPress={handleLikeMethod}>
            {Number(nftItem?.isLike) ? <HeartActiveIcon /> : <HeartWhiteIcon />}
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Menu
              onSelect={value => {
                modalAlert(
                  translate('common.Confirm'),
                  value === 1
                    ? translate('common.nftReported')
                    : translate('common.userBlocked'),
                );
              }}>
              <MenuTrigger children={<ThreeDotsVerticalIcon />} />
              <MenuOptions>
                <MenuOption value={1}>
                  <Text style={{marginVertical: 10}}>
                    {translate('common.reportNft')}
                  </Text>
                </MenuOption>
                <MenuOption value={2}>
                  <Text style={{marginVertical: 10}}>
                    {translate('common.blockUser')}
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </HStack>
        <Text
          mt={2}
          fontFamily={fonts.ARIAL_BOLD}
          color="black"
          fontWeight="bold"
          fontSize={'12'}>
          {`${numberWithCommas(nftItem.totalLike)} ${translate(
            'common.Likes',
          )}`}
        </Text>
        <Text
          mt={2}
          fontFamily={fonts.ARIAL_BOLD}
          color="black"
          fontWeight="bold"
          fontSize={'lg'}>
          {nftItem.name}
        </Text>
      </Box>
    </Box>
  );
}

export default React.memo(discoverItem);
