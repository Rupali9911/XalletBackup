import moment from 'moment';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { createThumbnail } from "react-native-create-thumbnail";
//import Video from 'react-native-fast-video';
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { colors } from '../../res';

import { heightPercentageToDP as hp } from '../../common/responsiveFunction';
import { IMAGES } from '../../constants';
import { fonts } from '../../res';
import { CardButton, CardCont, CardField, CardLabel } from './components';
import styles from './styles';

import axios from 'axios';
import { NEW_BASE_URL } from '../../common/constants';
import sendRequest from '../../helpers/AxiosApiRequest';

import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';
import { nftMakingMethods, setApprovalForAll } from '../wallet/functions';
import { getUploadData, putNFTMedia } from '../../utils/uploadMediaS3';
import TransactionPending from "../../components/Popup/transactionPending"
import { sendCustomTransaction } from '../wallet/functions/transactionFunctions';
import SOCKET_EVENTS from '../../constants/socketContants';
import { useSocketGlobal } from '../../helpers/useSocketGlobal';
import { socket } from '../../helpers/socket'
import { PriceUnits, NFT_TYPE_TO_ID, ImageType, royalityData, supportMediaType } from './nftConstants';

import AudioPlayer from '../../components/AudioPlayer/AudioPlayer';

const Web3 = require('web3');

