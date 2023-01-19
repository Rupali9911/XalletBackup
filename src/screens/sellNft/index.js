import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { AppHeader } from '../../components';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import Separator from '../../components/separator';
import { FONTS } from '../../constants';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { hp, RF, wp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { amountValidation, translate } from '../../walletUtils';
import { basePriceTokens } from '../../web3/config/availableTokens';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import { networkType } from '../../web3/config/networkType';
import { sellNFT, setApprovalForAll } from '../wallet/functions';
import { modalAlert } from '../../common/function';

const Web3 = require('web3');

const FIXED_PRICE = 1;
const AUCTION = 2;

const SellNFT = ({ route, navigation }) => {

    const { nftDetail } = route.params;

    const { wallet, userData } = useSelector(state => state.UserReducer);
    const [sellFormat, setSellFormat] = useState(FIXED_PRICE);
    const [baseCurrency, setBaseCurrency] = useState(null);
    const [price, setPrice] = useState('');
    const [allowedTokens, setAllowedTokens] = useState([]);
    const [loading, setLoading] = useState(false);

    //#region SmartContract
    let MarketPlaceAbi = '';
    let MarketContractAddress = '';

    let AwardAbi = '';
    let AwardContractAddress = '';
    let ApproveAbi = '';
    let ApproveAdd = '';
    let providerUrl = '';
    let ERC721Abi = '';
    let ERC721Address = '';
    let NftApprovalAbi = '';

    walletAddressForNonCrypto =
        networkType === 'testnet'
            ? nftDetail.nftChain === 'binance'
                ? '0x61598488ccD8cb5114Df579e3E0c5F19Fdd6b3Af'
                : '0x9b6D7b08460e3c2a1f4DFF3B2881a854b4f3b859'
            : '0xac940124f5f3b56b0c298cca8e9e098c2cccae2e';

    let params = nftDetail.collectionAdd.toString().split('-');
    let _tokenId = params.length > 2 ? params[2] : params.length > 1 ? params[1] : params[0];
    let chainType = params.length > 1 ? params[0] : 'binance';
    let collectionAddress = params.length > 2 ? params[1] : null;

    if (chainType === 'polygon') {
        MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
        MarketContractAddress = blockChainConfig[1].marketConConfig.add;
        providerUrl = blockChainConfig[1].providerUrl;
        ERC721Abi = blockChainConfig[1].erc721ConConfig.abi;
        ERC721Address = blockChainConfig[1].erc721ConConfig.add;
        collectionAddress = collectionAddress || blockChainConfig[1].erc721ConConfig.add;
        NftApprovalAbi = blockChainConfig[1].nftApprovalConConfig.abi
    } else if (chainType === 'binance') {
        MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
        MarketContractAddress = blockChainConfig[0].marketConConfig.add;
        providerUrl = blockChainConfig[0].providerUrl;
        ERC721Abi = blockChainConfig[0].erc721ConConfig.abi;
        ERC721Address = blockChainConfig[0].erc721ConConfig.add;
        collectionAddress = collectionAddress || blockChainConfig[0].erc721ConConfig.add;
        NftApprovalAbi = blockChainConfig[0].nftApprovalConConfig.abi
    } else if (chainType === 'ethereum') {
        MarketPlaceAbi = blockChainConfig[2].marketConConfig.abi;
        MarketContractAddress = blockChainConfig[2].marketConConfig.add;
        providerUrl = blockChainConfig[2].providerUrl;
        ERC721Abi = blockChainConfig[2].erc721ConConfig.abi;
        ERC721Address = blockChainConfig[2].erc721ConConfig.add;
        collectionAddress = collectionAddress || blockChainConfig[2].erc721ConConfig.add;
        NftApprovalAbi = blockChainConfig[2].nftApprovalConConfig.abi
    }
    //#endregion

    const checkForApproval = async (id, price) => {
        // let availability = await checkAvailabilityOnChain(
        //   sessionStorage.getItem("selectedNFTChain"),
        //   this?.props?.intl.formatMessage,
        //   true
        // );
        // if (!availability) {
        //   return;
        // }
        // this.props.setTransactionInProgress(false);
        // this.setState({ loaderFor });
        setLoading(true);
        let web3 = new Web3(providerUrl);

        let approvalCheckContract = new web3.eth.Contract(
            NftApprovalAbi,
            nftDetail.collection
        );
        approvalCheckContract.methods
            .isApprovedForAll(wallet?.address, MarketContractAddress)
            .call((err, res) => {
                console.log("res", res, "err", err);
                if (!err) {
                    // console.log(parseInt(res) / Math.pow(10, 18));
                    if (!res) {
                        setApprovalForAll(wallet?.address, wallet.privateKey, providerUrl, chainType, approvalCheckContract, MarketContractAddress, collectionAddress, 10, 600000)
                            .then((_) => {
                                if (sellFormat === AUCTION) {
                                    // setNFTAuction();
                                } else {
                                    sellNFTItem(id, price);
                                }
                            }).catch((err) => {
                                console.log(err)
                                setLoading(false);
                            });
                    } else {
                        if (sellFormat === AUCTION) {
                            // setNFTAuction();
                        } else {
                            sellNFTItem(id, price);
                        }
                    }
                } else {
                    console.log("err in balanceOf", err);
                    setLoading(false);
                }
            });
    }

    const sellNFTItem = async (id, price) => {
        // console.log(this.state.allowedCurrency);
        //validation of input
        // if (
        //   this.props.metaMaskAddress &&
        //   (!this.state.price ||
        //     this.state.price === "0" ||
        //     !this.state.baseCurrency ||
        //     !this.state.allowedCurrency ||
        //     (this.state.allowedCurrency && this.state.allowedCurrency.length === 0))
        // ) {
        //   this.setState({ loaderFor: "", setSalePrice: false });
        //   this.props.setTransactionInProgress(false);
        //   return;
        // }

        // if (
        //   !this.state.price ||
        //   this.state.price === "0" ||
        //   !this.state.baseCurrency
        // ) {
        //   this.setState({ loaderFor: "", setSalePrice: false });
        //   this.props.setTransactionInProgress(false);
        //   return;
        // }

        // const historyInfo = this.props?.history?.location?.state;

        // let priceValue, priceValueDollar;
        // if (this.state.currency.value === "alia") {
        //   priceValue = document.getElementById("sellingPrice").value;
        //   priceValueDollar = "0";
        // } else if (this.state.currency.value === "dollar") {
        //   priceValueDollar = document.getElementById("sellingPrice").value;
        //   priceValue = "0";
        // }

        // if (historyInfo?.user !== "Non-crypto") {
        if (wallet?.address) {
            //   let allowedCurrencies = this.state.allowedCurrency.map(
            //     (item) => item.order
            //   );
            let web3 = new Web3(providerUrl);
            let MarketPlaceContract = new web3.eth.Contract(
                MarketPlaceAbi,
                MarketContractAddress
            );

            sellNFT(wallet.address, wallet.privateKey, providerUrl, chainType, MarketPlaceContract, MarketContractAddress, id, collectionAddress, price, baseCurrency.order, allowedTokens, 10, 600000)
                .then((res) => {
                    setLoading(false);
                    if (res.success) {
                        console.log('sold');
                        navigation.goBack();
                    }
                }).catch((err) => {
                    console.log('sellNFT error', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            //   this.setState({ loaderFor: "Sell" });
            //   let web3 = new Web3(this.props.provider);
            //   const userToken = localStorage.getItem("userToken");
            //   const priceUser = web3.utils.toWei(price.toString(), "ether");
            //   const headers = {
            //     "Content-Type": "application/json",
            //     Authorization: `Bearer ${userToken}`,
            //   };
            //   const info = {
            //     tokenId: historyInfo?.selectedNFT?.collectionAdd,
            //     price: web3.utils.toWei(priceValue.toString(), "ether"),
            //     // priceDollar: web3.utils.toWei(priceValueDollar.toString(), "ether"),
            //     chainType: sessionStorage.getItem("selectedNFTChain"),
            //     currencyType: this.state.baseCurrency.order,
            //   };
            //   let url =
            //     networkType === "testnet"
            //       ? process.env.REACT_APP_API_NON_CRYPTO
            //       : process.env.REACT_APP_API_NON_CRYPTO_MAINNET;

            //   axios
            //     .post(url + "/user/sell-nft", info, {
            //       headers: headers,
            //     })
            //     .then((res) => {
            //       if (!res.data.success && !res.data.whitelisted) {
            //         toast.info("You are not allowed to put nft on sell for now", {
            //           position: "bottom-right",
            //           autoClose: 3000,
            //           progress: undefined,
            //         });
            //         this.setState({ loaderFor: "", setSalePrice: false });
            //         this.setState({ status: res?.status });
            //       } else {
            //         this.setTimer(res.data.data.data);
            //       }
            //     })
            //     .catch((err) => {
            //       this.setState({ loaderFor: "" });
            //       this.setState({ status: err?.response?.status });
            //     });
        }
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader
                title={''}
                showBackButton
            />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.heading}>{translate("common.selectYourSellMethod")}</Text>

                    <ToggleState activeState={sellFormat} onChange={setSellFormat} />

                    <SelectToken
                        tokens={basePriceTokens.filter(_ => _.chain == chainType)}
                        onChangeValue={(value) => {
                            let baseCurrency = basePriceTokens.find(_ => _.chain == chainType && _.key == value);
                            if (baseCurrency) {
                                setBaseCurrency(baseCurrency);
                            } else {
                                setBaseCurrency(null);
                            }
                        }}
                    />

                    <PaymentField
                        value={price}
                        onChangeText={(e) => {
                            let value = amountValidation(e, price);
                            if (value) {
                                setPrice(value);
                            } else {
                                setPrice('');
                            }
                        }} />

                    <PayableIn
                        tokens={basePriceTokens.filter(_ => _.chain == chainType)}
                        onChangeValue={(value) => {
                            let allowedTokens = basePriceTokens.filter(_ => _.chain == chainType && value.includes(_.key));
                            if (allowedTokens.length > 0) {
                                let allowed = [];
                                allowedTokens.map((item) => {
                                    allowed.push(item.order);
                                });
                                setAllowedTokens(allowed);
                            } else {
                                setBaseCurrency([]);
                            }
                        }} />

                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTxt}>{translate("common.summary")}</Text>
                        <Separator style={styles.separator} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={[styles.summaryTxt, { fontSize: RF(2) }]}>{translate("common.bounties")}</Text>
                            <Text style={styles.comingsoon}>{translate("common.comingSoon")}</Text>
                        </View>
                        <Text style={styles.desc}>{translate("common.xanaliaReward")}</Text>

                        <Separator style={styles.separator} />

                        <View style={{ marginTop: hp("1%"), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={[styles.summaryTxt, { fontSize: RF(2) }]}>{translate("common.fees")}</Text>
                        </View>
                        <Text style={[styles.desc, { marginBottom: hp("2%") }]}>{translate("common.listingIsFree")}</Text>

                        <View style={styles.chargesRow}>
                            <Text style={styles.desc}>{translate("common.toText")}</Text>
                            <Text style={styles.desc}>2.5%</Text>
                        </View>

                        <View style={styles.chargesRow}>
                            <Text style={styles.desc}>{translate("common.cpyrightholder")}</Text>
                            <Text style={styles.desc}>2.5%</Text>
                        </View>

                        <View style={[styles.chargesRow, { marginBottom: 0 }]}>
                            <Text style={[styles.desc, { fontFamily: Fonts.ARIAL_BOLD }]}>{translate("common.total")}</Text>
                            <Text style={[styles.desc, { fontFamily: Fonts.ARIAL_BOLD }]}>2.5%</Text>
                        </View>

                        <Separator style={styles.separator} />

                        <Text style={[styles.summaryTxt, { fontSize: RF(2) }]}>{translate("common.listing")}</Text>

                        <TouchableOpacity style={styles.saleButton} onPress={() => {
                            console.log(baseCurrency, price);
                            if (baseCurrency == null) {
                                modalAlert('', 'Please select Token');
                            } else if (price == '' || parseFloat(`${price}`) <= 0) {
                                modalAlert('', 'Please enter price');
                            } else {
                                checkForApproval(nftDetail.id, price);
                            }
                        }}>
                            <Text style={styles.saleButtonTxt}>{translate("common.postYourListing")}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </AppBackground>
    )
}

const ToggleState = (props) => {
    const { activeState, onChange } = props;

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={activeState == FIXED_PRICE ? styles.button : styles.outLineButton} onPress={() => onChange(FIXED_PRICE)}>
                <Text style={[activeState == FIXED_PRICE ? CommonStyles.buttonLabel : CommonStyles.outlineButtonLabel, { fontSize: RF(2) }]}>
                    {translate("common.fixedPrice")}
                </Text>
                <Text style={[activeState == FIXED_PRICE ? CommonStyles.buttonLabel : CommonStyles.outlineButtonLabel, { fontSize: RF(1.5) }]}>
                    {translate("common.sellAtAfixe")}
                </Text>
            </TouchableOpacity>
            <View style={{ flex: 0.1 }} />
            <TouchableOpacity disabled style={activeState == AUCTION ? styles.button : styles.outLineButton} onPress={() => onChange(AUCTION)}>
                <Text style={activeState == AUCTION ? CommonStyles.buttonLabel : CommonStyles.outlineButtonLabel}>
                    {translate("common.auctionnew")}
                </Text>
                <Text style={activeState == AUCTION ? CommonStyles.buttonLabel : CommonStyles.outlineButtonLabel}>
                    {translate("common.auctionToHighest")}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const SelectToken = (props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(props.tokens || []);

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            schema={{
                label: 'name',
                value: 'key'
            }}
            zIndex={5001}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={props.onChangeValue}
            closeAfterSelecting={true}
            style={styles.tokenPicker}
            dropDownContainerStyle={styles.dropDownContainer}
            placeholder={"Select token"}
        />
    );
}

const PayableIn = (props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState(props.tokens || []);

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            schema={{
                label: 'name',
                value: 'key'
            }}
            multiple={true}
            min={0}
            mode={'BADGE'}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={props.onChangeValue}
            closeAfterSelecting={true}
            style={styles.tokenPicker}
            dropDownContainerStyle={styles.dropDownContainer}
            placeholder={"Payable in"}
        />
    );
}

const PaymentField = (props) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.paymentField, { fontSize: RF(2) }]}
                keyboardType='decimal-pad'
                placeholder={translate("common.enterNewPrice")}
                placeholderTextColor={Colors.topUpPlaceholder}
                returnKeyType="done"
                value={props.value}
                onChangeText={props.onChangeText}
                onSubmitEditing={props.onSubmitEditing}
                editable={props.editable}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1
    },
    container: {
        paddingHorizontal: wp("3%"),
    },
    heading: {
        fontSize: RF(3),
    },
    button: {
        // width: '80%',
        flex: 1,
        backgroundColor: Colors.themeColor,
        alignItems: 'center',
        borderRadius: wp("1%"),
        paddingVertical: wp("1%")
    },
    outLineButton: {
        // width: '80%',
        flex: 1,
        alignItems: 'center',
        borderColor: Colors.lightBorder,
        borderWidth: 1,
        borderRadius: wp("1%"),
        paddingVertical: wp("1%"),

    },
    buttonContainer: {
        // flex: 1,
        flexDirection: 'row',
        marginVertical: hp("3%"),
        // paddingHorizontal: wp("2%"),
        justifyContent: 'space-around'
    },
    tokenPicker: {
        borderColor: Colors.themeColor,
        borderRadius: 5
    },
    dropDownContainer: {
        borderColor: Colors.themeColor,
        borderRadius: 5
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.themeColor,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: hp("1%")
    },
    paymentField: {
        paddingHorizontal: wp("2.5%"),
        ...CommonStyles.text(FONTS.ARIAL, Colors.black, RF(1.6)),
        flex: 1,
        height: hp("5%")
    },
    summaryContainer: {
        borderColor: Colors.themeColor,
        borderWidth: 1,
        borderRadius: wp("5%"),
        padding: wp("2%"),
        marginVertical: hp("2%")
    },
    summaryTxt: {
        fontSize: RF(2.5),
        fontFamily: Fonts.ARIAL_BOLD
    },
    separator: {
        marginVertical: hp("2%")
    },
    comingsoon: {
        borderWidth: 1,
        borderColor: Colors.separatorText,
        borderStyle: 'dashed',
        borderRadius: 5,
        paddingHorizontal: wp("2%"),
    },
    chargesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: hp("1%")
    },
    desc: {
        fontSize: RF(1.8),
        fontFamily: Fonts.ARIAL
    },
    saleButton: {
        backgroundColor: Colors.themeColor,
        alignItems: 'center',
        borderRadius: wp("1%"),
        alignSelf: 'baseline',
        padding: wp("2%"),
        marginVertical: hp("1%")
    },
    saleButtonTxt: {
        color: Colors.white
    }
});

export default SellNFT
