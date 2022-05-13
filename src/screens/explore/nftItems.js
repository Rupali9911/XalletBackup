import React, { useState, useRef, useCallback } from "react";
import { Avatar, Box, Divider, Flex, HStack, Image, Pressable, Text } from "native-base";
import { IMAGES, SIZE, SVGS } from "../../constants";
import { translate } from "../../walletUtils";
import { colors, fonts } from '../../res';
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import { TouchableOpacity, View, Dimensions, Text as RNText } from "react-native";
import { C_Image } from "../../components";
import Video from "react-native-fast-video";
import { styles } from "./styled";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { alertWithSingleBtn, numberWithCommas } from "../../utils";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../common/constants";
import { useSelector } from "react-redux";
import { networkType } from "../../common/networkType";

const { width } = Dimensions.get('window');

const {
    PlayButtonIcon,
    HeartIcon,
    ThreeDotsVerticalIcon,
    HeartActiveIcon,
} = SVGS;

const AvatarImage = ({ creatorImageStatus }) => {
    return (
        <Box>
            {
                creatorImageStatus ?
                    <Avatar
                        alignSelf="center"
                        size="8"
                        source={{ uri: creatorImageStatus }} />
                    :
                    <Image
                        size="8"
                        rounded="full"
                        source={IMAGES.DEFAULTPROFILE}
                        alt="Profile Picture"
                    />
            }
        </Box>
    )
}

const Label = ({ label }) => {
    return (
        <Text color="black" fontFamily={fonts.SegoeUIRegular} fontSize="11" >{label}</Text>
    )
}

const Name = ({ label }) => {
    return (
        <Text color="black" fontFamily={fonts.ARIAL} fontSize="11" fontWeight="bold" >{label}</Text>
    )
}

export const handleLike = (wallet, data, nftItem) => {
    let getNftItem = { ...nftItem };
    var url1 = '';
    var url2 = `${BASE_URL}/xanalia/updateRating`;
    let like_body = {
        networkType: networkType,
        owner: wallet.address || data.user._id,
        tokenId: getNftItem.tokenId,
    };

    let rating_body = {
        networkType: networkType,
        tokenId: getNftItem.tokenId,
    };
    if (!getNftItem.like) {
        url1 = `${BASE_URL}/xanalia/likeNFT`;
        rating_body.rating = getNftItem.rating + 1;
        getNftItem.like = 1;
        getNftItem.rating = getNftItem.rating + 1;
    } else {
        url1 = `${BASE_URL}/xanalia/unlikeNFT`;
        rating_body.rating = getNftItem.rating - 1;
        getNftItem.like = 0;
        getNftItem.rating = getNftItem.rating - 1;
    }
    let fetch_like_body = {
        method: 'POST',
        body: JSON.stringify(like_body),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };
    let fetch_rating_body = {
        method: 'POST',
        body: JSON.stringify(rating_body),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };
   return Promise.all([
        fetch(url1, fetch_like_body).then(res => res.json()),
        fetch(url2, fetch_rating_body).then(res => res.json()),
    ])
        .then(([v, a]) => {
            console.log(v, "testing")
            if (v.success) {
                return getNftItem;
            } else {
                return false
            }
        })
        .catch(err => {
            return false
        });
}

