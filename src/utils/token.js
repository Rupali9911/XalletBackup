import { saleType as st } from '../constants/nft'
export const getERC20Tokens = (currencies) => {
    if (!currencies) return []
    return currencies.filter((item) => item.isNativeToken === 0)
}

export const getTokenByName = (
    currencies,
    name,
) => {
    if (!currencies) return []
    for (let i = 0; i < currencies.length; i++) {
        if (currencies[i].tokenName.toLowerCase() === name.toLowerCase()) {
            return currencies[i]
        }
    }

    return currencies[0]
}

export const getDefaultToken = (
    currencies,
    saleType,
    network,
) => {
    let tokenName = 'BNB'
    if (saleType === st.FIXEDPRICE) {
        switch (network.toLowerCase()) {
            case 'polygon': {
                tokenName = 'MAR'
                break
            }
            case 'bsc': {
                tokenName = 'BNB'
                break
            }
            case 'ethereum': {
                tokenName = 'ETH'
                break
            }
            default:
                break
        }
    }

    if (saleType === st.TIMEAUTION) {
        switch (network.toLowerCase()) {
            case 'polygon': {
                tokenName = 'ALIA'
                break
            }
            case 'bsc': {
                tokenName = 'ALIA'
                break
            }
            case 'ethereum': {
                tokenName = 'USDT'
                break
            }
            default:
                break
        }
    }

    return getTokenByName(currencies, tokenName)
}
