export const compareAddress = (address1, address2) => {
    if (!address1 || !address2) return false
    return address1?.toLowerCase() === address2?.toLowerCase()
}
