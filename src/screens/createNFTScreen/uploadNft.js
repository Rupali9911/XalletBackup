import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../res';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { createThumbnail } from "react-native-create-thumbnail";
import Video from 'react-native-fast-video';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from './styles';
import { CardCont, CardField, CardLabel, CardButton } from './components';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../common/responsiveFunction';
import { IMAGES } from '../../constants';
import { networkType as networkStatus } from "../../common/networkType";
import { fonts } from '../../res';

import axios from 'axios';
import { BASE_URL } from '../../common/constants';
import { alertWithSingleBtn } from '../../utils';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import { translate } from '../../walletUtils';
import { setApprovalForAll, nftMakingMethods } from '../wallet/functions';
import { RF } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';

const Web3 = require('web3');

const PriceUnits = {
  ethereum: [{ order: "1", name: 'ETH' }, { order: "0", name: 'USDT' }],
  binance: [{ order: "0", name: 'ALIA' }, { order: "1", name: 'BUSD' }, { order: "2", name: 'BNB' }],
  polygon: [{ order: "0", name: 'ALIA' }, { order: "1", name: 'USDC' }, { order: "2", name: 'ETH' }, { order: "3", name: "MATIC" }]
}

const ImageType = [
  { name: "Art", type: "2D", code: "common.2DArt" },
  { name: "Photo", type: "portfolio", code: "common.photo" },
  { name: "GIF", type: "GIF" },
  { name: "Movie", type: "movie", code: "common.video" },
]

