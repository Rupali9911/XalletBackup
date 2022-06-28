import React, { useEffect, useState } from 'react';
import {TouchableOpacity, View, Text, Image, Platform, FlatList} from 'react-native';
import { C_Image } from '../../components';
import styles from './styles';
import { SIZE, SVGS } from 'src/constants';
import { translate } from '../../walletUtils';
import {launchpadData} from "./launchpadData";
import FixedTouchableHighlight from '../../components/FixedTouchableHighlight'
import { Verifiedcollections } from '../../components/verifiedCollection';
import { IMAGES } from '../../constants';
const { PolygonIcon, Ethereum, BitmapIcon } = SVGS;

export default function LaunchPadItemData(props) {
    const {
        bannerImage,
        chainType,
        items,
        iconImage,
        collectionName,
        creatorInfo,
        status,
        onPress,
        creator,
        blind,
        isCollection,
        cryptoAllowed,
        disabled,
        collectionId
    } = props;
    const [onPressButton, setOnPressButton] = useState(false)
    const chainIcon = type => {
        if (type === 'polygon') {
            return <PolygonIcon />;
        }
        if (type === 'ethereum') {
            return <Ethereum />;
        }
        if (type === 'binance') {
            return <BitmapIcon />;
        }
    };

    const getByUser = () => {
        // if (creator) return creator;
        // if (creatorInfo[0].title) return creatorInfo[0].title;
        // if (creatorInfo[0].role === ‘crypto’) {
        //   return creatorInfo[0].username.slice(0, 6);
        // } else {
        //   return creatorInfo[0].username;
        // }
        let creatorName = creatorInfo && typeof creatorInfo[0] === 'object' ?
            creatorInfo[0]?.role === 'crypto' ?
                creatorInfo[0]?.title?.trim() ? creatorInfo[0].title :
                    creatorInfo[0]?.name?.trim() ? creatorInfo[0].name :
                        creatorInfo[0]?.username?.trim() ? creatorInfo[0].username : creator ? creator : ""
                : creatorInfo[0]?.username?.trim() ? creatorInfo[0].username :
                    creatorInfo[0]?.name?.trim() ? creatorInfo[0].name :
                        creatorInfo[0]?.title?.trim() ? creatorInfo[0].title : creator ? creator : ""
            : creator ? creator : ""
        return creatorName;
    }
    // console.log("🚀 ~ file: index.js ~ line 34 ~ getByUser ~ creatorInfo", creatorInfo, getByUser())

    let uriType = bannerImage?.split('.')[bannerImage?.split('.').length - 1];
    const checkVideoUrl =
        uriType === 'mp4' ||
        uriType === 'MP4' ||
        uriType === 'mov' ||
        uriType === 'MOV';

    const chainTypeIcon = type => {
        return (
            <FlatList
                data={type}
                horizontal={true}
                contentContainerStyle={styles.chaintypeflatlist}
                keyExtractor={(item) => item.id}
                renderItem={({item, index}) => {

                    if (item.type === 'polygon') {
                        return <PolygonIcon style={{marginHorizontal:5}} />;
                    }
                    if (item.type === 'ethereum') {
                        return <Ethereum style={{marginHorizontal:5}}/>;
                    }
                    if (item.type === 'binance') {
                        return <BitmapIcon style={{marginHorizontal:5}} />;
                    }
                }}

            />
        )
    };

    const renderChain = () => {
        if (blind) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'center',marginBottom: SIZE(10) }}>
                    <BitmapIcon style={{ marginRight: SIZE(8) }} />
                    <PolygonIcon style={{ marginRight: SIZE(8) }} />
                    <Ethereum />
                </View>
            );
        } else
            if (isCollection) {
                return (
                    <View style={{ flexDirection: 'row', justifyContent: 'center',marginBottom: SIZE(10) }}>
                        {cryptoAllowed?.binance && <BitmapIcon style={{ marginRight: SIZE(10) }} />}
                        {cryptoAllowed?.polygon && <PolygonIcon style={{ marginRight: SIZE(8) }} />}
                        {cryptoAllowed?.ethereum && <Ethereum />}
                    </View>
                );
            } else {
                //return chainIcon(chainType);
                return chainTypeIcon(chainType)
            }
    };
    useEffect(()=>{
        if(onPressButton){
            onPress();
            setTimeout(()=>{
                setOnPressButton(false);
            },1000)
        }
    },[onPressButton])

    const handleOnPress = () => {
        setOnPressButton(true);
    }
    return (

        <FixedTouchableHighlight
            disabled={disabled}
            onPress={handleOnPress}
            style={styles.collectionListItem}>
            <View style={styles.listItemContainer}>
                <View>
                    <C_Image
                        type={uriType}
                        uri={bannerImage}
                        imageStyle={
                            Platform.OS === 'ios'
                                ? checkVideoUrl
                                    ? styles.collectionListVideo
                                    : styles.collectionListImage
                                : styles.collectionListImage
                        }
                    />
                </View>
                <View style={styles.collectionWrapper}>
                    <C_Image
                        type={bannerImage?.split('.')[bannerImage?.split('.').length - 1]}
                        uri={iconImage}
                        imageStyle={styles.iconImage}
                    />
                    {Verifiedcollections.find((id) => id === collectionId) && (
                        <Image
                            style={styles.verifyIcon}
                            source={IMAGES.tweetPng}
                        />
                    )}
                    <View style={styles.bottomCenterWrap}>
                        <Text numberOfLines={1} style={styles.collectionName}>
                            {collectionName}
                        </Text>
                        {!isCollection && (
                            <Text style={styles.byUser}>{`by ${getByUser()}`}</Text>
                        )}
                    </View>
                    <View style={styles.bottomWrap}>
                        {/* {!isCollection ? renderChain() : <View />} */}
                        <View style={styles.renderchainstyle}>
                            {renderChain()}
                        </View>
                        <Text style={{ fontSize: SIZE(12), color: '#ff6e44',marginVertical:"3%" }}>
                            {/*{`${items} ` + translate('common.itemsCollection')}*/}
                            {status == 'Ongoing' ? translate('common.ongoinglaunch') : ''}
                            <Text style={{ marginRight: 50 }}>
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
        </FixedTouchableHighlight>
    );
}
