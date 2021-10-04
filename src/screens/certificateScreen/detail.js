import React, { useRef, useState } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Image,
    Text,
    ScrollView,
    TextInput,
    Switch
} from 'react-native';
import styles from './styles';
import { images, colors } from '../../res';

import getLanguage from '../../utils/languageSupport';
import { C_Image, GroupButton } from '../../components';
import {
    SVGS,
    SIZE,
    IMAGES
} from 'src/constants';
import Video from 'react-native-fast-video';

const {
    PlayButtonIcon
} = SVGS;

const langObj = getLanguage();

const DetailScreen = ({ navigation, route }) => {

    const refVideo = useRef(null);
    const [isPlay, setPlay] = useState(false);
    const {
        name,
        description,
        owner,
        ownerImage,
        creator,
        creatorImage,
        thumbnailUrl,
        video,
        fileType,
        price
    } = route.params;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerText}>
                    {'Detail'}
                </Text>
            </View>
            <ScrollView>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setPlay(!isPlay)}>
                    {
                        fileType !== 'mp4' ?
                            <C_Image uri={thumbnailUrl} imageStyle={styles.modalImage} />
                            :
                            <View style={styles.modalImage}>
                                <C_Image uri={thumbnailUrl} imageStyle={styles.modalImage} />
                                <Video
                                    ref={refVideo}
                                    source={{ uri: video }}
                                    repeat
                                    playInBackground={false}
                                    paused={!isPlay}
                                    resizeMode={'cover'}
                                    onLoad={() => refVideo.current.seek(0)}
                                    style={{
                                        flex: 1,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                    }} />
                                {
                                    !isPlay &&
                                    <View style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <View style={{
                                            width: SIZE(100),
                                            height: SIZE(100),
                                            backgroundColor: '#00000030',
                                            borderRadius: SIZE(100),
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
                                        </View>
                                    </View>
                                }
                            </View>
                    }
                </TouchableOpacity>
                <Text style={styles.nftName}>
                    {name}
                </Text>
                <View style={styles.person}>
                    <View style={styles.personType}>
                        <Image style={styles.iconsImage} source={!ownerImage ? IMAGES.DEFAULTPROFILE : { uri: ownerImage }} />
                        <View>
                            <Text style={styles.personTypeText}>
                                {'Owner'}
                            </Text>
                            <Text numberOfLines={1} style={styles.personName}>
                                {owner}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.personType}>
                        <Image style={styles.iconsImage} source={!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }} />
                        <View>
                            <Text style={styles.personTypeText}>
                                {'Creator'}
                            </Text>
                            <Text numberOfLines={1} style={styles.personName}>
                                {creator}
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.description}>
                    {description}
                </Text>
                {/* <View style={styles.moreView}>
                    <Text style={styles.moreTitle}>
                        {'More from this creator'}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        <View style={styles.moreItem}>
                            <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <View style={styles.moreItem}>
                            <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <View style={styles.moreItem}>
                            <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                        </View>
                        <View style={styles.moreItem}>
                            <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                        </View>
                    </View>
                </View> */}
                <View style={styles.bottomView}>
                    <Text style={styles.count}>
                        {'# 1 / 1'}
                    </Text>
                    <View style={styles.row}>
                        <Text style={styles.priceUnit}>
                            {'￥'}
                        </Text>
                        <Text style={styles.price}>
                            {price ? price : 0}
                        </Text>
                    </View>
                    <GroupButton
                        leftText={'Buy'}
                        rightText={'Offer Other price'}
                        onLeftPress={() => navigation.navigate('WalletConnect')}
                        onRightPress={() => navigation.navigate('MakeBid')}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DetailScreen;