const royalityData = ["2.5%", "5%", "10%"];

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

  const { wallet, data } = useSelector(
    state => state.UserReducer
  );
  const { networkType } = useSelector(
    state => state.WalletReducer
  );

  const [collectionList, setCollectionList] = useState([]);
  const [collection, setCollection] = useState(null);
  const [nftImage, setNftImage] = useState(null);
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

  const [nftSupply, setNftSupply] = useState(1); //--------------
  const [nftExternalLink, setnftExternalLink] = useState(""); //-------------

  //#region SmartContract
  let MarketPlaceAbi = '';
  let MarketContractAddress = '';
  let providerUrl = '';
  let ERC721Abi = '';
  let ERC721Address = '';
  let NftApprovalAbi = '';

  let gasFee = "";
  let gasLimit = "";

  if (networkType.value === 'polygon') {
    MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[1].marketConConfig.add;
    providerUrl = blockChainConfig[1].providerUrl;
    ERC721Abi = blockChainConfig[1].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[1].erc721ConConfig.add;
    NftApprovalAbi = blockChainConfig[1].nftApprovalConConfig.abi
    gasFee = 30
    gasLimit = 6000000
  } else if (networkType.value === 'binance') {
    MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[0].marketConConfig.add;
    providerUrl = blockChainConfig[0].providerUrl;
    ERC721Abi = blockChainConfig[0].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[0].erc721ConConfig.add;
    NftApprovalAbi = blockChainConfig[0].nftApprovalConConfig.abi
    gasFee = 10
    gasLimit = 6000000
  } else if (networkType.value === 'ethereum') {
    MarketPlaceAbi = blockChainConfig[2].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[2].marketConConfig.add;
    providerUrl = blockChainConfig[2].providerUrl;
    ERC721Abi = blockChainConfig[2].erc721ConConfig.abi;
    ERC721Address = blockChainConfig[2].erc721ConConfig.add;
    NftApprovalAbi = blockChainConfig[2].nftApprovalConConfig.abi
    gasFee = 10 // for this api etherscan
    gasLimit = 6000000
  }

  useEffect(() => {
    if (position == 2) {
      changeLoadingState(true)
      getCollectionList()
      cleanAll();

      if (networkType.value !== 'ethereum') {
        setOtherPrice(["0"])
      }

      if (nftItem) {
        console.log(nftItem)
        updateNFTData(nftItem)
      }

    }
  }, [position, nftItem])

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

  useEffect(() => {
    if (modalScreen === "uploadNFT" && modalItem) {

      if (modalItem !== "closed") {
        if (activeModal === "collection") {
          setCollection(modalItem)
          getFiltersList(modalItem._id)
        } else if (activeModal === "basePrice") {
          setBasePrice(modalItem)
          let priceList = [...otherPrice];
          if (networkType.value !== 'ethereum') {
            priceList = priceList.slice(0, 1)
            if (modalItem.order !== "0") {
              priceList[1] = modalItem.order
            } else {
              priceList = priceList.slice(0, 1)
            }
          } else {
            priceList[0] = modalItem.order
            priceList = priceList.slice(0, 1)
          }
          let uniqueChars = [...new Set(priceList)];
          setOtherPrice(uniqueChars)
        } else if (activeModal === "otherCurrency") {
          setOtherPrice(oldArray => [...oldArray, modalItem.order]);
        } else if (activeModal === "nftType") {
          setNftImageType(modalItem)
        } else if (activeModal === "royality") {
          setRoyality(modalItem)
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
          setStartTimeDate(moment(datePickerData).format("YYYY-MM-DD HH:mm:ss"))
        } else if (activeModal === "endTime") {
          setEndTimeDate(moment(datePickerData).format("YYYY-MM-DD HH:mm:ss"))
        }
        setActiveModal("")
      } else {
        setActiveModal("")
      }
    }

  }, [datePickerData])

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

  const setMainFiltersData = filters => {
    let newArray = [];
    for (let i = 0; i < filters?.length; i++) {
      let filterName = filters[i]?.filter_name;
      let filterArray = filters.filter(
        item => item.filter_name == filters[i]?.filter_name
      );
      newArray.push({ name: filterName, values: filterArray });
    }
    return newArray;
  };

  const getFiltersList = async (id) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.token}`,
      };
      const url = `${BASE_URL}/user/get-Filter-collection`;
      const dataToSend = {
        collectionId: id,
      };
      let result = await axios.post(url, dataToSend, { headers: headers });
      // console.log(result, "get filter list")
      if (result?.data?.success) {
        let returnedArr = setMainFiltersData(result?.data?.data);
        let key = 'name';
        const uniqueArr = [
          ...new Map(returnedArr.map(item => [item[key], item])).values(),
        ];
        setFilterList(uniqueArr);
      }
    } catch (err) {
      console.log('err in getFiltersList', err);
    }
    changeLoadingState(false)
  }

  const getCollectionList = async () => {
    if (data.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
      const url = `${BASE_URL}/user/view-collection`;
      const body = {
        page: 1,
        limit: 50,
        chainType: networkType.value,
        networkType: networkStatus
      };
      axios.post(url, body)
        .then(collectionList => {
          console.log(collectionList, "collection list getting")
          if (collectionList.data.success) {
            setCollectionList(collectionList.data.data)
            if (collectionList.data.data.length !== 0) {
              if (nftItem) {
                let selectedData = collectionList.data.data.find(v => v._id == nftItem.collectionId);
                setCollection(selectedData)
                getFiltersList(selectedData._id)
              } else {
                let selectedCollection = collectionList.data.data.find(o => o.chainType === networkType.value);
                let selectedData = selectedCollection ? selectedCollection : collectionList.data.data[0];
                setCollection(selectedData)
                getFiltersList(selectedData._id)
              }
            } else {
              changeLoadingState(false)
            }
          } else {
            changeLoadingState(false)
          }
        })
        .catch(e => {
          changeLoadingState(false);
          console.log(e.response, "nftlist collectionList error");
          alertWithSingleBtn(
            translate("wallet.common.alert"),
            translate("wallet.common.error.networkFailed")
          );
        })
    }
  };

  const cropImage = (res) => {
    ImagePicker.openCropper({
      path: res.path,
      width: 512,
      height: 512
    }).then(cropRes => {
      setNftImageThumb(cropRes)
    })
  }

  const onPhoto = () => {
    setImageError("")
    ImagePicker.openPicker({}).then(res => {
      if (res.size > 50457280) {
        setImageError("File size should not exceed 50MB")
      } else {
        if (res.mime.includes("image")) {

          if (res.height >= 512 && res.width >= 512) {
            let setImageTList = ImageType.filter(v => v.name !== "GIF" && v.name !== "Movie")
            setImageTypeList(setImageTList)
            setNftImageType(null);
            setNftImage(res)
            cropImage(res)
          } else {
            if (res.mime.includes("gif")) {
              let setImageTList = ImageType.filter(v => v.name !== "Art" && v.name !== "Photo" && v.name !== "Movie")
              // console.log(setImageTList, res, "aaaaaaaaaaaaa")
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
          let setImageTList = ImageType.filter(v => v.name !== "Art" && v.name !== "Photo" && v.name !== "GIF")
          setImageTypeList(setImageTList)
          setNftImageType(null);

          videoCropping(res)
        }
      }
    });
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

  const changeToggle = (v) => {
    setToggleButton(v)
    setFixedPrice("");
    setStartTimeDate("");
    setEndTimeDate("");
  }

  const uploadImageToStorage = async () => {
    if (nftItem) {
      let datares = {
        image1: nftItem.image,
        image2: nftItem.thumbnailImage
      };

      return datares;

    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      let formData = new FormData();
      formData.append('image', { uri: nftImage.path, name: nftImage.path.split("/").pop(), type: nftImage.mime });

      axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

      let responseSend = await axios.post(`${BASE_URL}/xanalia/uploadS3`, formData)
        .then(async res => {
          console.log("upload image nft", res)
          if (res.data.success) {

            let thumbnailDataFile = new FormData();
            thumbnailDataFile.append('imageName', res.data.imageName);
            if (nftImageThumb) {
              thumbnailDataFile.append('image', { uri: nftImageThumb.path, name: nftImageThumb.path.split("/").pop(), type: nftImageThumb.mime });
            } else {
              thumbnailDataFile.append('image', { uri: nftImage.path, name: nftImage.path.split("/").pop(), type: nftImage.mime });
            }

            let thumbRes = await axios.post(`${BASE_URL}/xanalia/thumbUploadS3`, thumbnailDataFile)
              .then(res2 => {
                if (res2.data.success) {
                  let datares = {
                    image1: res.data.data,
                    image2: res2.data.data
                  };
                  console.log(datares, "thumbnail url")
                  return datares;
                } else {
                  changeLoadingState(false);
                  alertWithSingleBtn(
                    translate("wallet.common.alert"),
                    translate(res.data.data)
                  );
                  return null;
                }
              })
              .catch(err => {
                errorMethod(err, "thumbnail image nft err")
                return null;
              });
              return thumbRes;
          } else {
            changeLoadingState(false);
            alertWithSingleBtn(
              translate("wallet.common.alert"),
              translate(res.data.data)
            );
            return null
          }
        })
        .catch(err => {
          errorMethod(err, "upload image nft err")
          return null;
        });
      return responseSend;
    }
  }

  const handleInfura = async (image1, image2) => {
    let dataToSend = {
      name: nftName,
      description: nftDesc,
      image: image1,
      properties: { type: nftImageType.type },
      totalSupply: nftSupply,
      thumbnft: image2,
      externalLink: nftExternalLink,
    };

    let blob = JSON.stringify(dataToSend);
    let formData = new FormData();
    formData.append('path', blob);

    let hashRes = await axios
      .post(
        "https://ipfs.infura.io:5001/api/v0/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        return response;
      })
      .catch((err) => {
        errorMethod(err, "error from infura catch")
        return null;
      });
    return hashRes
  }

  const handleCreate = async () => {
    if (data.token) {
      changeLoadingState(true);

      const imageRes = await uploadImageToStorage();
      console.log(imageRes, "imageRes--------")
      if (imageRes) {

        const infuraRes = await handleInfura(imageRes.image1, imageRes.image2);

        if (infuraRes) {
          let hashResp = infuraRes.data;
          console.log(hashResp, "infura res")
          let web3 = new Web3(providerUrl);

          let approvalCheckContract = new web3.eth.Contract(
            NftApprovalAbi,
            collection.collectionAddress
          );
          approvalCheckContract.methods
            .isApprovedForAll(wallet.address, MarketContractAddress)
            .call((err, res) => {
              console.log(res, err, "approval response")
              if (!err) {

                if (!res) {

                  setApprovalForAll(
                    wallet.address,
                    wallet.privateKey,
                    providerUrl,
                    networkType.value,
                    approvalCheckContract,
                    MarketContractAddress,
                    collection.collectionAddress
                    , 10, 6000000)
                    .then((_) => {
                      console.log(_, "__approval set__")

                      if (toggleButton == "fixPrice") {
                        putNftOnSale(hashResp);
                      } else {
                        putNftOnAuction(hashResp);
                      }

                    }).catch((err) => {
                      changeLoadingState(false);

                      alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate("wallet.common.insufficientFunds")
                      );
                    });

                } else {

                  if (toggleButton == "fixPrice") {
                    putNftOnSale(hashResp);
                  } else {
                    putNftOnAuction(hashResp);
                  }

                }

              } else {
                changeLoadingState(false);
                console.log("err in balanceOf", err);
              }
            })
        }
      }
    }
  }

  const errorMethod = (err, v) => {
    console.log(v)
    changeLoadingState(false);
    if (err.response.status === 401) {
      alertWithSingleBtn(
        translate("wallet.common.alert"),
        translate("common.sessionexpired")
      );
    }
    alertWithSingleBtn(
      translate("wallet.common.alert"),
      translate("wallet.common.error.networkFailed")
    );
  }

  const putNftOnAuction = (data) => {
    let foundOrder = basePrice.order;
    const publicAddress = wallet.address;
    const privKey = wallet.privateKey;

    let marketContractData = getMarketContract();

    let marketData = (collection && collection.collectionAddress.toLowerCase() == ERC721Address.toLowerCase()) ?
      marketContractData.marketContract.methods
        .MintAndAuctionNFT(
          publicAddress,
          data.Hash,
          ERC721Address, // xanalia collection
          marketContractData.web3.utils.toWei(fixedPrice.toString(), "ether"),
          '',
          new Date(endTimeDate).getTime() / 1000,
          (parseFloat(royality) * Math.pow(10, 1)).toString(),
          foundOrder.toString()
        ).encodeABI() :
      marketContractData.marketContract.methods
        .mintAndAuctionCollectionNFT(
          collection.collectionAddress,
          publicAddress,
          data.Hash,
          marketContractData.web3.utils.toWei(fixedPrice.toString(), "ether"),
          foundOrder.toString(),
          new Date(endTimeDate).getTime() / 1000
        )
        .encodeABI();

    let dataToAdd = {
      providerUrl,
      publicAddress,
      gasFee: 10,
      gasLimit: 6000000,
      chainType: networkType.value,
      MarketContractAddress,
      privKey,
      data: marketData
    }

    nftCallTransaction(dataToAdd)
  }

  const putNftOnSale = (data) => {

    let foundOrder = basePrice.order;
    const publicAddress = wallet.address;
    const privKey = wallet.privateKey;
    console.log(data, "put nft on sale")

    let currencyListArr = otherPrice.map(i => Number(i));

    let marketContractData = getMarketContract();

    let marketData = (collection && collection.collectionAddress.toLowerCase() == ERC721Address.toLowerCase()) ?
      marketContractData.marketContract.methods
        .MintAndSellNFT(
          publicAddress,
          data.Hash,
          marketContractData.web3.utils.toWei(fixedPrice.toString(), "ether"),
          '',
          (parseFloat(royality) * Math.pow(10, 1)).toString(),
          foundOrder.toString(),
          currencyListArr
        ).encodeABI() :
      marketContractData.marketContract.methods
        .mintAndSellCollectionNFT(
          collection.collectionAddress,
          publicAddress,
          data.Hash,
          marketContractData.web3.utils.toWei(fixedPrice.toString(), "ether"),
          foundOrder.toString(),
          currencyListArr
        )
        .encodeABI();

    let dataToAdd = {
      providerUrl,
      publicAddress,
      gasFee: 10,
      gasLimit: 6000000,
      chainType: networkType.value,
      MarketContractAddress,
      privKey,
      data: marketData
    }

    nftCallTransaction(dataToAdd)
  }

  const nftCallTransaction = (data) => {
    nftMakingMethods(data)
      .then((transRes) => {
        if (transRes.success) {
          if (nftItem) {

            let changeStatusData = {
              collectionId: nftItem.collectionId,
              nftDraftId: nftItem._id,
              transctionHash: transRes.data.transactionHash,
              chainType: networkType.value
            };
            console.log(changeStatusData, "changeStatusData")
            let url = `${BASE_URL}/user/change-status-draft`
            axios.defaults.headers.post['Content-Type'] = 'application/json';

            axios.post(url, changeStatusData)
              .then(res => {
                changeLoadingState(false);
                console.log(res, "__draft status updated__")

              })
              .catch(err => {
                errorMethod(err, "error from delete draft catch")
              });
          } else {
            changeLoadingState(false);
          }
          cleanAll();
          switchToNFTList("mint", collection)
        } else {
          changeLoadingState(false);

        }

      }).catch((err) => {
        changeLoadingState(false);

        alertWithSingleBtn(
          translate("wallet.common.alert"),
          translate("wallet.common.insufficientFunds")
        );
      });
  }

  const getMarketContract = () => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        providerUrl
      )
    );

    let marketContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress
    );

    return { marketContract, web3 }
  }

  const saveDraft = async () => {
    if (data.token) {
      changeLoadingState(true);

      const imageRes = await uploadImageToStorage();
      if (imageRes) {
        saveDraftToDatabase(imageRes.image1, imageRes.image2)
      }

    }
  }

  const saveDraftToDatabase = (res, res2) => {
    let dataToSend = {
      collectionId: collection._id,
      name: nftName,
      description: nftDesc,
      image: res,
      thumbnailImage: res2,
      properties: { type: nftImageType.type },
      salesType: toggleButton,
      minPrice: fixedPrice,
      startTime:
        toggleButton == 'timeAuction'
          ? startTimeDate
          : '',
      endTime:
        toggleButton == 'timeAuction'
          ? endTimeDate
          : '',
      acceptCoins: otherPrice,
      basePrice: basePrice.name,
      chainType: networkType.value,
    };

    let url;

    if (nftItem) {
      dataToSend.requestId = nftItem._id,
        url = `${BASE_URL}/user/edit-nft-draft`
    } else {
      url = `${BASE_URL}/user/create-nft-draft`
    }

    axios.defaults.headers.post['Content-Type'] = 'application/json';

    axios.post(url, dataToSend)
      .then(draftRes => {

        console.log(draftRes, "draftRes")

        if (draftRes.data.success) {
          cleanAll();
          switchToNFTList("draft", collection)
        }
        changeLoadingState(false);

      })
      .catch(err => {
        errorMethod(err, "error from infura catch")
      });
  }

  let disableBtn = collection && nftName && nftDesc && nftImageType &&
    nftImage && basePrice &&
    (toggleButton == "timeAuction" ? (startTimeDate && endTimeDate && fixedPrice) : fixedPrice) &&
    networkType;

  let networkTypeStatus = networkType.value.toLowerCase() == "binance" ?
    translate("common.BinanceNtwk") : networkType.value.toLowerCase() == "polygon" ?
      translate("common.polygon") : translate("common.ethereum");

  let draftBtnD = (collection && (collection.collectionAddress.toLowerCase() == ERC721Address.toLowerCase()) || collection && collection.collectionName === "Xanalia (ETH)") || !disableBtn;
  return (
    <View style={styles.childCont}>
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView extraScrollHeight={hp('2%')}>

          <CardCont style={styles.imageMainCard}>
            <TouchableOpacity onPress={!nftItem ? (nftImage ? nftImage.mime.includes("image") ? onPhoto : null : onPhoto) : null} activeOpacity={0.5} style={styles.cardImageCont}>
              {
                nftImage ?
                  nftImage.mime.includes("image") ?
                    <Image
                      style={styles.completeImage}
                      source={{ uri: nftImage.path }}
                    /> :
                    <Video
                      source={{ uri: nftImage.path }}
                      style={styles.completeImage}
                      resizeMode="contain"
                    />
                  :
                  <Image
                    style={styles.completeImage}
                    source={IMAGES.imagePlaceholder}
                  />
              }
            </TouchableOpacity>
            <View style={styles.cardDesCont} >
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
                        <View style={{ flexDirection: "row", marginTop: hp(2) }} >
                          <View style={styles.thumbNail} >
                            <Image source={nftImageThumb ? { uri: nftImageThumb.path } : IMAGES.imagePlaceholder} style={styles.completeImage} />
                          </View>
                          <View style={{ flex: 1, justifyContent: "center" }} >
                            <TouchableOpacity onPress={() => {
                              nftImage ? nftImage.mime.includes("image") ?
                                cropImage(nftImage) :
                                videoCropping(nftImage)
                                : null
                            }} >
                              <Text
                                style={[
                                  styles.bannerDes,
                                  styles.thumbnailEditButton
                                ]}>
                                {translate("common.EditTrim")}
                              </Text>
                            </TouchableOpacity>
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
              inputProps={{ value: collection ? collection.collectionName : "" }}
              onPress={() => {
                setActiveModal("collection")
                showModal({ data: collectionList, title: translate("wallet.common.collectionList"), itemToRender: "collectionName" })
              }}
              showRight
              pressable />
            <CardLabel>{translate("wallet.common.description")}</CardLabel>
            <Text style={styles.cardfieldCount}>{nftDesc.length} / 150</Text>
            <CardField
              inputProps={{
                placeholder: translate("wallet.common.typeSomething"),
                multiline: true,
                value: nftDesc,
                onChangeText: e => nftDesc.length <= 150 ? setNftDesc(e.slice(0, 150)) : null
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
                showModal({ data: PriceUnits[networkType.value], title: translate("wallet.common.selectBasePrice"), itemToRender: "name" })
              }}
              pressable
              showRight
            />
            {
              toggleButton !== "timeAuction" ?
                <>
                  <CardLabel>{translate("wallet.common.alsoPay")}</CardLabel>
                  <CardField
                    inputProps={{ value: translate("wallet.common.selectCurrency") }}
                    onPress={() => {
                      setActiveModal("otherCurrency")
                      let priceList = [...PriceUnits[networkType.value]];

                      if (otherPrice.length !== 0) {
                        priceList = priceList.filter((res1) => !otherPrice.find(res2 => res2 === res1.order))
                      }
                      showModal({ data: priceList, title: translate("wallet.common.selectCurrency"), itemToRender: "name" })
                    }}
                    pressable
                    showRight
                  />
                  {otherPrice.length !== 0 ?
                    <View style={styles.tagCont} >

                      {
                        otherPrice.map((v, i) => {
                          let priceObj = PriceUnits[networkType.value].find(x => x.order === v);
                          if (networkType.value !== 'ethereum') {
                            if (priceObj.order === "0") {
                              return (
                                <CardButton
                                  border={colors.BLUE6}
                                  key={i}
                                  disable
                                  buttonCont={[styles.tagItems]}
                                  label={priceObj.name}
                                />
                              )
                            }
                          }

                          return (
                            <View
                              key={i}
                            >
                              <CardButton
                                onPress={() => {
                                  const removeItem = otherPrice.filter((res) => {
                                    return res !== v;
                                  });
                                  setOtherPrice(removeItem)
                                }}
                                border={colors.BLUE6}
                                buttonCont={styles.tagItems}
                                label={priceObj.name}
                              />
                              <MaterialIcon style={styles.negIcon} name="remove-circle-outline" />
                            </View>
                          )
                        })
                      }

                    </View> : null}
                </> : null
            }
          </CardCont>

          <CardCont>
            <CardLabel>{translate("wallet.common.nftType")}</CardLabel>
            <CardField
              inputProps={{ value: nftImageType ? (nftImageType.hasOwnProperty("code") ? translate(nftImageType.code) : nftImageType.name) : translate("common.type") }}
              onPress={() => {
                setActiveModal("nftType")
                showModal({ data: imageTypeList, title: translate("wallet.common.nftType"), itemToRender: "name", translate: "code" })
              }}
              pressable
              showRight />
            {
              collection && collection.collectionAddress.toLowerCase() == ERC721Address.toLowerCase() ?
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
                </>
                : null
            }
            {
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
                          showModal({ data: fList?.values, title: fList.name, itemToRender: "filter_value" })
                        }}
                        pressable
                        showRight />
                    }
                  </View>
                )
              })
            }

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
                      onChangeText: v => setFixedPrice(v),
                      keyboardType: "decimal-pad"
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
                  <CardLabel >{translate("wallet.common.auctionTime")}</CardLabel>
                  <CardLabel style={{ fontFamily: fonts.PINGfANG }} >{translate("wallet.common.openTime")}</CardLabel>
                  <CardField
                    inputProps={{ value: startTimeDate }}
                    onPress={() => {
                      setActiveModal("startTime")
                      setEndTimeDate("")
                      datePickerPress(new Date())
                    }}
                    pressable
                    showRight />
                  <CardLabel style={{ fontFamily: fonts.PINGfANG }} >{translate("wallet.common.closeTime")}</CardLabel>
                  <CardField
                    inputProps={{ value: endTimeDate }}
                    onPress={() => {
                      setActiveModal("endTime")
                      datePickerPress(startTimeDate ? new Date(startTimeDate) : new Date())
                    }}
                    pressable
                    showRight />
                  <CardField
                    contStyle={{ paddingRight: 0 }}
                    inputProps={{
                      value: fixedPrice,
                      onChangeText: v => setFixedPrice(v),
                      keyboardType: 'number-pad'
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
              onPress={() => nftItem ? saveDraftToDatabase(nftItem.image, nftItem.thumbnailImage) : saveDraft()}
              label={nftItem ? translate("wallet.common.edit") : translate("wallet.common.saveAsDraft")}
              buttonCont={{
                width: '48%',
                backgroundColor: draftBtnD ? '#rgba(59,125,221,0.5)' : colors.BLUE6
              }}
              disable={draftBtnD}
            />
            <CardButton
              onPress={handleCreate}
              border={colors.BLUE6}
              disable={!disableBtn}
              border={!disableBtn ? '#rgba(59,125,221,0.5)' : colors.BLUE6}
              buttonCont={{ width: '48%' }}
              label={translate("wallet.common.upload")}
            />
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
};

export default UploadNFT;