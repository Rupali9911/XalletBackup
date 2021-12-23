import React, { useEffect, useRef, useState } from 'react';
import {
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Video from 'react-native-fast-video';
import { Row, Rows, Table } from 'react-native-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { IMAGES, SIZE, SVGS } from 'src/constants';
import details from '../../../assets/images/details.png';
import grid from '../../../assets/images/grid.png';
import history from '../../../assets/images/history.png';
import trading from '../../../assets/images/trading.png';
import { networkType } from '../../common/networkType';
import { AppHeader, C_Image, GroupButton } from '../../components';
import AppModal from '../../components/appModal';
import TextView from '../../components/appText';
import NFTDetailDropdown from '../../components/NFTDetailDropdown';
// import Video from 'react-native-video';

import { translate } from '../../walletUtils';
import { blockChainConfig, CDN_LINK } from '../../web3/config/blockChainConfig';
import PaymentMethod from '../../components/PaymentMethod';
import PaymentNow from '../../components/PaymentMethod/payNowModal';
import SuccessModalContent from '../../components/successModal';
import Colors from '../../constants/Colors';
import { hp } from '../../constants/responsiveFunct';
import {
	getAllCards,
	setPaymentObject,
} from '../../store/reducer/paymentReducer';
import { divideNo } from '../../utils';
import styles from './styles';
import { basePriceTokens } from '../../web3/config/availableTokens';
import { BASE_URL } from '../../common/constants';
import { useIsFocused } from '@react-navigation/native';

const { PlayButtonIcon, GIRL } = SVGS;

const Web3 = require('web3');

let walletAddressForNonCrypto = '';

const DetailScreen = ({ route, navigation }) => {
	const dispatch = useDispatch();
	const { paymentObject } = useSelector(state => state.PaymentReducer);
	const { data, wallet } = useSelector(state => state.UserReducer);
	const isFocused = useIsFocused();

	const refVideo = useRef(null);
	const [isPlay, setPlay] = useState(false);
	const {
		id,
		name,
		description,
		owner,
		ownerImage,
		creator,
		creatorImage,
		thumbnailUrl,
		video,
		fileType,
		price,
		chain,
		ownerId,
		tokenId,
		artistId,
	} = route.params;
	const [showPaymentMethod, setShowPaymentMethod] = useState(false);
	const [showPaymentNow, setShowPaymentNow] = useState(false);
	const [isContractOwner, setIsContractOwner] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [isNFTOnAuction, setIsNFTOnAuction] = useState(false);
	const [singleNFT, setSingleNFT] = useState({});
	const [nonCryptoOwnerId, setNonCryptoOwnerId] = useState('');
	const [nonCryptoOwner, setNonCryptoOwner] = useState(false);
	const [successModalVisible, setSuccessModalVisible] = useState(false);
	const [lastBidAmount, setLastBidAmount] = useState('');
	const [priceNFT, setPriceNFT] = useState('');
	const [priceNFTString, setPriceNFTString] = useState("");
	const [auctionInitiatorAdd, setAuctionInitiatorAdd] = useState('');
	const [auctionSTime, setAuctionSTime] = useState('');
	const [auctionETime, setAuctionETime] = useState('');
	const [highestBidderAdd, setHighestBidderAdd] = useState("");
	const [minBidPrice, setMinBidPrice] = useState('');
	const [connectedWithTo, setConnectedWithTo] = useState('');
	const [buyLoading, setBuyLoading] = useState(false);
	const [availableTokens, setAvailableTokens] = useState([]);
	const [creatorAddress, setCreatorAddress] = useState(null);
	const [ownerAddress, setOwnerAddress] = useState('');
	const [nftID, setNftID] = useState("");
	const [artistAddress, setArtistAddress] = useState(null);
	const [isForAward, setIsForAward] = useState(false);
	const [baseCurrency, setBaseCurrency] = useState('');
	const [bidPriceInDollar, setBidPriceInDollar] = useState('');
	const [discount, setDiscount] = useState(false);
	const [discountValue, setDiscountValue] = useState('');
	const [priceInDollar, setPriceInDollar] = useState('');
	const [tableHead, setTableHead] = useState([
		'Price',
		'From',
		'To',
		'Date (DD/MM/YYYY)',
	]);
	const [tradingTableHead, setTradingTableHead] = useState([
		'Event',
		'Price',
		'From',
		'To',
		'Date (DD/MM/YYYY)',
	]);
	const [tableData, setTableData] = useState([
		['1', '2', '3', '4'],
		['a', 'b', 'c', 'd'],
		['1', '2', '3', '4'],
		['a', 'b', 'c', 'd'],
	]);
	const [tradingTableData, setTradingTableData] = useState([
		['1', '2', '3', '4', '5'],
		['a', 'b', 'c', 'd', 'e'],
		['1', '2', '3', '4', '5'],
		['a', 'b', 'c', 'd', 'e'],
	]);
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

	walletAddressForNonCrypto =
		networkType === 'testnet'
			? chain === 'binance'
				? '0x61598488ccD8cb5114Df579e3E0c5F19Fdd6b3Af'
				: '0x9b6D7b08460e3c2a1f4DFF3B2881a854b4f3b859'
			: '0xac940124f5f3b56b0c298cca8e9e098c2cccae2e';

	let params = tokenId.toString().split('-');
	let _tokenId = params.length > 2 ? params[2] : params.length > 1 ? params[1] : params[0];
	let chainType = params.length > 1 ? params[0] : 'binance';
	let collectionAddress = params.length > 2 ? params[1] : null;

	// console.log('params:', params, ', tokenId:', _tokenId, ', collectionAddresss', collectionAddress);
	if (chainType === 'polygon') {
		MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
		MarketContractAddress = blockChainConfig[1].marketConConfig.add;
		providerUrl = blockChainConfig[1].providerUrl;
		ERC721Abi = blockChainConfig[1].erc721ConConfig.abi;
		ERC721Address = blockChainConfig[1].erc721ConConfig.add;
		collectionAddress = collectionAddress || blockChainConfig[1].erc721ConConfig.add;
	} else if (chainType === 'binance') {
		MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
		MarketContractAddress = blockChainConfig[0].marketConConfig.add;
		providerUrl = blockChainConfig[0].providerUrl;
		ERC721Abi = blockChainConfig[0].erc721ConConfig.abi;
		ERC721Address = blockChainConfig[0].erc721ConConfig.add;
		collectionAddress = collectionAddress || blockChainConfig[0].erc721ConConfig.add;
	} else if (chainType === 'ethereum') {
		MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
		MarketContractAddress = blockChainConfig[2].marketConConfig.add;
		providerUrl = blockChainConfig[2].providerUrl;
		ERC721Abi = blockChainConfig[2].erc721ConConfig.abi;
		ERC721Address = blockChainConfig[2].erc721ConConfig.add;
		collectionAddress = collectionAddress || blockChainConfig[2].erc721ConConfig.add;
	}
	//#endregion

	useEffect(() => {
		if (isFocused) {
			console.log('tokenId', tokenId);
			if (MarketPlaceAbi && MarketContractAddress && collectionAddress) {
				setBuyLoading(true);
				//   checkNFTOnAuction();
				getNonCryptoNFTOwner();
			}

			if (data.token) {
				dispatch(getAllCards(data.token)).then(() => {
				}).catch((err) => {
					console.log('error====', err);
				});
			}
		}
	}, [isFocused]);

	useEffect(() => {
		if (paymentObject) {
			setShowPaymentNow(true);
		}
	}, [paymentObject]);

	const checkNFTOnAuction = () => {
		const setAuctionVariables = (
			auctionInitiatorAdd = '',
			auctionETime = '',
			lastBidAmount = '',
			isNFTOnAuction = false,
		) => {
			setIsNFTOnAuction(isNFTOnAuction);
			setAuctionInitiatorAdd(auctionInitiatorAdd);
			setAuctionETime(auctionETime);
			setLastBidAmount(lastBidAmount);
		};

		let web3 = new Web3(providerUrl);
		let MarketPlaceContract = new web3.eth.Contract(
			MarketPlaceAbi,
			MarketContractAddress,
		);
		MarketPlaceContract.methods.getSellDetail(collectionAddress, _tokenId).call(async (err, res) => {
			console.log('checkNFTOnAuction_res', res);
			if (!err) {
				let baseCurrency = [];
				if (res[6]) {
					baseCurrency = basePriceTokens.filter(
						(token) => token.chain === chainType && token.order === 1
					);
					setBaseCurrency(baseCurrency[0]);
					console.log('baseCurrency________', baseCurrency[0]);
				} else {
					baseCurrency = basePriceTokens.filter(
						(token) =>
							token.chain === chainType &&
							token.order === parseInt(res[7])
					);
					setBaseCurrency(baseCurrency[0]);
					console.log('baseCurrency________', baseCurrency[0]);
				}

				if (res[0] !== "0x0000000000000000000000000000000000000000") {
					let dollarToken = basePriceTokens.filter(
						(token) =>
							token.chain === chainType &&
							token.dollarCurrency
					);
					let rs = await calculatePrice(
						res[1],
						dollarToken[0].order,
						// this.state.nonCryptoOwnerId
						walletAddressForNonCrypto,
						baseCurrency[0]
					);
					console.log('rs', rs);
					if (rs) {
						let res = divideNo(rs);
						setPriceInDollar(res);
					}
				}

				if (parseInt(res[5]) * 1000 > 0) {
					setAuctionVariables(
						res[0],
						parseInt(res[2]) * 1000,
						divideNo(res[1]),
						true,
					);
				} else {
					setAuctionVariables();
				}
			} else {
				setAuctionVariables();
			}
		});
	};

	const getNonCryptoNFTOwner = () => {
		// let tokenId = "317";
		let web3 = new Web3(providerUrl);
		let MarketPlaceContract = new web3.eth.Contract(
			MarketPlaceAbi,
			MarketContractAddress,
		);
		MarketPlaceContract.methods
			.getNonCryptoOwner(collectionAddress, _tokenId)
			.call(async (err, res) => {
				console.log('getNonCryptoOwner_res', res);
				if (res) {
					setNonCryptoOwnerId(res);
					lastOwnerOfNFTNonCrypto(res);
					await getTokenDetailsApi(false);
				} else if (!res) {
					lastOwnerOfNFT();
					await getTokenDetailsApi();
				} else if (err) {
				}
			});
	};

	const lastOwnerOfNFTNonCrypto = (nonCryptoOwner) => {
		let _data = singleNFT;
		let web3 = new Web3(providerUrl);
		let ERC721Contract = new web3.eth.Contract(
			ERC721Abi,
			collectionAddress
		);

		let MarketPlaceContract = new web3.eth.Contract(
			MarketPlaceAbi,
			MarketContractAddress,
		);
		ERC721Contract.methods.ownerOf(_tokenId).call((err, res) => {
			if (!err) {
				_data.owner_address = res;
				console.log('owner_address', res, _tokenId);
				MarketPlaceContract.methods.getSellDetail(collectionAddress, _tokenId).call(async (err, res) => {
					console.log(
						'MarketPlaceContract_res',
						res,
						err,
						_tokenId,
						MarketContractAddress,
					);
					// return ;
					if (!err) {
						let priceOfNft = res[1] / 1e18;
						if (wallet.address) {
							// if (priceOfNft === 0) {
							if (res[0] === '0x0000000000000000000000000000000000000000') {
								setPriceNFT(priceOfNft);
								setPriceNFTString(res[1]);
								setIsContractOwner(
									res[0].toLowerCase() === wallet.address.toLowerCase() ||
										(res[0].toLowerCase() ===
											walletAddressForNonCrypto.toLowerCase() &&
											nonCryptoOwnerId.toLowerCase() === data.user._id)
										? true
										: false,
								);
								setIsOwner(
									(_data.owner_address.toLowerCase() ===
										data.user._id.toLowerCase() &&
										res[1] !== '') ||
										(data &&
											_data.owner_address.toLowerCase() ===
											walletAddressForNonCrypto.toLowerCase() &&
											res[1] !== '' &&
											nonCryptoOwnerId.toLowerCase() === data.user._id)
										? true
										: false,
								);
							} else if (
								res[0] !== '0x0000000000000000000000000000000000000000'
							) {
								setIsOwner(
									(res[0].toLowerCase() === wallet.address.toLowerCase() &&
										res[1] !== '') ||
										(data &&
											res[0].toLowerCase() ===
											walletAddressForNonCrypto.toLowerCase() &&
											res[1] !== '' &&
											nonCryptoOwnerId.toLowerCase() === data.user._id)
										? true
										: false,
								);
								setIsContractOwner(
									res[0].toLowerCase() === wallet.address.toLowerCase() ||
										(res[0].toLowerCase() ===
											walletAddressForNonCrypto.toLowerCase() &&
											data &&
											nonCryptoOwnerId.toLowerCase() === data.user._id)
										? true
										: false,
								);
								setPriceNFT(priceOfNft);
								setPriceNFTString(res[1]);
							}
						} else {
							if (res[0] === '0x0000000000000000000000000000000000000000') {
								setIsContractOwner(false);
								setPriceNFT(priceOfNft);
								setPriceNFTString(res[1]);
							} else if (
								res[0] !== '0x0000000000000000000000000000000000000000'
							) {
								setPriceNFT(priceOfNft);
								setPriceNFTString(res[1]);
								setIsContractOwner(false);
							}
						}

						setOwnerAddress(nonCryptoOwner);
					}
					setBuyLoading(false);
				});
			} else {
				//console.log("err getAuthor", err);
				setBuyLoading(false);
			}
		});
	};

	const lastOwnerOfNFT = () => {
		let _data = singleNFT;
		let web3 = new Web3(providerUrl);
		let ERC721Contract = new web3.eth.Contract(
			ERC721Abi,
			collectionAddress
		);

		let MarketPlaceContract = new web3.eth.Contract(
			MarketPlaceAbi,
			MarketContractAddress,
		);
		ERC721Contract.methods.ownerOf(_tokenId).call((err, res) => {
			if (!err) {
				_data.owner_address = res;
				console.log('owner_address', res);
				MarketPlaceContract.methods.getSellDetail(collectionAddress, _tokenId).call((err, res) => {
					console.log('MarketPlaceContract_res', res, err, _tokenId);
					if (!err) {
						let priceOfNft = res[1] / 1e18;
						let _ownerAddress = _data.owner_address;
						if (wallet.address) {
							if (res[0] !== "0x0000000000000000000000000000000000000000") {
								_ownerAddress = res[0];
								setIsOwner(res[0].toLowerCase() ===
									wallet.address.toLowerCase() && res[1] !== ""
									? true
									: false);
							} else {
								setIsOwner(_data.owner_address.toLowerCase() ===
									wallet.address.toLowerCase() && res[1] !== ""
									? true
									: false);
							}
							setIsContractOwner(res[0].toLowerCase() ===
								wallet.address.toLowerCase()
								? true
								: false);
							setPriceNFT(priceOfNft);
							setPriceNFTString(res[1]);
						} else {
							// if (priceOfNft === 0) {
							if (res[0] === '0x0000000000000000000000000000000000000000') {
								setIsContractOwner(false);
								setPriceNFT(priceOfNft);
								setPriceNFTString(res[1]);
							} else if (
								res[0] !== '0x0000000000000000000000000000000000000000'
							) {
								setIsContractOwner(false);
								setPriceNFT(priceOfNft);
								setPriceNFTString(res[1]);
							}
						}
						setOwnerAddress(_ownerAddress);
					}
					setBuyLoading(false);
				});
			} else {
				//console.log("err getAuthor", err);
				setBuyLoading(false);
			}
		});
	};

	const getTokenDetailsApi = async (isCryptoOwner = true) => {
		let category = "2D";
		let data = {
			tokenId: tokenId,
			networkType: networkType,
			type: category,
			chain: chainType,
			owner: wallet.address
		};

		let fetch_data_body = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		}

		fetch(`${BASE_URL}/xanalia/getDetailNFT`, fetch_data_body)
			.then(response => response.json())
			.then(async (res) => {
				console.log("getDetailNFT_res", res);
				if (res.data.length > 0 && res.data !== "No record found") {
					const getDetails = res?.data;
					if (
						getDetails &&
						getDetails[0] &&
						getDetails[0]?.newprice &&
						getDetails[0]?.newprice?.seller.includes("0x")
					) {
						getNFTDiscount(
							getDetails[0]?.newprice?.seller,
							getDetails[0]?.newprice?.tokenId
						);
						getDiscount();
					}
					let data = await getNFTDetails(res.data[0]);
					if (data.newprice && data.newprice.allowedCurrencies) {
						let currArray = data.newprice.allowedCurrencies.split("");
						let availableTokens = basePriceTokens.filter(
							(token) =>
								token.chain === chainType &&
								currArray.includes(token.order.toString())
						);
						console.log('availableTokens', availableTokens);
						setAvailableTokens(availableTokens);
					} else {
						setAvailableTokens([]);
					}

					setSingleNFT(data);
					setIsForAward(res?.data[0]?.award
						? res?.data[0]?.award
						: res?.data[1]?.award
							? res?.data[1]?.award
							: false);
					console.log('calling');
					checkNFTOnAuction();

				} else if (res.data === "No record found") {
					console.log('res.data.data', res.data);
				}
			})
			.catch((err) => {
				// console.log(err)
			});
	}

	const getNFTDetails = async (obj) => {
		let _MarketPlaceAbi = ERC721Abi;
		let _MarketContractAddress = collectionAddress;

		let web3 = new Web3(providerUrl);

		if (obj.tokenId.toString().split("-")[2]) {
			let nftChain = obj.tokenId.toString().split("-")[0];
			let collectionAdd = obj.tokenId.toString().split("-")[1];
			let nftId = obj.tokenId.toString().split("-")[2];

			obj.chainType = nftChain ? nftChain : "";
			obj.polygonId = "";
			obj.collection = collectionAdd;
			obj.collectionAdd = obj.tokenId;
			obj.tokenId = nftId;
		}

		// console.log(MarketContractAddress);

		let MarketPlaceContract = new web3.eth.Contract(
			_MarketPlaceAbi,
			_MarketContractAddress
		);

		let nftObj = {
			image: obj.metaData.image,
			description: obj.metaData.description,
			title: obj.metaData.name,
			type: obj.metaData.properties.type,
			price: obj.price,
			rating: obj.rating,
			like: obj.like,
			author: obj.returnValues.to,
			_id: obj._id,
			// thumbnailUrl : obj.thumbnailUrl
			thumbnailUrl: obj?.thumbnailUrl,
			imageForVideo: obj?.metaData?.thumbnft
				? obj?.metaData?.thumbnft
				: obj?.thumbnailUrl,
			newprice: obj.newprice,
			approval: obj.approval,
		};

		nftObj.id = obj.tokenId;
		nftObj.collection = _MarketContractAddress;
		nftObj.collectionAdd = obj.collectionAdd;
		nftObj.nftChain = obj.chainType;

		nftObj.logoImg = `${CDN_LINK}/logo-v2.svg`;
		nftObj.price = nftObj.price ? nftObj.price : "";

		// console.log("nftObj", nftObj);

		await MarketPlaceContract.methods
			.ownerOf(nftObj.id)
			.call(function (err, res) {
				console.log("res", res);
				if (!err) {
					nftObj.owner_address = res;
				}
			});

		return nftObj;
	};

	const getNFTDiscount = (id) => {
		let web3 = new Web3(providerUrl);
		let MarketPlaceContract = new web3.eth.Contract(
			MarketPlaceAbi,
			MarketContractAddress
		);
		MarketPlaceContract.methods.adminOwner &&
			MarketPlaceContract.methods.adminOwner(id).call((err, res) => {
				setDiscount(res);
			});
	};

	const getDiscount = () => {
		let web3 = new Web3(providerUrl);
		let MarketPlaceContract = new web3.eth.Contract(
			MarketPlaceAbi,
			MarketContractAddress
		);
		MarketPlaceContract.methods.adminDiscount &&
			MarketPlaceContract.methods.adminDiscount().call((err, res) => {
				setDiscountValue(res ? res / 10 : 0);
			});
	};

	const calculatePrice = async (price, tradeCurr, owner, _baseCurrency) => {
		let web3 = new Web3(providerUrl);
		let MarketPlaceContract = new web3.eth.Contract(
			MarketPlaceAbi,
			MarketContractAddress
		);

		console.log(
			'calculate price params _______________',
			price,
			_baseCurrency.order,
			tradeCurr,
			_tokenId,
			owner,
			collectionAddress
		);

		let res = await MarketPlaceContract.methods
			.calculatePrice(
				price,
				_baseCurrency.order,
				tradeCurr,
				_tokenId,
				owner,
				collectionAddress
			)
			.call();
		console.log("calculate price response", res, price);
		if (res) return res;
		else return "";
	}

	const bidingTimeEnded = () => {
		return new Date().getTime() > new Date(auctionETime).getTime();
	};

	const setNFTStatus = () => {
		let _nftStatus = '';
		if (isContractOwner) {
			if (isNFTOnAuction && lastBidAmount !== '0.000000000000000000') {
				// setNftStatus(undefined);
				console.log('set NftStatus 1');
				_nftStatus = undefined;
			} else if (isForAward) {
				console.log('set NftStatus 1.1');
				_nftStatus = undefined;
			} else {
				// setNftStatus('onSell')
				console.log('set NftStatus 2');
				_nftStatus = 'onSell';
			}
		} else if (isOwner) {
			// setNftStatus('sell')
			console.log('set NftStatus 3');
			_nftStatus = 'sell';
		} else if (
			priceNFT ||
			(isNFTOnAuction &&
				auctionInitiatorAdd.toLowerCase() !== wallet.address.toLowerCase())
		) {
			if (
				isNFTOnAuction &&
				auctionInitiatorAdd.toLowerCase() !== wallet.address.toLowerCase() &&
				bidingTimeEnded() !== true
			) {
				// setNftStatus(undefined);
				console.log('set NftStatus 4');
				_nftStatus = undefined;
			} else if (priceNFT && !isNFTOnAuction) {
				if (wallet.address) {
					// setNftStatus('buy')
					console.log('set NftStatus 5');
					_nftStatus = 'buy';
				} else if (connectedWithTo === 'paymentCard') {
				} else {
					// setNftStatus('buy');
					console.log('set NftStatus 6');
					_nftStatus = 'buy';
				}
			} else {
				// setNftStatus(undefined);
				console.log('set NftStatus 7');
				_nftStatus = undefined;
			}
		} else {
			// setNftStatus('notOnSell');
			console.log('set NftStatus 8');
			_nftStatus = 'notOnSell';
		}
		console.log(
			'_nftStatus',
			_nftStatus,
			priceNFT,
			isContractOwner,
			isOwner,
			isNFTOnAuction,
		);
		return _nftStatus;
	};

	const onProfile = () => {
		if (isOwner) {
			navigation.push('ArtistDetail', { id: ownerId });
		} else {
			navigation.push('ArtistDetail', { id: artistId });
		}
	};

	const PayableIn = props => {
		const [open, setOpen] = useState(false);
		const [value, setValue] = useState([]);
		const [items, setItems] = useState([
			{ label: 'Minted', value: 'Minted' },
			{ label: 'Listing (Fixed Price)', value: 'Listing (Fixed Price)' },
			{ label: 'Bid', value: 'Bid' },
			{ label: 'Sale', value: 'Sale' },
			{ label: 'Claim', value: 'Claim' },
			{ label: 'Listing (Auction)', value: 'Listing (Auction)' },
			{ label: 'Cancel Sell', value: 'Cancel Sell' },
		]);

		return (
			<DropDownPicker
				open={open}
				value={value}
				items={items}
				multiple={true}
				min={0}
				mode={'BADGE'}
				setOpen={setOpen}
				setValue={setValue}
				setItems={setItems}
				closeAfterSelecting={true}
				style={styles.tokenPicker}
				dropDownContainerStyle={styles.dropDownContainer}
				placeholder={'Filter'}
			/>
		);
	};

	return (
		<>
			<SafeAreaView style={styles.mainContainer}>
				<AppHeader showBackButton title={translate('wallet.common.detail')} />
				<ScrollView showsVerticalScrollIndicator={false}>
					<TouchableOpacity activeOpacity={1} onPress={() => setPlay(!isPlay)}>
						{fileType === 'mp4' ||
							fileType === 'MP4' ||
							fileType === 'mov' ||
							fileType === 'MOV' ? (
							<View style={{ ...styles.modalImage }}>
								{/* <C_Image uri={thumbnailUrl} imageStyle={styles.modalImage} isContain /> */}
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
									}}
								/>
								{!isPlay && (
									<View
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										<View
											style={{
												width: SIZE(100),
												height: SIZE(100),
												backgroundColor: '#00000030',
												borderRadius: SIZE(100),
												alignItems: 'center',
												justifyContent: 'center',
											}}>
											<PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
										</View>
									</View>
								)}
							</View>
						) : (
							<C_Image
								uri={thumbnailUrl}
								imageStyle={styles.modalImage}
								isContain
							/>
						)}
					</TouchableOpacity>
					<View style={styles.person}>
						<TouchableOpacity
							onPress={() => onProfile(false)}
							style={styles.personType}>
							<Image
								style={styles.iconsImage}
								source={
									!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }
								}
							/>
							<View>
								<Text style={styles.personTypeText}>
									{translate('common.creator')}
								</Text>
								<Text numberOfLines={1} style={styles.personName}>
									{creator}
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onProfile(false)}
							style={styles.personType}>
							<Image
								style={styles.iconsImage}
								source={
									!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }
								}
							/>
							<View>
								<Text style={styles.personTypeText}>
									{translate('common.collected')}
								</Text>
								<Text numberOfLines={1} style={styles.personName}>
									{creator}
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onProfile(true)}
							style={styles.personType}>
							<Image
								style={styles.iconsImage}
								source={!ownerImage ? IMAGES.DEFAULTPROFILE : { uri: ownerImage }}
							/>
							<View>
								<Text style={styles.personTypeText}>
									{translate('common.owner')}
								</Text>
								<Text numberOfLines={1} style={styles.personName}>
									{owner}
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<Text style={styles.nftTitle}>KANON</Text>
					<Text style={styles.nftName}>{name}</Text>
					<Text style={styles.description}>{description}</Text>
					{/* <View style={styles.moreView}>
                        <Text style={styles.moreTitle}>
                            {translate("wallet.common.creatorHint")}
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
						<Text style={styles.count}>{'# 1 / 1'}</Text>
						<View style={styles.row}>
							<Text style={styles.priceUnit}>{'￥'}</Text>
							<Text style={styles.price}>{price ? price : 0}</Text>
						</View>
						{setNFTStatus() !== undefined && (
							<GroupButton
								leftText={
									setNFTStatus() === 'onSell'
										? translate('common.cancelSell')
										: setNFTStatus() === 'sell'
											? translate('common.sell')
											: setNFTStatus() === 'buy'
												? translate('common.buy')
												: setNFTStatus() === 'notOnSell'
													? translate('common.soonOnSell')
													: translate('common.buy')
								}
								rightText={translate('wallet.common.offerPrice')}
								leftDisabled={setNFTStatus() === ''}
								leftLoading={buyLoading}
								onLeftPress={() => {
									console.log('priceOfNft', priceNFT);
									if (buyLoading) return;
									// navigation.navigate('WalletConnect')
									// if(price && price > 0){
									if (setNFTStatus() === 'buy') {
										setShowPaymentMethod(true);
									} else if (setNFTStatus() === 'sell') {
										navigation.navigate('sellNft', { nftDetail: singleNFT });
									}
									// }
								}}
								leftHide={setNFTStatus() === undefined}
								rightHide
								onRightPress={() => navigation.navigate('MakeBid')}
							/>
						)}
					</View>
					<NFTDetailDropdown
						title={translate('common.creator')}
						icon={details}
						containerStyles={{ marginTop: hp(2) }}>
						<TouchableOpacity
							onPress={() => onProfile(false)}
							style={styles.personType}>
							<Image
								style={styles.creatorImage}
								source={
									!creatorImage ? IMAGES.DEFAULTPROFILE : { uri: creatorImage }
								}
							/>
							<View>
								<Text numberOfLines={1} style={styles.creatorName}>
									{creator}
								</Text>
							</View>
						</TouchableOpacity>
					</NFTDetailDropdown>
					<NFTDetailDropdown title={translate('wallet.common.detail')} icon={details}>
						<View style={styles.rowContainer}>
							<TextView style={styles.rowText}>Contract Address</TextView>
							<TextView
								style={[styles.rowText, { color: Colors.themeColor }]}
								ellipsizeMode="middle"
								numberOfLines={1}>
								bsjabdJSddakdssddhsd135
							</TextView>
						</View>
						<View style={styles.rowContainer}>
							<TextView style={styles.rowText}>NFT ID</TextView>
							<TextView style={styles.rowText}>2568</TextView>
						</View>
						<View style={styles.rowContainer}>
							<TextView style={styles.rowText}>Token Standard</TextView>
							<TextView style={styles.rowText}>ERC721</TextView>
						</View>
						<View style={styles.rowContainer}>
							<TextView style={styles.rowText}>BlockChain Type</TextView>
							<TextView style={styles.rowText}>BINANCE</TextView>
						</View>
					</NFTDetailDropdown>
					<NFTDetailDropdown title="Bid History" icon={history}>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}>
							<Table borderStyle={{ borderWidth: 1, borderColor: Colors.GREY9 }}>
								<Row
									data={tableHead}
									style={styles.head}
									textStyle={styles.text}
									widthArr={[75, 75, 75, 150]}
								/>
								<Rows
									data={tableData}
									textStyle={styles.text}
									widthArr={[75, 75, 75, 150]}
								/>
							</Table>
						</ScrollView>
					</NFTDetailDropdown>
					<NFTDetailDropdown title={translate('common.tradingHistory')} icon={trading}>
						<PayableIn />
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							style={{ marginTop: hp(2) }}>
							<Table borderStyle={{ borderWidth: 1, borderColor: Colors.GREY9 }}>
								<Row
									data={tradingTableHead}
									style={styles.head}
									textStyle={styles.text}
									widthArr={[75, 75, 75, 75, 150]}
								/>
								<Rows
									data={tradingTableData}
									textStyle={styles.text}
									widthArr={[75, 75, 75, 75, 150]}
								/>
							</Table>
						</ScrollView>
					</NFTDetailDropdown>
					<NFTDetailDropdown title="More from this collection" icon={grid} />
				</ScrollView>
			</SafeAreaView>
			<PaymentMethod
				visible={showPaymentMethod}
				price={price ? price : 0}
				priceStr={priceNFTString}
				priceInDollar={priceInDollar}
				baseCurrency={baseCurrency}
				allowedTokens={availableTokens}
				ownerAddress={ownerAddress?.includes("0x") ? ownerAddress : walletAddressForNonCrypto}
				id={singleNFT.id}
				collectionAddress={collectionAddress}
				chain={chainType}
				onRequestClose={() => setShowPaymentMethod(false)}
			/>
			<PaymentNow
				visible={showPaymentNow}
				price={price ? price : 0}
				priceInDollar={priceInDollar}
				chain={chainType}
				NftId={_tokenId}
				IdWithChain={tokenId}
				ownerId={nonCryptoOwnerId}
				ownerAddress={ownerAddress.includes("0x") ? ownerAddress : walletAddressForNonCrypto}
				baseCurrency={baseCurrency}
				collectionAddress={collectionAddress}
				lastBidAmount={priceNFT}
				onRequestClose={() => {
					dispatch(setPaymentObject(null));
					setShowPaymentNow(false);
				}}
				onPaymentDone={() => {
					dispatch(setPaymentObject(null));
					setBuyLoading(true);
					getNonCryptoNFTOwner();
					setShowPaymentNow(false);
					setSuccessModalVisible(true);
				}}
			/>

			<AppModal
				visible={successModalVisible}
				onRequestClose={() => setSuccessModalVisible(false)}>
				<SuccessModalContent
					onClose={() => setSuccessModalVisible(false)}
					onDonePress={() => {
						setSuccessModalVisible(false);
					}}
					sucessMsg={translate('wallet.common.purchasedSuccess')}
				/>
			</AppModal>
		</>
	);
};

export default DetailScreen;
