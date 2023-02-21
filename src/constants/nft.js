export const saleType = {
    FIXEDPRICE: 1,
    TIMEAUTION: 2,
}

export const basePrice = [
    { address: '0x00', name: 'ETH' },
    { address: '0x01', name: 'USDT' },
]

export const STANDARD_TYPE = {
    '1': 'ERC-721',
    '0': 'ERC-721',
}

export const CATEGORY_VALUE = {
    trending : 0,
    art : 1,
    image : 2,
    gif : 3,
    movie : 4,
    music : 5,
    allNft : 6
}

export const SORT_FILTER_OPTONS = {
    mostLiked : 0,
    onSale : 1,
    recentlyCreated : 2,
    lowToHighPrice : 3,
    highToLowPrice : 4,
    onAuction : 5
}

export const networks = [
    {
        chainId: 1,
        name: 'ETHEREUM',
        currencies: [
            { address: '0x00', name: 'ETH' },
            { address: '0x01', name: 'USDT' },
        ],
    },
    {
        chainId: 4,
        name: 'RINKEBY',
        currencies: [
            { address: '0x00', name: 'ETH' },
            { address: '0x01', name: 'USDT' },
        ],
    },
    {
        chainId: 137,
        name: 'POLYGON',
        currencies: [
            { address: '0x00', name: 'ETH' },
            { address: '0x01', name: 'ALIA' },
            { address: '0x02', name: 'USDC' },
        ],
    },
    {
        chainId: 80001,
        name: 'POLYGON MUMBAI',
        currencies: [
            { address: '0x00', name: 'ETH' },
            { address: '0x01', name: 'ALIA' },
            { address: '0x02', name: 'USDC' },
        ],
    },
    {
        chainId: 56,
        name: 'BINANCE SMART CHAIN',
        currencies: [
            { address: '0x00', name: 'ALIA' },
            { address: '0x01', name: 'BUSD' },
            { address: '0x02', name: 'BNB' },
        ],
    },
    {
        chainId: 97,
        name: 'BINANCE SMART TESTNET',
        currencies: [
            { address: '0x00', name: 'ALIA' },
            { address: '0x01', name: 'BUSD' },
            { address: '0x02', name: 'BNB' },
        ],
    },
]

export const royaltyOptions = [
    { value: 2.5, name: '2.5%' },
    { value: 5, name: '5%' },
    { value: 7.5, name: '7.5%' },
    { value: 10, name: '10%' },
]

export const NFT_TYPE_TO_ID = {
    art: 1,
    image: 2,
    gif: 3,
    video: 4,
    audio: 5,
}

export const nftTypes = [
    {
        value: 'art',
        name: 'Art',
        supportTypes: 'image/png, image/jpeg, image/jpg',
        invalidMessageKey: 'INVALID_ART_TYPE',
    },
    {
        value: 'image',
        name: 'PHOTO',
        supportTypes: 'image/png, image/jpeg, image/jpg',
        invalidMessageKey: 'INVALID_PHOTO_TYPE',
    },
    {
        value: 'gif',
        name: 'GIF',
        supportTypes: 'image/gif',
        invalidMessageKey: 'INVALID_GIF_TYPE',
    },
    {
        value: 'video',
        name: 'MOVIE',
        supportTypes: 'video/mp4',
        invalidMessageKey: 'INVALID_MOVIE_TYPE',
    },
    {
        value: 'audio',
        name: 'AUDIO',
        supportTypes: 'audio/mp3, audio/mpeg',
        invalidMessageKey: 'INVALID_AUDIO_TYPE',
    },
]

export const getNftType = (value) => {
    for (let i = 0; i < nftTypes.length; i++) {
        if (nftTypes[i].value === value) {
            return nftTypes[i]
        }
    }

    return nftTypes[0]
}

export const getCurrencyName = (chainId, address) => {
    for (let i = 0; i < networks.length; i++) {
        if (networks[i].chainId === chainId) {
            for (let j = 0; j < networks[i].currencies.length; j++) {
                if (
                    address.toLocaleLowerCase() ===
                    networks[i].currencies[j].address.toLocaleLowerCase()
                ) {
                    return networks[i].currencies[j].name
                }
            }
        }
    }
    return ''
}

export const getCurrencies = (chainId) => {
    for (let i = 0; i < networks.length; i++) {
        if (networks[i].chainId === chainId) {
            return networks[i].currencies
        }
    }
    return []
}

export const supportMediaType = {
    image: 'image/jpeg, image/jpg, image/png, image/gif',
    video: 'video/mp4',
    audio: 'audio/mpeg, audio/mp3',
    combind:
        'image/jpeg, image/jpg, image/png, image/gif, video/mp4, audio/mp3, audio/mpeg',
}

export const NFT_MARKET_STATUS = {
    NOT_ON_SALE: 0,
    ON_FIX_PRICE: 1,
    ON_AUCTION: 2,
    CANCEL_AUCTION: 3,
    UPCOMMING_AUCTION: 4,
    END_AUCTION: 5,
}

export const AMOUNT_BID_HIGHER = 0.05

export const AUCTION_SESSION_STATUS = {
    FAIL: -1,
    NEW: 0,
    ACTIVE: 1,
    END: 2,
    UNSUCCESSFUL: 3,
    CANCEL: 4,
    DONE: 5,
    MINT_WITH_NFT: 15,
}

export const SALE_NFT_STATUS = {
    NEW: 0,
    SUCCESS: 1,
    FAIL: -1,
    NOT_COUNT: 2,
    MAKE_OFFER_EXPIRED: 4,
}

