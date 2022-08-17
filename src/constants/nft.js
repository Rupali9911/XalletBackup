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

// export enum SORT_BID_HISTORY {
//     PRICE_ASC = 1,
//     PRICE_DESC = 2,
//     NEWEST = 3,
//     OLDEST = 4,
// }

// export enum SORT_TRADING_HISTORY {
//     PUT_ON_SALE = 0,
//     OFFER_MADE = 1,
//     CANCEL_SALE_NFT = 2,
//     BUY_NFT = 3,
//     OFFER_ACCEPTED = 4,
//     CANCEL_MAKE_OFFER = 9,
//     RECLAIM_MAKE_OFFER = 10,
//     MINT_NFT = 15,
//     EDIT_ORDER = 7,

//     CANCEL_AUCTION = 18,
//     PUT_AUCTION = 19,
//     BID_NFT = 20,
//     BID_EDITED = 21,
//     CANCEL_BID_NFT = 22,
//     RECLAIM_BID_NFT = 24,
//     WINNER_BID_NFT = 23,
//     ACCEPT_BID_NFT = 25,
//     NFT_RECLAIMED = 26,
// }

export const MAX_IMAGE_SIZE = 1024 * 1024 * 100
export const MAX_THUMBNAIL_SIZE = 1024 * 1024 * 5

// export enum FILTER_NFT_BY_SORT {
//     MOST_LIKE = 0,
//     ON_SALE = 1,
//     RECENTLY_CREATED = 2,
//     LOW_TO_HIGH = 3,
//     HIGH_TO_LOW = 4,
//     ON_AUTION = 5,
// }

// export enum FILTER_NFT_CATEGORY {
//     TRENDING = 0,
//     ART = 1,
//     IMAGE = 2,
//     GIF = 3,
//     MOVIE = 4,
//     MUSIC = 5,
// }

export const SERVICE_FEE = 2.5

export const FILTER_TRADING_HISTORY_OPTIONS = [
    {
        // label1: 'Minted',
        value: 15,
        label: 'MINT_NFT',
    },
    {
        // label1: 'Listing (Fixed Price)',
        value: 0,
        label: 'PUT_ON_SALE',
    },
    {
        // label1: 'Listing (Auction)',
        value: 19,
        label: 'PUT_AUCTION',
    },
    {
        // label1: 'Cancel Listing',
        value: 2,
        label: 'CANCEL_SALE_NFT',
    },
    // {
    //     // label1: 'Price Updated',
    //     value: 7,
    //     label: 'EDIT_ORDER',
    // },
    {
        // label1: 'Sold (Fixed Price)',
        value: 3,
        label: 'BUY_NFT',
    },
    {
        // label1: 'Bid Placed',
        value: 20,
        label: 'BID_NFT',
    },
    {
        // label1: 'Bid Accepted',
        value: 25,
        label: 'ACCEPT_BID_NFT',
    },
    {
        // label1: 'Bid Canceled',
        value: 22,
        label: 'CANCEL_BID_NFT',
    },
    {
        // label1: 'Bid Reclaimed',
        value: 24,
        label: 'RECLAIM_BID_NFT',
    },
    {
        // label1: 'Offer Made',
        value: 1,
        label: 'OFFER_MADE',
    },
    {
        // label1: 'Offer Accepted',
        value: 4,
        label: 'OFFER_ACCEPTED',
    },
    {
        // label1: 'Offer Canceled',
        value: 9,
        label: 'CANCEL_MAKE_OFFER',
    },
    {
        // label1: 'Offer Reclaimed',
        value: 10,
        label: 'RECLAIM_MAKE_OFFER',
    },
    {
        // label1: 'NFT Reclaimed',
        value: 26,
        label: 'NFT_RECLAIMED',
    },
]

export const nftGridClass = 'gx-2 gy-3 gx-lg-3 gy-lg-4'
export const collectionGridClass = 'gx-2 gy-3'