function NftItem({
    item
}) {
    const { wallet, data } = useSelector(state => state.UserReducer);
    const navigation = useNavigation();
    const [isPlay, setPlay] = useState(false);
    const refVideo = useRef(null);
    const refVideoPlay = useRef(null);
    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);
    const [nftItem, setNftItem] = useState(item);

    const onTextLayout = useCallback(e => {
        if (
            e.nativeEvent.lines.length >= 2 
            // &&
            // e.nativeEvent.lines[1].width > width - SIZE(40)
        )
            setLengthMore(true);
    }, []);

    const creatorObj = nftItem.creatorObj[0];
    const ownerObj = nftItem.buyerObj[0];

    let creatorImageStatus;
    let creatorName;
    if (creatorObj) {
        creatorImageStatus = creatorObj.hasOwnProperty("profile_image");
        creatorName = (creatorObj.hasOwnProperty("title") && creatorObj.title) ? creatorObj.title :
            creatorObj.username.substring(0, 10);
    } else {
        creatorImageStatus = false
        creatorName = "---"
    }

    let ownerImageStatus;
    let ownerName;
    if (ownerObj) {
        ownerImageStatus = ownerObj.hasOwnProperty("profile_image");
        ownerName = (ownerObj.hasOwnProperty("title") && ownerObj.title) ? ownerObj.title :
            ownerObj.username.substring(0, 10);
    } else {
        ownerImageStatus = false
        ownerName = "---"
    }

    const avatarpress = (v) => {
        if (v === "owner") {
            if (nftItem.buyerUser) navigation.push('ArtistDetail', { id: nftItem.buyerUser });
        } else {
            if (nftItem.creator) navigation.push('ArtistDetail', { id: nftItem.creator });
        }
    }

    const handleLikeMethod = async () => {
        const handleLikeM = await handleLike(wallet, data, nftItem);
        if (handleLikeM) {
            setNftItem(handleLikeM)
        }
    }

    // console.log(nftItem, nftItem.metaData.name)
    // it's temporary fix
    const videoUri = nftItem ? nftItem?.metaData?.image?.replace('nftdata', 'nftData') : nftItem?.thumbnailUrl;
    const imageUri = nftItem?.thumbnailUrl;

    const image = nftItem.metaData.image || nftItem.thumbnailUrl;
    const fileType = image ? image?.split('.')[image?.split('.').length - 1] : '';

    return (
        <Box>
            <HStack py={2} w="90%" alignSelf="center" >
                <Flex flex={1} >
                    <Pressable onPress={() => avatarpress("creator")} _pressed={{ opacity: 60 }} >
                        <HStack>
                            <AvatarImage creatorImageStatus={creatorImageStatus ? creatorObj.profile_image : false} />
                            <Box px="3" >
                                <Label label={translate('common.creator')} />
                                <Name label={creatorName} />
                            </Box>
                        </HStack>
                    </Pressable>
                </Flex>
                <Flex flex={1}>
                    <Pressable onPress={() => avatarpress("owner")} _pressed={{ opacity: 60 }} >
                        <HStack >
                            <AvatarImage creatorImageStatus={ownerImageStatus ? ownerObj.profile_image : false} />
                            <Box px="3">
                                <Label label={translate('common.owner')} />
                                <Name label={ownerName} />
                            </Box>
                        </HStack>
                    </Pressable>
                </Flex>
            </HStack>
            <InViewPort onChange={(isVisible) => {
                if (!isVisible) {
                    setPlay(false);
                }
            }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        isPlay
                            ? setPlay(!isPlay)
                            : navigation.navigate('CertificateDetail', {
                                owner: nftItem.buyerUser,
                                ownerData: ownerObj,
                                artistId: nftItem.creator,
                                collectCreat: nftItem.collectionObj[0],
                                artistData: creatorObj,
                                video: videoUri,
                                fileType: fileType,
                                item: item,
                                setNftItem
                            })
                    }}>
                    {fileType === 'mp4' ||
                        fileType === 'MP4' ||
                        fileType === 'mov' ||
                        fileType === 'MOV' ? (
                        <View style={styles.modalImage}>
                            <Video
                                ref={refVideo}
                                source={{ uri: videoUri }}
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
                                <View
                                    style={styles.playBtnCont}>
                                    <View
                                        style={styles.playBtnChild}>
                                        <TouchableOpacity onPress={() => {
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
                        <C_Image uri={imageUri} imageStyle={styles.modalImage} />
                    )}
                </TouchableOpacity>
            </InViewPort>

            <Box px={4} py={3} >
                <HStack justifyContent="space-between" >
                    <TouchableOpacity
                        onPress={handleLikeMethod}>
                        {nftItem.like ? <HeartActiveIcon /> : <HeartIcon />}
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Menu onSelect={value => {
                            alertWithSingleBtn(
                                translate('common.Confirm'),
                                value === 1 ? translate('common.nftReported') : translate('common.userBlocked'))
                        }}>
                            <MenuTrigger children={<ThreeDotsVerticalIcon />} />
                            <MenuOptions>
                                <MenuOption value={1}>
                                    <Text style={{ marginVertical: 10 }}>{translate('common.reportNft')}</Text>
                                </MenuOption>
                                <MenuOption value={2}>
                                    <Text style={{ marginVertical: 10 }}>{translate('common.blockUser')}</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </HStack>
                <Text mt={2} fontFamily={fonts.ARIAL_BOLD} color="black" fontWeight="bold" fontSize={"12"} >{`${numberWithCommas(nftItem.rating)} ${translate('common.Likes')}`}</Text>
                <Text mt={2} fontFamily={fonts.ARIAL_BOLD} color="black" fontWeight="bold" fontSize={"lg"} >{nftItem.metaData.name}</Text>
                {!!nftItem?.metaData && !!nftItem?.metaData.description && <View>
                    <RNText onTextLayout={onTextLayout} numberOfLines={textShown ? null : 2} style={styles.description}>
                        {/* {nftItem.metaData.description} */}
                        {textShown ? nftItem.metaData.description : nftItem.metaData.description?.replaceAll('\n', '')}
                    </RNText>
                    {lengthMore && textShown && (
                        <TouchableOpacity activeOpacity={1} style={styles.readLessWrap} onPress={() => setTextShown(false)}>
                            <Text style={styles.readMore}>{translate('common.Readless')}</Text>
                        </TouchableOpacity>
                    )}
                    {lengthMore && !textShown && (
                        <TouchableOpacity activeOpacity={1} style={styles.readMoreWrap} onPress={() => setTextShown(true)}>
                            <RNText style={styles.threeDot}>{'...'}</RNText>
                            <RNText style={styles.readMore}>{translate('common.Readmore')}</RNText>
                        </TouchableOpacity>
                    )}
                </View>}
            </Box>
        </Box>
    );
}

export default NftItem;
