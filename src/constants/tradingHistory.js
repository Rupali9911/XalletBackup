import { formatAddress } from './addressFormat'
import { FILTER_TRADING_HISTORY_OPTIONS, SORT_TRADING_HISTORY } from './nft'
export const getKeyEventByValue = (value) => {
    const key = SORT_TRADING_HISTORY[value]
    return key
}

export const getEventByValue = (action) => {
    const event = FILTER_TRADING_HISTORY_OPTIONS.find(
        option => option.value === action)
    return event?.label
}

export const getFromAddress = (from, action) => {
    switch (action) {
        case SORT_TRADING_HISTORY.MINT_NFT:
            return 'Null Address'
        default:
            return from
        // return formatAddress(from)
    }
}

export const getToAddress = (to, action) => {
    switch (action) {
        case SORT_TRADING_HISTORY.PUT_ON_SALE:
        case SORT_TRADING_HISTORY.PUT_AUCTION:
        case SORT_TRADING_HISTORY.CANCEL_AUCTION:
        case SORT_TRADING_HISTORY.CANCEL_SALE_NFT:
        case SORT_TRADING_HISTORY.NFT_RECLAIMED:
            return ''
        default:
            return to
        // return formatAddress(to
    }
}
