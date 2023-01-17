import React, {useState, useRef, useCallback} from 'react';
import {
  Avatar,
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Pressable,
  Text,
} from 'native-base';
import {IMAGES, NFT_TYPE_TO_ID, SIZE, SVGS} from '../../constants';
import {translate} from '../../walletUtils';
import {colors, fonts} from '../../res';
import InViewPort from '@coffeebeanslabs/react-native-inviewport';
import {TouchableOpacity, View, Dimensions, Text as RNText} from 'react-native';
import {C_Image} from '../../components';
//import Video from 'react-native-fast-video';
import Video from 'react-native-video';
import {styles} from './styled';
import {numberWithCommas} from '../../utils';
import { modalAlert } from '../../common/function';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL, NEW_BASE_URL} from '../../common/constants';
import {useSelector} from 'react-redux';
import {networkType} from '../../common/networkType';
import sendRequest, {getAccessToken} from '../../helpers/AxiosApiRequest';
import {ImagekitType} from '../../common/ImageConstant';
import PopupMenu from '../../components/PopupMenu/PopupMenu';
import CommonStyles from '../../constants/styles';

const {width} = Dimensions.get('window');

const {PlayButtonIcon, ThreeDotsVerticalIcon, HeartWhiteIcon, HeartActiveIcon} =
  SVGS;

// const AvatarImage = ({imageSource}) => {
//   return (
//     <Box>
//       {imageSource ? (
//         <Avatar alignSelf="center" size="8" source={{uri: imageSource}} />
//       ) : (
//         <Image
//           size="8"
//           rounded="full"
//           source={IMAGES.DEFAULTUSER}
//           alt="Profile Picture"
//         />
//       )}
//     </Box>
//   );
// };

const Label = ({label}) => {
  return (
    <Text color="black" fontFamily={fonts.SegoeUIRegular} fontSize="11">
      {label}
    </Text>
  );
};

const Name = ({label}) => {
  return (
    <Text
      color="black"
      fontFamily={fonts.ARIAL}
      fontSize="11"
      fontWeight="bold">
      {label}
    </Text>
  );
};

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
  const {wallet, userData} = useSelector(state => state.UserReducer);
  const navigation = useNavigation();
  const [isPlay, setPlay] = useState(false);
  const refVideo = useRef(null);
  const refVideoPlay = useRef(null);
  const [nftItem, setNftItem] = useState(item);

  const creatorObj = Array.isArray(nftItem?.creatorObj)
    ? nftItem.creatorObj[0]
    : nftItem?.creatorObj;
  const ownerObj = Array.isArray(nftItem?.buyerObj)
    ? nftItem.buyerObj[0]
    : nftItem?.buyerObj;

  let creatorImage = nftItem?.creator?.avatar ? nftItem.creator.avatar : null;
  let creatorName = nftItem?.creator?.name
    ? nftItem.creator.name
    : nftItem?.creator?.address?.includes('0x')
    ? nftItem.creator.address.substring(0, 6)
    : '---';
  let ownerImage = nftItem?.owner?.avatar ? nftItem.owner.avatar : null;
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

  const videoUri = nftItem.mediaUrl;
  const imageUri = nftItem.mediaUrl;

  const image = nftItem.mediaUrl;
  const fileType = image ? image?.split('.')[image?.split('.').length - 1] : '';

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
                <Label label={translate('common.creator')} />
                <Name label={creatorName} />
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
                <Label label={translate('common.owner')} />
                <Name label={ownerName} />
              </Box>
            </HStack>
          </Pressable>
        </Flex>
      </HStack>
      <InViewPort
        onChange={isVisible => {
          if (!isVisible) {
            setPlay(false);
          }
        }}
        disabled={true}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            isPlay
              ? setPlay(!isPlay)
              : navigation.navigate('CertificateDetail', {
                  networkName: item?.network?.networkName,
                  collectionAddress: item?.collection?.address,
                  nftTokenId: item?.tokenId,
                  setNftItem,
                });
          }}>
          {fileType === 'mp4' ||
          fileType === 'MP4' ||
          fileType === 'mov' ||
          fileType === 'MOV' ? (
            <View style={styles.modalImage}>
              <Video
                ref={refVideo}
                source={{uri: videoUri}}
                playInBackground={false}
                paused={!isPlay}
                resizeMode={'cover'}
                onLoad={() => refVideo.current.seek(0)}
                onEnd={() => {
                  setPlay(false);
                  refVideoPlay.current = true;
                }}
                style={styles.videoContainer}
              />
              {!isPlay && (
                <View style={styles.playBtnCont}>
                  <View style={styles.playBtnChild}>
                    <TouchableOpacity
                      onPress={() => {
                        if (refVideoPlay.current) {
                          refVideo.current.seek(0);
                        }
                        refVideoPlay.current = false;
                        setPlay(true);
                      }}>
                      <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <C_Image
              uri={imageUri}
              size={ImagekitType.FULLIMAGE}
              category={nftItem.category}
              imageStyle={styles.modalImage}
            />
          )}
        </TouchableOpacity>
      </InViewPort>

      <Box px={4} py={3}>
        <HStack justifyContent="space-between">
          <TouchableOpacity onPress={handleLikeMethod}>
            {Number(nftItem?.isLike) ? <HeartActiveIcon /> : <HeartWhiteIcon />}
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <PopupMenu
              items={[
                {label: `${translate('common.reportNft')}`},
                {label: `${translate('common.blockUser')}`},
              ]}
              textStyle={{...CommonStyles.titleStyle}}
              onSelect={value => {
                modalAlert(
                  translate('common.Confirm'),
                  value === 1
                    ? translate('common.userBlocked')
                    : translate('common.nftReported'),
                );
              }}
              children={<ThreeDotsVerticalIcon />}
            />
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

export default discoverItem;
