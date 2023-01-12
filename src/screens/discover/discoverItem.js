import React, {useRef, useState} from 'react';
import {Box, Flex, HStack, Pressable, Text} from 'native-base';
import InViewPort from '@coffeebeanslabs/react-native-inviewport';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, View} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Video from 'react-native-video';
import {C_Image} from '../../components';
import {SIZE, SVGS} from '../../constants';
import {fonts} from '../../res';
import {translate} from '../../walletUtils';
import {NEW_BASE_URL} from '../../common/constants';
import {ImagekitType} from '../../common/ImageConstant';
import sendRequest from '../../helpers/AxiosApiRequest';
import {alertWithSingleBtn, numberWithCommas} from '../../utils';
import {styles} from './styled';

const {PlayButtonIcon, ThreeDotsVerticalIcon, HeartWhiteIcon, HeartActiveIcon} =
  SVGS;

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
  const navigation = useNavigation();
  const refVideo = useRef(null);
  const refVideoPlay = useRef(null);

  const [isPlay, setPlay] = useState(false);
  const [nftItem, setNftItem] = useState(item);

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

  const fileType = nftItem?.mediaUrl
    ? nftItem.mediaUrl?.split('.')[nftItem.mediaUrl?.split('.').length - 1]
    : '';

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
                source={{uri: nftItem.mediaUrl}}
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
              uri={nftItem.mediaUrl}
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