const UploadNFT = ({
    changeLoadingState,
    position,
    showModal,
    modalItem,
    modalScreen,
    datePickerPress,
    datePickerData,
    switchToNFTList,
    nftItem
}) => {

    const refVideo = useRef(null);

    // =============== Getting data from reducer ========================
    const { userData } = useSelector(state => state.UserReducer);
    const { networkType } = useSelector(state => state.WalletReducer);
    const { networks } = useSelector(state => state.NetworkReducer);

    //================== Components State Defination ===================
    const [collectionList, setCollectionList] = useState([]);
    const [collection, setCollection] = useState(null);
    const [nftImage, setNftImage] = useState(null);
    const [nftMediaType, setNftMediaType] = useState(null);
    const [imageError, setImageError] = useState("");
    const [nftImageThumb, setNftImageThumb] = useState(null);
    const [activeModal, setActiveModal] = useState("");

    const [filterList, setFilterList] = useState([]);
    const [filterItemActive, setFilterItemActive] = useState({});
    const [filterSelect, setFilterSelect] = useState("");

    const [nftName, setNftName] = useState("");
    const [nftDesc, setNftDesc] = useState("");

    const [basePrice, setBasePrice] = useState(null);
    const [otherPrice, setOtherPrice] = useState([]);

    const [imageTypeList, setImageTypeList] = useState(ImageType);
    const [nftImageType, setNftImageType] = useState(null);
    const [royality, setRoyality] = useState("2.5%");

    const [toggleButton, setToggleButton] = useState("fixPrice");
    const [fixedPrice, setFixedPrice] = useState("");
    const [startTimeDate, setStartTimeDate] = useState("");
    const [endTimeDate, setEndTimeDate] = useState("");

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [nftSupply, setNftSupply] = useState(1);
    const [nftExternalLink, setnftExternalLink] = useState("");
    const [openTransactionPending, setOpenTransactionPending] = useState(false);
    const [playVideo, toggleVideoPlay] = useState(true);

    //==================== Global Variables =======================
    //#region SmartContract
    const walletAddress = userData?.userWallet?.address;
    // let MarketPlaceAbi = '';
    // let MarketContractAddress = '';
    // let providerUrl = '';
    // let ERC721Address = '';
    // let NftApprovalAbi = '';
    // let gasFee = "";
    // let gasLimit = "";
    // let ERC721Abi = '';

    //===================== UseEffect Function =========================
    useEffect(() => {
        if (position == 3) {
            changeLoadingState(true)
            getCollectionList()
            cleanAll();
            if (nftItem) {
                updateNFTData(nftItem)
            }
            // if (networkType.value !== 'ethereum') {
            //     setOtherPrice(["0"])
            // }
        }
    }, [position, nftItem])

    useEffect(() => {
        if (modalScreen === "uploadNFT" && modalItem) {
            if (modalItem !== "closed") {
                if (activeModal === "collection") {
                    setCollection(modalItem)
                } else if (activeModal === "basePrice") {
                    setBasePrice(modalItem)
                } else if (activeModal === "nftType") {
                    setNftImageType(modalItem)
                } else if (activeModal === "royality") {
                    setRoyality(modalItem)
                } else if (activeModal === "nftMediaType") {
                    if (modalItem && modalItem?.name === "Audio") {
                        setTimeout(() => {
                            openDocumentPicker();
                        }, 1200);
                    } else {
                        setTimeout(() => {
                            openImagePicker();
                        }, 1200);
                    }
                } else if (activeModal == filterSelect) {
                    let filterItem = { ...filterItemActive };
                    filterItem[activeModal] = modalItem;
                    setFilterItemActive(filterItem);
                    setFilterSelect("")
                }
                setActiveModal("")
            } else {
                setActiveModal("")
            }
        }
    }, [modalItem])

    useEffect(() => {
        if (modalScreen === "uploadNFT" && datePickerData) {
            if (datePickerData !== "closed") {
                if (activeModal === "startTime") {
                    setStartDate(datePickerData)
                    setStartTimeDate(moment(datePickerData).format("YYYY-MM-DDTHH:mm:ss"))
                } else if (activeModal === "endTime") {
                    setEndDate(datePickerData)
                    setEndTimeDate(moment(datePickerData).format("YYYY-MM-DDTHH:mm:ss"))
                }
                setActiveModal("")
            } else {
                setActiveModal("")
            }
        }

    }, [datePickerData])

    //===================== Clean all state data =============================
    const cleanAll = () => {
        setNftImage(null);
        setImageError("");
        setNftImageThumb(null);
        setActiveModal("");
        setFilterList([]);
        setFilterItemActive({});
        setFilterSelect("");
        setNftName("");
        setNftDesc("");
        setBasePrice(null);
        setOtherPrice([]);
        setNftImageType(null);
        setRoyality("2.5%");
        setFixedPrice("");
        setStartTimeDate("");
        setEndTimeDate("");
    }

    //====================== Get Collection List ==================
    const getCollectionList = async () => {
        sendRequest({
            url: `${NEW_BASE_URL}/collections/self`,
            method: 'GET',
            params: {
                networkId: networkType?.id
            }
        })
            .then(collectionList => {
                if (collectionList && collectionList?.data && collectionList.data.length !== 0) {
                    setCollectionList(collectionList.data);
                    changeLoadingState(false);
                } else {
                    changeLoadingState(false)
                }
            })
            .catch(e => {
                changeLoadingState(false);
                console.log(e.response, "nftlist collectionList error");
                // alertWithSingleBtn(
                //   translate("wallet.common.alert"),
                //   translate("wallet.common.error.networkFailed")
                // );

                if (e?.response?.status === 401) {
                    alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate('common.sessionexpired')
                    )
                }
            })
    };

    //===================== Update/Edit NFT Data =============================
    const updateNFTData = (item) => {
        setNftName(item.name);
        setNftDesc(item.description);
        let checkImage = item.image.match(/^http[^\?]*.(jpg|jpeg|gif|png)(\?(.*))?$/gmi);
        let imageObjSet = {
            path: item.image
        }
        let setImageTList;

        if (checkImage) {

            if (item.image.includes("gif")) {
                imageObjSet.mime = "image/gif"
                setImageTList = ImageType.filter(v => v.name == "GIF")
            } else {
                imageObjSet.mime = "image"
                setNftImageThumb({ path: item.thumbnailImage })
                setImageTList = ImageType.filter(v => v.name !== "GIF" && v.name !== "Movie")
            }
            setNftImage(imageObjSet)

        } else {
            imageObjSet.mime = "video"
            setImageTList = ImageType.filter(v => v.name == "Movie")
            setNftImage(imageObjSet)
            setNftImageThumb({ path: item.thumbnailImage })
        }

        setImageTypeList(setImageTList)

        let basePriceFind = PriceUnits[networkType.value].find(
            v => v.name == item.basePrice || v.order == item.basePrice
        );

        if (typeof (item.properties.type) == "string") {
            let imageTypeFind = ImageType.find(
                v => v.type == item.properties.type
            )
            setNftImageType(imageTypeFind)
        }
        setBasePrice(basePriceFind)
        setOtherPrice(item.acceptCoins)
        setToggleButton(item.salesType)
        setFixedPrice(item.minPrice)
        setStartTimeDate(item.startTime)
        setEndTimeDate(item.endTime)
        changeLoadingState(false);
    }
    //==============================================================

    // const setMainFiltersData = filters => {
    //     let newArray = [];
    //     for (let i = 0; i < filters?.length; i++) {
    //         let filterName = filters[i]?.filter_name;
    //         let filterArray = filters.filter(
    //             item => item.filter_name == filters[i]?.filter_name
    //         );
    //         newArray.push({ name: filterName, values: filterArray });
    //     }
    //     return newArray;
    // };

    // const getFiltersList = async (id) => {
    //     try {
    //         const headers = {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${userData.access_token}`,
    //         };
    //         const url = `${BASE_URL}/user/get-Filter-collection`;
    //         const dataToSend = {
    //             collectionId: id,
    //         };
    //         let result = await axios.post(url, dataToSend, { headers: headers });
    //         // console.log(result, "get filter list")
    //         if (result?.data?.success) {
    //             let returnedArr = setMainFiltersData(result?.data?.data);
    //             let key = 'name';
    //             const uniqueArr = [
    //                 ...new Map(returnedArr.map(item => [item[key], item])).values(),
    //             ];
    //             setFilterList(uniqueArr);
    //         }
    //     } catch (err) {
    //         console.log('err in getFiltersList', err);
    //     }
    //     changeLoadingState(false)
    // }

    //========================== Select NFT Media Function =========================
    const onPhoto = () => {
        setImageError("")
        setActiveModal("nftMediaType")
        showModal({
            data: ImageType,
            title: translate("wallet.common.nftType"),
            itemToRender: "name",
            translate: "code"
        })
    }

    const openImagePicker = () => {
        ImagePicker.openPicker({
            mediaType: modalItem.name === 'Movie' ? 'video' : 'photo'
        }).then(res => {
            if (res.size > 50457280) {
                setImageError("File size should not exceed 50MB")
            } else {
                handleFile(res);
            }
        })
            .catch((err => {
                console.log("@@@ image picker error =======>", err.code)
                err.code !== 'E_PICKER_CANCELLED' && setImageError("Invalid Format")
            }))
    }

    const openDocumentPicker = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                allowMultiSelection: false,
                presentationStyle: 'fullScreen',
                type: [DocumentPicker.types.audio],
                copyTo: "cachesDirectory"
            });
            res['mime'] = res.type;
            res['path'] = res.fileCopyUri;
            handleAudioFile(res);
        } catch (error) {
            console.log("@@@ Document picker error ======>", error)
        }
    }

    const validMediaType = (type) => {
        if (!type) return false
        return supportMediaType.combind.includes(type)
    }

    const handleAudioFile = (res) => {
        if (validMediaType(res.type)) {
            setNftImage(res)
            let setImageTList = ImageType.filter(v => v.name !== "Art" && v.name !== "Photo" && v.name !== "GIF" && v.name !== "Movie")
            setImageTypeList(setImageTList)
            setNftImageType(null);
        } else {
            setImageError(translate("common.INVALID_AUDIO_TYPE"))
        }
    }

    const handleFile = (res) => {
        if (validMediaType(res.mime)) {
            if (res.mime.includes("image")) {
                if (res.height >= 512 && res.width >= 512) {
                    let setImageTList = ImageType.filter(v => v.name !== "GIF" && v.name !== "Movie" && v.name !== "Audio")
                    setImageTypeList(setImageTList)
                    setNftImageType(null);
                    setNftImage(res)
                    cropImage(res)
                } else {
                    if (res.mime.includes("gif")) {
                        let setImageTList = ImageType.filter(v => v.name !== "Art" && v.name !== "Photo" && v.name !== "Movie" && v.name !== "Audio")
                        setNftImage(res)
                        setImageTypeList(setImageTList)
                        setNftImageType(null);
                    } else {
                        setImageError("Image size should be greater than 512*512")
                    }
                }
            } else {
                //  space for video croping code
                setNftImage(res)
                let setImageTList = ImageType.filter(v => v.name !== "Art" && v.name !== "Photo" && v.name !== "GIF" && v.name !== "Audio")
                setImageTypeList(setImageTList)
                setNftImageType(null);
                videoCropping(res)
            }

        } else {
            if (res.mime.includes("video")) {
                setImageError(translate("common.INVALID_MOVIE_TYPE"))
            } else if (res.mime.includes("image")) {
                setImageError(translate("common.INVALID_ART_TYPE"))
            }
        }
    }

    const updateThumbnail = () => {
        setImageError("")
        ImagePicker.openPicker({
            mediaType: "photo",
            // cropping: true
        }).then(res => {
            if (res.size > 50457280) {
                setImageError("File size should not exceed 50MB")
            } else {
                if (res.mime.includes("image") && !res.mime.includes("gif")) {
                    if (res.height >= 512 && res.width >= 512) {
                        cropImage(res)
                    }
                } else {
                    //  space for video croping code
                    setImageError("Thumbnail supports( *.png, *.jpeg,* .jpg) files only")
                    console.log("@@@ onPhoto func res ========>", res)
                }
            }
        });
    }

    const cropImage = (res) => {
        ImagePicker.openCropper({
            path: res.path,
            width: 512,
            height: 512
        }).then(cropRes => {
            setNftImageThumb(cropRes)
        })
    }

    const videoCropping = (res) => {
        createThumbnail({
            url: res.path,
            timeStamp: 10000,
        })
            .then(response => {
                cropImage(response)
            })
            .catch(err => console.log({ err }));
    }
    //====================================================================

    const changeToggle = (v) => {
        setToggleButton(v)
        setFixedPrice("");
        setStartTimeDate("");
        setEndTimeDate("");
    }

    // const uploadImageToStorage = async () => {
    //     if (nftItem) {
    //         let datares = {
    //             image1: nftItem.image,
    //             image2: nftItem.thumbnailImage
    //         };

    //         return datares;

    //     } else {
    //         axios.defaults.headers.common['Authorization'] = `Bearer ${userData.access_token}`;

    //         let formData = new FormData();
    //         formData.append('image', { uri: nftImage.path, name: nftImage.path.split("/").pop(), type: nftImage.mime });

    //         axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

    //         let responseSend = await axios.post(`${BASE_URL}/xanalia/uploadS3`, formData)
    //             .then(async res => {
    //                 console.log("upload image nft", res)
    //                 if (res.data.success) {

    //                     let thumbnailDataFile = new FormData();
    //                     thumbnailDataFile.append('imageName', res.data.imageName);
    //                     if (nftImageThumb) {
    //                         thumbnailDataFile.append('image', {
    //                             uri: nftImageThumb.path,
    //                             name: nftImageThumb.path.split("/").pop(),
    //                             type: nftImageThumb.mime
    //                         });
    //                     } else {
    //                         thumbnailDataFile.append('image', {
    //                             uri: nftImage.path,
    //                             name: nftImage.path.split("/").pop(),
    //                             type: nftImage.mime
    //                         });
    //                     }

    //                     let thumbRes = await axios.post(`${BASE_URL}/xanalia/thumbUploadS3`, thumbnailDataFile)
    //                         .then(res2 => {
    //                             if (res2.data.success) {
    //                                 let datares = {
    //                                     image1: res.data.data,
    //                                     image2: res2.data.data
    //                                 };
    //                                 console.log(datares, "thumbnail url")
    //                                 return datares;
    //                             } else {
    //                                 changeLoadingState(false);
    //                                 alertWithSingleBtn(
    //                                     translate("wallet.common.alert"),
    //                                     translate(res.data.data)
    //                                 );
    //                                 return null;
    //                             }
    //                         })
    //                         .catch(err => {
    //                             errorMethod(err, "thumbnail image nft err")
    //                             return null;
    //                         });
    //                     return thumbRes;
    //                 } else {
    //                     changeLoadingState(false);
    //                     alertWithSingleBtn(
    //                         translate("wallet.common.alert"),
    //                         translate(res.data.data)
    //                     );
    //                     return null
    //                 }
    //             })
    //             .catch(err => {
    //                 errorMethod(err, "upload image nft err")
    //                 return null;
    //             });
    //         return responseSend;
    //     }
    // }

    // const handleInfura = async (image1, image2) => {
    //     let dataToSend = {
    //         name: nftName,
    //         description: nftDesc,
    //         image: image1,
    //         properties: { type: nftImageType.type },
    //         totalSupply: nftSupply,
    //         thumbnft: image2,
    //         externalLink: nftExternalLink,
    //     };

    //     let blob = JSON.stringify(dataToSend);
    //     let formData = new FormData();
    //     formData.append('path', blob);

    //     let hashRes = await axios
    //         .post(
    //             "https://ipfs.infura.io:5001/api/v0/add",
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         )
    //         .then((response) => {
    //             return response;
    //         })
    //         .catch((err) => {
    //             errorMethod(err, "error from infura catch")
    //             return null;
    //         });
    //     return hashRes
    // }

    // const handleCreate = async () => {
    //     if (userData.access_token) {
    //         // changeLoadingState(true);

    //         const imageRes = await uploadImageToStorage();
    //         console.log("+_+_+_+_+_+_+_+imageRes+_+_+_+_+_+_+_+", imageRes)
    //         if (imageRes) {

    //             const infuraRes = await handleInfura(imageRes.image1, imageRes.image2);

    //             if (infuraRes) {
    //                 let hashResp = infuraRes.data;
    //                 console.log("#@#@#@#@#@#@ infura res #@#@#@#@#@#@#@", hashResp)
    //                 let web3 = new Web3(providerUrl);

    //                 let approvalCheckContract = new web3.eth.Contract(
    //                     NftApprovalAbi,
    //                     collection.collectionAddress
    //                 );
    //                 approvalCheckContract.methods
    //                     .isApprovedForAll(wallet?.address, MarketContractAddress)
    //                     .call((err, res) => {
    //                         console.log(res, ":::::::approval response")
    //                         console.log(err, ":::::::error")
    //                         if (!err) {

    //                             if (!res) {

    //                                 setApprovalForAll(
    //                                     wallet?.address,
    //                                     wallet.privateKey,
    //                                     providerUrl,
    //                                     networkType.value,
    //                                     approvalCheckContract,
    //                                     MarketContractAddress,
    //                                     collection.collectionAddress
    //                                     , 10, 6000000)
    //                                     .then((_) => {
    //                                         console.log(_, "__approval set__")
    //                                         console.log("####################toggleButton#################", toggleButton)

    //                                         if (toggleButton == "fixPrice") {
    //                                             putNftOnSale(hashResp);
    //                                         } else {
    //                                             putNftOnAuction(hashResp);
    //                                         }

    //                                     }).catch((err) => {
    //                                         changeLoadingState(false);

    //                                         alertWithSingleBtn(
    //                                             translate("wallet.common.alert"),
    //                                             translate("wallet.common.insufficientFunds")
    //                                         );
    //                                     });

    //                             } else {
    //                                 console.log("####################toggle Button#################", toggleButton)

    //                                 if (toggleButton === "fixPrice") {
    //                                     putNftOnSale(hashResp);
    //                                 } else {
    //                                     putNftOnAuction(hashResp);
    //                                 }

    //                             }

    //                         } else {
    //                             changeLoadingState(false);
    //                             console.log("@#@#@#@#@#@#@#@ err in balanceOf @#@#@#@#@#@#@#@#@#", err);
    //                         }
    //                     })
    //             }
    //         }
    //     }
    // }

    // const putNftOnAuction = (data) => {
    //     let foundOrder = basePrice.order;
    //     const publicAddress = wallet?.address;
    //     const privKey = wallet.privateKey;

    //     let marketContractData = getMarketContract();

    //     let marketData = (collection && collection.collectionAddress.toLowerCase() == ERC721Address.toLowerCase()) ?
    //         marketContractData.marketContract.methods
    //             .MintAndAuctionNFT(
    //                 publicAddress,
    //                 data.Hash,
    //                 ERC721Address, // xanalia collection
    //                 marketContractData.web3.utils.toWei(fixedPrice.toString(), "ether"),
    //                 '',
    //                 new Date(endTimeDate).getTime() / 1000,
    //                 (parseFloat(royality) * Math.pow(10, 1)).toString(),
    //                 foundOrder.toString()
    //             ).encodeABI() :
    //         marketContractData.marketContract.methods
    //             .mintAndAuctionCollectionNFT(
    //                 collection.collectionAddress,
    //                 publicAddress,
    //                 data.Hash,
    //                 marketContractData.web3.utils.toWei(fixedPrice.toString(), "ether"),
    //                 foundOrder.toString(),
    //                 new Date(endTimeDate).getTime() / 1000
    //             )
    //             .encodeABI();

    //     let dataToAdd = {
    //         providerUrl,
    //         publicAddress,
    //         gasFee: 10,
    //         gasLimit: 6000000,
    //         chainType: networkType.value,
    //         MarketContractAddress,
    //         privKey,
    //         data: marketData
    //     }

    //     nftCallTransaction(dataToAdd)
    // }

    // const putNftOnSale = (data) => {

    //     let foundOrder = basePrice.order;
    //     const publicAddress = wallet?.address;
    //     const privKey = wallet.privateKey;

    //     let currencyListArr = otherPrice.map(i => Number(i));

    //     let marketContractData = getMarketContract();

    //     let marketData = (collection && collection.collectionAddress.toLowerCase() == ERC721Address.toLowerCase()) ?
    //         marketContractData.marketContract.methods
    //             .MintAndSellNFT(
    //                 publicAddress,
    //                 data.Hash,
    //                 marketContractData.web3.utils.toWei(fixedPrice.toString(), "ether"),
    //                 '',
    //                 (parseFloat(royality) * Math.pow(10, 1)).toString(),
    //                 foundOrder.toString(),
    //                 currencyListArr
    //             ).encodeABI() :
    //         marketContractData.marketContract.methods
    //             .mintAndSellCollectionNFT(
    //                 collection.collectionAddress,
    //                 publicAddress,
    //                 data.Hash,
    //                 marketContractData.web3.utils.toWei(fixedPrice.toString(), "ether"),
    //                 foundOrder.toString(),
    //                 currencyListArr
    //             )
    //             .encodeABI();

    //     let dataToAdd = {
    //         providerUrl,
    //         publicAddress,
    //         gasFee: 10,
    //         gasLimit: 6000000,
    //         chainType: networkType.value,
    //         MarketContractAddress,
    //         privKey,
    //         data: marketData
    //     }

    //     nftCallTransaction(dataToAdd)
    // }

    // const nftCallTransaction = (data) => {
    //     nftMakingMethods(data)
    //         .then((transRes) => {
    //             if (transRes.success) {
    //                 if (nftItem) {

    //                     let changeStatusData = {
    //                         collectionId: nftItem.collectionId,
    //                         nftDraftId: nftItem._id,
    //                         transctionHash: transRes.data.transactionHash,
    //                         chainType: networkType.value
    //                     };
    //                     console.log(changeStatusData, "changeStatusData")
    //                     let url = `${BASE_URL}/user/change-status-draft`
    //                     axios.defaults.headers.post['Content-Type'] = 'application/json';

    //                     axios.post(url, changeStatusData)
    //                         .then(res => {
    //                             changeLoadingState(false);
    //                             console.log(res, "__draft status updated__")

    //                         })
    //                         .catch(err => {
    //                             errorMethod(err, "error from delete draft catch")
    //                         });
    //                 } else {
    //                     changeLoadingState(false);
    //                 }
    //                 cleanAll();
    //                 switchToNFTList("mint", collection)
    //             } else {
    //                 changeLoadingState(false);
    //             }

    //         }).catch((err) => {
    //             changeLoadingState(false);

    //             alertWithSingleBtn(
    //                 translate("wallet.common.alert"),
    //                 translate("wallet.common.insufficientFunds")
    //             );
    //         });
    // }

    // const getMarketContract = () => {
    //     const web3 = new Web3(
    //         new Web3.providers.HttpProvider(
    //             providerUrl
    //         )
    //     );

    //     let marketContract = new web3.eth.Contract(
    //         MarketPlaceAbi,
    //         MarketContractAddress
    //     );

    //     return { marketContract, web3 }
    // }

    // const saveDraftToDatabase = (res, res2) => {
    //     let dataToSend = {
    //         collectionId: collection._id,
    //         name: nftName,
    //         description: nftDesc,
    //         image: res,
    //         thumbnailImage: res2,
    //         properties: { type: nftImageType.type },
    //         salesType: toggleButton,
    //         minPrice: fixedPrice,
    //         startTime:
    //             toggleButton == 'timeAuction'
    //                 ? startTimeDate
    //                 : '',
    //         endTime:
    //             toggleButton == 'timeAuction'
    //                 ? endTimeDate
    //                 : '',
    //         acceptCoins: otherPrice,
    //         basePrice: basePrice.name,
    //         chainType: networkType.value,
    //     };

    //     let url;

    //     if (nftItem) {
    //         dataToSend.requestId = nftItem._id,
    //             url = `${BASE_URL}/user/edit-nft-draft`
    //     } else {
    //         url = `${BASE_URL}/user/create-nft-draft`
    //     }

    //     axios.defaults.headers.post['Content-Type'] = 'application/json';

    //     axios.post(url, dataToSend)
    //         .then(draftRes => {

    //             console.log(draftRes, "draftRes")

    //             if (draftRes.data.success) {
    //                 cleanAll();
    //                 switchToNFTList("draft", collection)
    //             }
    //             changeLoadingState(false);

    //         })
    //         .catch(err => {
    //             errorMethod(err, "error from infura catch")
    //         });
    // }

    //===================== Creat NFT Function ============================
    const createNFT = async () => {
        try {
            setOpenTransactionPending(true);
            const nftData = {
                name: nftName.trim(),
                description: nftDesc,
                collectionId: collection && Number(collection?.id),
                networkId: networkType?.id,
                receiveToken: basePrice.name,
                royalty: Number(royality.split('%')[0]),
                category: NFT_TYPE_TO_ID[nftImageType?.value],
                type: toggleButton === "fixPrice" ? 1 : 2,
            }

            if (toggleButton === "fixPrice") {
                nftData.price = Number(fixedPrice)
            }

            if (toggleButton === "timeAuction") {
                nftData.price = Number(fixedPrice)
                nftData.startPrice = Number(fixedPrice)
                nftData.startTime = startDate.toISOString()
                nftData.endTime = endDate.toISOString()
            }
            const res = await sendRequest({
                url: `${NEW_BASE_URL}/nfts`,
                method: 'POST',
                data: nftData
            })
            if (res && res?.savedNft) {
                const nftId = res.savedNft.id;
                const thumbnailFile = nftImageThumb;
                const mainFile = nftImage;

                let resPreview = ''
                const nftType = NFT_TYPE_TO_ID[nftImageType?.value];
                if (nftImageThumb && nftImageThumb?.mime !== 'image/gif') {
                    resPreview = await getUploadData({
                        mediaFile: nftImageThumb,
                        collectionId: nftId,
                        userId: userData.id,
                        type: 'preview'
                    })
                    await putNFTMedia({
                        mediaFile: thumbnailFile,
                        nftId: nftId,
                        uploadUrl: resPreview.upload_url,
                    })
                }

                // handle upload media to S3
                if (nftType === 4 || nftType === 5) {
                    // upload thumnail
                    const previewMediaId = resPreview?.path?.replace(
                        'input',
                        'output',
                    )
                    if (supportMediaType.audio.includes(mainFile?.mime)) {
                        // upload audio
                        const resAudio = await getUploadData({
                            mediaFile: mainFile,
                            collectionId: nftId,
                            userId: userData.id,
                            type: 'audio',
                        })
                        await putNFTMedia({
                            mediaFile: mainFile,
                            nftId: nftId,
                            uploadUrl: resAudio.upload_url,
                            previewMediaId: previewMediaId,
                        })
                    } else {
                        // upload video
                        const resVideo = await getUploadData({
                            mediaFile: mainFile,
                            collectionId: nftId,
                            userId: userData.id,
                            previewMediaId: previewMediaId,
                            type: 'video',
                        })
                        await putNFTMedia({
                            mediaFile: mainFile,
                            nftId: nftId,
                            uploadUrl: resVideo.upload_url,
                            previewMediaId: previewMediaId,
                        })
                    }
                } else {
                    console.log("@@@ image type is normal last condition=========>")
                    // upload normal image
                    const resPresign = await getUploadData({
                        mediaFile: mainFile,
                        collectionId: nftId,
                        userId: userData.id,
                    })
                    await putNFTMedia({
                        nftId: nftId,
                        mediaFile: mainFile,
                        uploadUrl: resPresign?.upload_url,
                        thumbImgPath: resPreview?.path,
                    })
                }
            } else {
                changeLoadingState(false);
                setOpenTransactionPending(false);
            }
        } catch (error) {
            changeLoadingState(false);
            setOpenTransactionPending(false);
            if (error)
                errorMethod(err, error.message)
        }
    }

    const errorMethod = (err, v) => {
        changeLoadingState(false);
        if (err.response.status === 401) {
            alertWithSingleBtn(
                translate("wallet.common.alert"),
                translate("common.sessionexpired")
            );
        }
        // alertWithSingleBtn(
        //   translate("wallet.common.alert"),
        //   translate("wallet.common.error.networkFailed")
        // );
    }

    const handleSocketResultMintNFT = useCallback(
        async (data) => {
            const signData = data?.data?.dataReturn?.signData
            // 0 mint 1 mintandputonsale 2 mintonputonauction
            const txnType = data?.data?.nftType
            if (signData) {
                await handleMintAndTradeNFT(signData, txnType)
            }
        },
        [networkType],
    )

    useSocketGlobal(
        SOCKET_EVENTS.sendDataSignCreateNftSuccess,
        handleSocketResultMintNFT,
    )

    const handleCreateNFTSuccess = (data) => {
        alertWithSingleBtn('', translate('common.tansactionSuccessFull'));
    }

    useSocketGlobal(
        SOCKET_EVENTS.externalCreateNftSuccess,
        handleCreateNFTSuccess,
    )

    const handleMintAndTradeNFT = async (data, txnType) => {
        try {
            const transactionParameters = {
                nonce: data.nonce, // ignored by MetaMask
                gasPrice: data.gasPrice, // customizable by user during MetaMask confirmation.
                gasLimit: data.gas, // customizable by user during MetaMask confirmation.
                to: data.to, // Required except during contract publications.
                from: data.from, // must match user's active address.
                // value: '0x00', // Only required to send ether to the recipient from the initiating external account.
                data: data.data, // Optional, but used for defining smart contract creation and interaction.
                chainId: networkType?.chainId, // Used to prevent transaction reuse across b
                networkId: data?.networkId
            }
            if (txnType) {
                await sendCustomTransaction(
                    transactionParameters,
                    walletAddress,
                    null,
                    networkType?.name,
                )
            }
            console.log("@@@ payment done ==========>");
            setOpenTransactionPending(false);
            cleanAll();
            alertWithSingleBtn('', translate('common.tansactionSuccessFull'));
        } catch (error) {
            setOpenTransactionPending(false);
            console.log(error.code)
            console.log(error.message)
            // handleTransactionError(error, t)
        }
    }
    //==============================================================================



    //======================= Other supportive function ========================
    const changePrice = (v) => {
        var validNumber = new RegExp(/^\d*\.?\d*$/);
        if (validNumber.test(v)) {
            setFixedPrice(v)
        }
    }
    let disableBtn = collection && nftName && nftDesc && nftImageType && nftImage && (!nftImage.mime.includes("gif") ? nftImageThumb : true) && basePrice && (toggleButton == "timeAuction" ? (fixedPrice && fixedPrice > 0) && (startTimeDate < endTimeDate) : fixedPrice > 0);

    let networkTypeStatus = networkType.name == "BSC" ?
        translate("common.BinanceNtwk") : networkType.name == "Polygon" ?
            translate("common.polygon") : translate("common.ethereum");

    let draftBtnD = (collection || collection && collection.name === "Xanalia (ETH)") || !disableBtn;
    return (
        <View style={styles.childCont}>
            <ScrollView
                showsVerticalScrollIndicator={false}>
                <KeyboardAwareScrollView extraScrollHeight={hp('2%')}>

                    <CardCont style={styles.imageMainCard}>
                        <TouchableOpacity
                            onPress={!nftItem ? (nftImage ? nftImage.mime.includes("image") ? onPhoto : null : onPhoto) : null}
                            activeOpacity={0.5} style={styles.cardImageCont}>
                            {
                                nftImage ?
                                    nftImage.mime.includes("image") ?
                                        <Image
                                            style={styles.completeImage}
                                            source={{ uri: nftImage.path }}
                                        /> :
                                        nftImage.mime.includes("audio") ?
                                            <AudioPlayer
                                                mediaUrl={nftImage.path} />
                                            :
                                            <TouchableOpacity style={styles.cardImageCont} activeOpacity={1} onPress={() => toggleVideoPlay(!playVideo)}>
                                                <Video
                                                    source={{ uri: nftImage.path }}
                                                    // source={nftImage.path}
                                                    style={styles.completeImage}
                                                    controls={true}
                                                    playInBackground={false}
                                                    paused={playVideo}
                                                    onError={error => {
                                                        console.log("@@@ loaded error =========>", error);
                                                        // setVideoLoadErr(true);
                                                    }}
                                                    onReadyForDisplay={() => {
                                                        // toggleThumb(false);
                                                    }}
                                                    onLoad={data => {
                                                        // refVideo.current.seek(0);
                                                    }}
                                                />
                                            </TouchableOpacity>
                                    :
                                    <Image
                                        style={styles.completeImage}
                                        source={IMAGES.imagePlaceholder}
                                    />
                            }
                        </TouchableOpacity>
                        <View style={styles.cardDesCont}>
                            {
                                !nftImage ?
                                    <Text
                                        style={[
                                            styles.bannerDes,
                                            { textAlign: 'center' },
                                        ]}>
                                        {translate("common.mediaOnDevice")}
                                    </Text> : null
                            }
                            {
                                !!imageError ?
                                    <Text
                                        style={[
                                            styles.bannerDes,
                                            styles.nftImageError,
                                        ]}>
                                        {imageError}
                                    </Text> : null
                            }
                            {
                                !nftItem ? (nftImage ?
                                    <>
                                        <View style={styles.saveBtnGroup}>
                                            <CardButton
                                                label={translate("wallet.common.remove")}
                                                buttonCont={{ width: '48%' }}
                                                onPress={() => {
                                                    setNftImage(null);
                                                    setImageError("");
                                                    setNftImageThumb(null);
                                                    setImageTypeList(ImageType)
                                                    setNftImageType(null)
                                                }}
                                            />
                                            <CardButton
                                                onPress={onPhoto}
                                                border={colors.BLUE6}
                                                buttonCont={{ width: '48%' }}
                                                label={translate("common.change")}
                                            />
                                        </View>
                                        {
                                            !nftImage.mime.includes("gif") ?
                                                <View style={{ flexDirection: "row", marginTop: hp(2) }}>
                                                    <View style={styles.thumbNail}>
                                                        <Image
                                                            source={nftImageThumb ? { uri: nftImageThumb.path } : IMAGES.imagePlaceholder}
                                                            style={styles.completeImage} />
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: "center" }}>
                                                        {!nftImage.mime.includes("image") && <TouchableOpacity onPress={() => {
                                                            nftImage ? nftImage.mime.includes("image") ?
                                                                cropImage(nftImage) :
                                                                updateThumbnail()
                                                                : null
                                                        }}>
                                                            <Text
                                                                style={[
                                                                    styles.bannerDes,
                                                                    styles.thumbnailEditButton
                                                                ]}>
                                                                {translate("common.EditTrim")}
                                                            </Text>
                                                        </TouchableOpacity>}
                                                    </View>
                                                </View> : null
                                        }
                                    </> : null) : null
                            }

                        </View>

                    </CardCont>

                    <CardCont>
                        <CardLabel>{translate("common.nftName")}</CardLabel>
                        <CardField
                            inputProps={{ value: nftName, onChangeText: e => setNftName(e) }}
                        />
                        <CardLabel>{translate("wallet.common.collection")}</CardLabel>
                        <CardField
                            inputProps={{ value: collection ? collection.name : "" }}
                            onPress={() => {
                                setActiveModal("collection")
                                showModal({
                                    data: collectionList,
                                    title: translate("wallet.common.collectionList"),
                                    itemToRender: "name"
                                })
                            }}
                            showRight
                            pressable />
                        <CardLabel>{translate("wallet.common.descriptionCreate")}</CardLabel>
                        <Text style={styles.cardfieldCount}>{nftDesc.length} / 1000</Text>
                        <CardField
                            inputProps={{
                                placeholder: translate("wallet.common.typeSomething"),
                                multiline: true,
                                value: nftDesc,
                                onChangeText: e => nftDesc.length <= 1000 ? setNftDesc(e.slice(0, 1000)) : null
                            }}
                            contStyle={{ height: hp('15%') }}
                        />
                    </CardCont>

                    <CardCont>
                        <CardLabel>{translate("wallet.common.network")}</CardLabel>
                        <CardField inputProps={{ value: networkTypeStatus, editable: false }} />
                        <CardLabel>{translate("wallet.common.basePrice")}</CardLabel>
                        <CardField
                            inputProps={{ value: basePrice ? basePrice.name : translate("wallet.common.selectBasePrice") }}
                            onPress={() => {
                                setActiveModal("basePrice")
                                showModal({
                                    data: PriceUnits[networkType.name],
                                    title: translate("wallet.common.selectBasePrice"),
                                    itemToRender: "name"
                                })
                            }}
                            pressable
                            showRight
                        />
                    </CardCont>

                    <CardCont>
                        <CardLabel>{translate("wallet.common.nftType")}</CardLabel>
                        <CardField
                            inputProps={{ value: nftImageType ? (nftImageType.hasOwnProperty("code") ? translate(nftImageType.code) : nftImageType.name) : translate("common.type") }}
                            onPress={() => {
                                setActiveModal("nftType")
                                showModal({
                                    data: imageTypeList,
                                    title: translate("wallet.common.nftType"),
                                    itemToRender: "name",
                                    translate: "code"
                                })
                            }}
                            pressable
                            showRight />
                        <>
                            <CardLabel>{translate("wallet.common.royality")}</CardLabel>
                            <CardField
                                inputProps={{ value: royality }}
                                onPress={() => {
                                    setActiveModal("royality")
                                    showModal({ data: royalityData, title: translate("wallet.common.royality") })
                                }}
                                pressable
                                showRight />
                            <CardLabel>{translate("common.PLATFORM_FEE_MSG")}</CardLabel>
                        </>
                        {/* {
                            filterList.length !== 0 &&
                            filterList.map((fList, i) => {
                                return (
                                    <View key={i}>
                                        <CardLabel>{fList.name}</CardLabel>
                                        {fList.values.length == 1 ?
                                            <CardField
                                                inputProps={{ value: fList?.values?.[0].filter_value, editable: false }}
                                            />
                                            :
                                            <CardField
                                                inputProps={{ value: filterItemActive.hasOwnProperty(fList.name) ? filterItemActive[fList.name].filter_value : "" }}
                                                onPress={() => {
                                                    setActiveModal(fList.name)
                                                    setFilterSelect(fList.name)
                                                    showModal({
                                                        data: fList?.values,
                                                        title: fList.name,
                                                        itemToRender: "filter_value"
                                                    })
                                                }}
                                                pressable
                                                showRight />
                                        }
                                    </View>
                                )
                            })
                        } */}

                    </CardCont>
                    <CardCont>
                        <CardLabel>{translate("wallet.common.saleType")}</CardLabel>
                        <View style={styles.saveBtnGroup}>
                            <CardButton
                                onPress={() => changeToggle("fixPrice")}
                                border={toggleButton !== "fixPrice" ? colors.BLUE6 : null}
                                label={translate("common.fixedPrice")}
                                buttonCont={{ width: '48%' }}
                            />
                            <CardButton
                                onPress={() => changeToggle("timeAuction")}
                                border={toggleButton !== "timeAuction" ? colors.BLUE6 : null}
                                buttonCont={{ width: '48%' }}
                                label={translate("wallet.common.auctionnew")}
                            />
                        </View>
                    </CardCont>

                    <CardCont>
                        {
                            toggleButton == "fixPrice" ?
                                <>
                                    <CardLabel>{translate("common.fixedPrice")}</CardLabel>
                                    <CardField
                                        contStyle={{ paddingRight: 0 }}
                                        inputProps={{
                                            value: fixedPrice,
                                            onChangeText: changePrice,
                                            keyboardType: "decimal-pad",
                                            maxLength: 30
                                        }}
                                        showRight
                                        rightComponent={
                                            <CardButton
                                                disable
                                                buttonCont={{ width: '15%', borderRadius: 0 }}
                                                label={basePrice ? basePrice.name : "ALIA"}
                                            />
                                        }
                                    />
                                </> :
                                <>
                                    <CardLabel>{translate("wallet.common.auctionTime")}</CardLabel>
                                    <CardLabel style={{ fontFamily: fonts.PINGfANG }}>
                                        {translate("wallet.common.openTime")}
                                    </CardLabel>
                                    <CardField
                                        inputProps={{ value: (startTimeDate ? moment(startTimeDate).format('MMMM Do YYYY, hh:mm a').toUpperCase() : " ") }}
                                        onPress={() => {
                                            setActiveModal("startTime")
                                            setEndTimeDate("")
                                            datePickerPress(new Date())
                                        }}
                                        pressable
                                        showRight />
                                    {Platform.OS === "android" ? startTimeDate > endTimeDate ?
                                        <CardLabel style={{ fontFamily: fonts.PINGfANG, color: "red" }}>
                                            {translate("wallet.common.closeTime") + "* (" + translate("wallet.common.closeTimeWarn") + ")"}
                                        </CardLabel> : <CardLabel style={{ fontFamily: fonts.PINGfANG }}>
                                            {translate("wallet.common.closeTime")}
                                        </CardLabel> : <CardLabel style={{ fontFamily: fonts.PINGfANG }}>
                                        {translate("wallet.common.closeTime")}
                                    </CardLabel>
                                    }
                                    <CardField
                                        inputProps={{
                                            value: (endTimeDate ? moment(endTimeDate).format('MMMM Do YYYY, hh:mm a').toUpperCase() : " ")
                                        }}

                                        onPress={() => {
                                            setActiveModal("endTime")
                                            Platform.OS === "ios" ? datePickerPress(startTimeDate ? new Date(startTimeDate) : new Date()) : datePickerPress(new Date())
                                        }}
                                        pressable
                                        showRight />
                                    <CardField
                                        contStyle={{ paddingRight: 0 }}
                                        inputProps={{
                                            value: fixedPrice,
                                            onChangeText: changePrice,
                                            keyboardType: 'decimal-pad',
                                            maxLength: 30
                                        }}
                                        showRight
                                        rightComponent={
                                            <CardButton
                                                disable
                                                buttonCont={{ width: '15%', borderRadius: 0 }}
                                                label={basePrice ? basePrice.name : "ALIA"}
                                            />
                                        }
                                    />
                                </>
                        }
                    </CardCont>

                    <View style={styles.saveBtnGroup}>
                        <CardButton
                            onPress={() => nftItem ? saveDraftToDatabase(nftItem.image, nftItem.thumbnailImage) : createNFT()}
                            label={nftItem ? translate("wallet.common.edit") : translate("common.MINT_NOW")}
                            buttonCont={{
                                width: '48%',
                                backgroundColor: !disableBtn ? '#rgba(59,125,221,0.5)' : colors.BLUE6
                            }}
                            disable={!disableBtn}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>
            <TransactionPending
                isVisible={openTransactionPending}
                setVisible={setOpenTransactionPending}
                transactionMsg={'Transaction processing and uploading data...'}
            />
        </View>
    );
};

export default React.memo(UploadNFT);