export const SORT_BID_HISTORY = {
    PRICE_ASC: 1,
    PRICE_DESC: 2,
    NEWEST: 3,
    OLDEST: 4,
}

export const SORT_TRADING_HISTORY = {
    PUT_ON_SALE: 0,
    OFFER_MADE: 1,
    CANCEL_SALE_NFT: 2,
    BUY_NFT: 3,
    OFFER_ACCEPTED: 4,
    CANCEL_MAKE_OFFER: 9,
    RECLAIM_MAKE_OFFER: 10,
    MINT_NFT: 15,
    EDIT_ORDER: 7,

    CANCEL_AUCTION: 18,
    PUT_AUCTION: 19,
    BID_NFT: 20,
    BID_EDITED: 21,
    CANCEL_BID_NFT: 22,
    RECLAIM_BID_NFT: 24,
    WINNER_BID_NFT: 23,
    ACCEPT_BID_NFT: 25,
    NFT_RECLAIMED: 26,
}

export const MAX_IMAGE_SIZE = 1024 * 1024 * 100
export const MAX_THUMBNAIL_SIZE = 1024 * 1024 * 5

export const FILTER_NFT_BY_SORT = {
    MOST_LIKE: 0,
    ON_SALE: 1,
    RECENTLY_CREATED: 2,
    LOW_TO_HIGH: 3,
    HIGH_TO_LOW: 4,
    ON_AUTION: 5,
}

export const FILTER_NFT_CATEGORY = {
    TRENDING: 0,
    ART: 1,
    IMAGE: 2,
    GIF: 3,
    MOVIE: 4,
    MUSIC: 5,
}

export const SERVICE_FEE = 2.5

export const FILTER_TRADING_HISTORY_OPTIONS = [
    {
        label: 'minted',
        value: 15,
        label1: 'MINT_NFT',
    },
    {
        label: 'sales',
        value: 0,
        label1: 'PUT_ON_SALE',
    },
    {
        label: 'OnAuction',
        value: 19,
        label1: 'PUT_AUCTION',
    },
    {
        label: 'cancelListingFixed',
        value: 2,
        label1: 'CANCEL_SALE_NFT',
    },
    // {
    //     label: 'Price Updated',
    //     value: 7,
    //     label1: 'EDIT_ORDER',
    // },
    {
        label: 'soldFixed',
        value: 3,
        label1: 'BUY_NFT',
    },
    {
        label: 'bidPlaced',
        value: 20,
        label1: 'BID_NFT',
    },
    {
        label: 'bidAccepted',
        value: 25,
        label1: 'ACCEPT_BID_NFT',
    },
    {
        label: 'cancelListingAuction',
        value: 22,
        label1: 'CANCEL_BID_NFT',
    },
    {
        label: 'bidReclaimed',
        value: 24,
        label1: 'RECLAIM_BID_NFT',
    },
    {  
        label: 'offerMade',
        value: 1,
        label1: 'OFFER_MADE',
    },
    {
        label: 'offerAccepted',
        value: 4,
        label1: 'OFFER_ACCEPTED',
    },
    {
        label: 'offerCanceled',
        value: 9,
        label1: 'CANCEL_MAKE_OFFER',
    },
    {
        label: 'offerReclaimed',
        value: 10,
        label1: 'RECLAIM_MAKE_OFFER',
    },
    {
        label: 'NFTReclaimed',
        value: 26,
        label1: 'NFT_RECLAIMED',
    },
    {
        label: 'cancelAuction',
        value: 18,
        label1: 'CANCEL_AUCTION',
    }, 
    {
        label: 'bidWinner',
        value: 23,
        label1: 'WINNER_BID_NFT',
    },
]

export const nftGridClass = 'gx-2 gy-3 gx-lg-3 gy-lg-4'
export const collectionGridClass = 'gx-2 gy-3'


export const UserErrorMessage = {
    'USER.USER_NOT_FOUND': {
        messageCode: 'USER.USER_NOT_FOUND',
        t: 'User not found',
        key: 'usernotfound',
    },
    'USER.USER_ALREADY_EXIST': {
        messageCode: 'USER.USER_ALREADY_EXIST',
        t: 'User already exist',
        key: 'USER_ALREADY_EXIST',
    },
    'USER.USER_WITH_EMAIL_NOT_EXIST': {
        messageCode: 'USER.USER_WITH_EMAIL_NOT_EXIST',
        t: 'User with email not exist',
        key: 'USER_WITH_EMAIL_NOT_EXIST',
    },
    'USER.USER_WITH_EMAIL_ALREADY_EXIST': {
        messageCode: 'USER.USER_WITH_EMAIL_ALREADY_EXIST',
        t: 'User with email already exist',
        key: 'USER_WITH_EMAIL_ALREADY_EXIST',
    },
    'USER.USER_WITH_TWITTER_ALREADY_EXIST': {
        messageCode: 'USER.USER_WITH_TWITTER_ALREADY_EXIST',
        t: 'User with twitter already exist',
        key: 'USER_WITH_TWITTER_ALREADY_EXIST',
    },
    'USER.USER_ALREADY EXISTS': {
        messageCode: 'USER.USER_ALREADY EXISTS',
        t: 'User with username already exist',
        key: 'USER_ALREADY EXISTS',
    },
    'AUTH.BANNED': {
        messageCode: 'AUTH.BANNED',
        t: 'USER HAS BEEN BANNED',
        key: 'AUTH_BANNED',
    },
  }
