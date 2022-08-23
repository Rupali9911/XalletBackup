export const formatAddress = (address) => {
    if (!address) return ''
    return address.slice(0, 6)
}

export const artistLink = (address) => {
    return `/profile/${address}`
}

export const sliceAddress = (address) => {
    if (address) {
        return address.slice(0, 6) + '...' + address.slice(address.length - 4)
    }
    return address
}
