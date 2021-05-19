import * as React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "react-native-config";
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal';

import styles from './styles';
import { images, colors } from '../../res';
import { Loader } from '../../components';

const DetailItemScreen = ({ route, navigation }) => {

    const [isLoading, setLoading] = React.useState(false);
    const [refresh, set_refresh] = React.useState(false);
    const [page_Count, setPageCount] = React.useState(0);
    const [listLoading, setListLoading] = React.useState(false);

    const [owner_Id, setOwnerId] = React.useState("")
    const [nftPropList, setNftPropList] = React.useState([]);

    const [isOffline, setOfflineStatus] = React.useState(false);

    React.useEffect(async () => {
        setLoading(true)
        const { pageCount, nftList } = route.params;
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });
        const ownerId = await AsyncStorage.getItem("account_id@")
        if (ownerId !== null) {
            let owner_Id_parse = JSON.parse(ownerId)
            setOwnerId(owner_Id_parse.account)
        }
        setNftPropList(nftList)
        setPageCount(pageCount)
        setLoading(false)
        return () => removeNetInfoSubscription();
    }, [])

    const getNFTlist = React.useCallback((page) => {

        setListLoading(true)
        let body_data = {
            type: "2d",
            page,
            limit: 20,
            networkType: "mainnet",
            owner: owner_Id,
        }

        let fetch_data_body = {
            method: 'POST',
            body: JSON.stringify(body_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`${Config.BASE_URL}/getDemuxData`, fetch_data_body)
            .then(response => response.json())  // promise
            .then(json => {
                let new_list = [...json.data];
                setNftPropList(old_list => {
                    let array = [...old_list, ...new_list];
                    let jsonObject = array.map(JSON.stringify);
                    let uniqueSet = new Set(jsonObject);
                    let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                    return uniqueArray;
                })
                set_refresh(!refresh)
                isOffline && setOfflineStatus(false);
                setLoading(false)
                setListLoading(false)
            }).catch(err => {
                setLoading(false)
                alert(err.message)
            })
    }, [isOffline]);

    const handleLikeDislike = (item, index) => {
        var url1 = "";
        var url2 = `${Config.BASE_URL}/updateRating`;
        let like_body = {
            networkType: "mainnet",
            owner: owner_Id,
            tokenId: item.tokenId
        }
        let rating_body = {
            networkType: "mainnet",
            tokenId: item.tokenId
        }
        if (item.like == 0) {
            url1 = `${Config.BASE_URL}/likeNFT`;
            rating_body.rating = item.rating + 1;
            item.like = 1;
            item.rating = item.rating + 1;
        } else {
            url1 = `${Config.BASE_URL}/unlikeNFT`
            rating_body.rating = item.rating - 1
            item.like = 0;
            item.rating = item.rating - 1;
        }

        let fetch_like_body = {
            method: 'POST',
            body: JSON.stringify(like_body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        let fetch_rating_body = {
            method: 'POST',
            body: JSON.stringify(rating_body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        Promise.all([
            fetch(url1, fetch_like_body).then(res => res.json()),
            fetch(url2, fetch_rating_body).then(res => res.json())
        ]).then(([urlOneData, urlTwoData]) => {
            let nftList = [...nftPropList];
            nftList[index] = item;
            setNftPropList(nftList);
        })
    }

    const Button = ({ children, ...props }) => (
        <TouchableOpacity style={styles.button} {...props}>
            <Text style={styles.buttonText}>{children}</Text>
        </TouchableOpacity>
    );

    const NoInternetModal = ({ show, onRetry, isRetrying }) => (
        <Modal isVisible={show} style={styles.modal} animationInTiming={600}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Connection Error</Text>
                <Text style={styles.modalText}>
                    Oops! Looks like your device is not connected to the Internet.
            </Text>
                <Button onPress={onRetry} disabled={isRetrying}>
                    Try Again
            </Button>
            </View>
        </Modal>
    );

    console.log(nftPropList, '///////')

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <View style={styles.modalCont} >
                <View style={styles.header} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon} >
                        <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                {
                    isLoading ?
                        <Loader /> :
                        <FlatList
                            data={nftPropList}
                            horizontal={false}
                            numColumns={3}
                            extraData={refresh}
                            renderItem={({ item }) => {
                                let findIndex = nftPropList.findIndex(x => x.id === item.id);
                                if (item.metaData) {
                                    // console.log(item)
                                    return (
                                        <View>
                                            <View style={styles.bgImageCont} >
                                                <Image source={{ uri: item.metaData.image }} style={styles.bgImage} />
                                                <View style={[styles.bgImageCont, { backgroundColor: colors.black_opacity(0.8) }]} />
                                            </View>
                                            <Image source={{ uri: item.metaData.image }} style={styles.modalImage} />

                                            <View style={styles.bottomModal} >
                                                <View style={styles.modalLabelCont} >
                                                    <Text style={styles.modalLabel} >{item.metaData.name}</Text>
                                                    {
                                                        owner_Id ?
                                                            <TouchableOpacity onPress={() => handleLikeDislike(item, findIndex)} >
                                                                <Image style={styles.heartIcon} source={item.like == 1 ? images.icons.heartA : images.icons.heart} />
                                                            </TouchableOpacity> : null
                                                    }
                                                </View>

                                                <View style={styles.modalSectCont} >
                                                    <View style={{ flex: 1 }} >
                                                        <Text style={styles.modalIconLabel} >Current price</Text>
                                                        <View style={styles.iconCont} >
                                                            <Image style={styles.iconsImage} source={images.icons.pIcon} />
                                                            <Text style={styles.iconLabel} >25</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 0.8 }} >
                                                        <Text style={styles.modalIconLabel} >Last price</Text>
                                                        <View style={styles.iconCont} >
                                                            <Image style={styles.iconsImage} source={images.icons.pIcon} />
                                                            <Text style={styles.iconLabel} >25</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.separator} />
                                                <View style={styles.modalSectCont} >
                                                    <View style={{ flex: 1 }} >
                                                        <Text style={styles.modalIconLabel} >Owner</Text>
                                                        <View style={styles.iconCont} >
                                                            <Image style={styles.profileIcon} source={images.icons.profileIcon} />
                                                            <Text style={[styles.iconLabel, { fontWeight: "400" }]} >Queen</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 0.8 }} >
                                                        <Text style={styles.modalIconLabel} >Artist</Text>
                                                        <View style={styles.iconCont} >
                                                            <Image style={styles.profileIcon} source={images.icons.profileIcon} />
                                                            <Text style={[styles.iconLabel, { fontWeight: "400" }]} >Queen</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.separator} />
                                                <Text style={styles.description} >{item.metaData.description}</Text>
                                                <TouchableOpacity>
                                                    <LinearGradient colors={[colors.themeL, colors.themeR]} style={styles.modalBtn}>
                                                        <Text style={[styles.modalLabel, { color: colors.white }]} >Buy</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }
                            }}
                            onEndReached={async () => {
                                setPageCount(num => {
                                    getNFTlist(num + 1)
                                    return num + 1
                                })
                            }}
                            renderFooter={() => {
                                return listLoading ? <View style={styles.sorryMessageCont} >
                                    <ActivityIndicator size="small" color={colors.themeL} />
                                </View> : null
                            }}
                            onEndReachedThreshold={1}
                            keyExtractor={(v, i) => "item_" + i}
                        />
                }
                <NoInternetModal
                    show={isOffline}
                    onRetry={getNFTlist}
                    isRetrying={isLoading}
                />
            </View>
        </SafeAreaView >
    )
}

export default DetailItemScreen;
