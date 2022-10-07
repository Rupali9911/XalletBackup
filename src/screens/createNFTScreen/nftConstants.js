const PriceUnits = {
    Ethereum: [{ order: "1", name: 'ETH' }, { order: "0", name: 'USDT' }],
    BSC: [{ order: "0", name: 'ALIA' }, { order: "1", name: 'BUSD' }, { order: "2", name: 'BNB' }],
    Polygon: [{ order: "0", name: 'ALIA' }, { order: "1", name: 'USDC' }, { order: "2", name: 'ETH' }, {
        order: "3",
        name: "MATIC"
    }]
}

const NFT_TYPE_TO_ID = {
    art: 1,
    image: 2,
    gif: 3,
    video: 4,
    audio: 5,
}

const ImageType = [
    { name: "Art", value: 'art', type: "2D", code: "common.2DArt" },
    { name: "Photo", value: 'image', type: "portfolio", code: "common.photo" },
    { name: "GIF", value: 'gif', type: "GIF" },
    { name: "Movie", value: 'video', type: "movie", code: "common.video" },
    { name: "Audio", value: 'audio', type: "AUDIO" },
]

const royalityData = ["2.5%", "5%", "7.5%", "10%"];

const supportMediaType = {
    image: 'image/jpeg, image/jpg, image/png, image/gif',
    video: 'video/mp4',
    audio: 'audio/mpeg, audio/mp3',
    combind:
        'image/jpeg, image/jpg, image/png, image/gif, video/mp4, audio/mp3, audio/mpeg',
}

export {
    supportMediaType,
    PriceUnits,
    NFT_TYPE_TO_ID,
    ImageType,
    royalityData
}