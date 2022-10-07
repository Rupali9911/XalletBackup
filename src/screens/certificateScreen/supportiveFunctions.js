import { AMOUNT_BID_HIGHER } from "../../constants"

export const validatePrice = (price, highestPrice) => {
    if (!price) {
        return false
    }

    if (
        price &&
        Number(price) * 10 ** 6 <
        highestPrice * 10 ** 6 * (1 + AMOUNT_BID_HIGHER)
    ) {
        return false
    }

    return true
}