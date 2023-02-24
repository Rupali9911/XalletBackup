import { networkType } from "../common/networkType"
export const INFT = [
    {
        collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
        image: 'https://ik.imagekit.io/xanalia/nftData/tot.jpg',
        mainImage:
            'https://storage.xanalia.com/output/nft-image/94/1663060570945_2.jpeg',
        nftId: networkType === 'testnet' ? 215 : 42729,
        nftName: 'YAKAMIHIME',
        displayName: 'Yakamihime (やかみひめ)',
        token_id: networkType === 'testnet' ? '151' : '862',
        modalUrl:
            // 'https://api-test-xana.s3.amazonaws.com/xana-genisis/TOTTORI+MODEL-optimization/10hair.model3.json',
            '/models/TOTTORI MODEL/10hair.model3.json',
        isPublic: true,
        iNFT: true,
        voiceAllowed: true,
        ownerAddress:
            process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
                ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
                : '0x717866aaF1Bc1Da7566edb733672f6424082943e',
    },
    {
        collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
        image: 'https://ik.imagekit.io/xanalia/xana-genesis/002-.png',
        mainImage: 'models/BROWN BOB/MODEL.jpeg',
        nftId: networkType === 'testnet' ? 1378 : 41968,
        nftName: ' #7857 Sana',
        token_id: networkType === 'testnet' ? '241' : '101',
        modalUrl:
            'https://api-test-xana.s3.amazonaws.com/xana-genisis/BROWN+BOB/10hair.model3.json',
        isPublic: true,
        iNFT: true,
        voiceAllowed: true,
        ownerAddress:
            process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
                ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
                : '0x944345c08aA9198a08d57F9De2390B53E740185C',
    },
    {
        collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
        image: 'https://ik.imagekit.io/xanalia/xana-genesis/003-.png',
        mainImage: 'models/Black Bob (Casual)/MODEL.jpeg',
        nftId: networkType === 'testnet' ? 1376 : 41969,
        nftName: ' #3015 Genie',
        token_id: networkType === 'testnet' ? '240' : '102',
        modalUrl:
            'https://api-test-xana.s3.amazonaws.com/xana-genisis/Black+Bob+(Casual)/20-25.model3.json',
        isPublic: true,
        iNFT: true,
        voiceAllowed: true,
        ownerAddress:
            process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
                ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
                : '0x944345c08aA9198a08d57F9De2390B53E740185C',
    },
    // {
    //     collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    //     image: 'models/Black Bob Kimono/MODEL.jpeg',
    //     mainImage: 'models/Black Bob Kimono/MODEL.jpeg',
    //     nftId: networkType === 'testnet' ? 1052 : 1,
    //     nftName: 'Genie',
    //     token_id: networkType === 'testnet' ? '239' : '1',
    //     modalUrl: 'models/Black Bob Kimono/20-25.model3.json',
    //     isPublic: true,
    //     iNFT: true,
    //     voiceAllowed: true,
    //     ownerAddress: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
    //     ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
    //     : '0x944345c08aA9198a08d57F9De2390B53E740185C'
    // },
    {
        collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
        image: 'https://ik.imagekit.io/xanalia/xana-genesis/004-.png',
        mainImage: 'models/School Girl/MODEL.jpeg',
        nftId: networkType === 'testnet' ? 986 : 41970,
        nftName: ' #3894 Karen',
        token_id: networkType === 'testnet' ? '237' : '103',
        modalUrl:
            'https://api-test-xana.s3.amazonaws.com/xana-genisis/School+Girl/31-35.model3.json',
        isPublic: true,
        iNFT: true,
        voiceAllowed: true,
        ownerAddress:
            process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
                ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
                : '0x944345c08aA9198a08d57F9De2390B53E740185C',
    },
    {
        collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
        image: 'https://ik.imagekit.io/xanalia/xana-genesis/005-.png',
        mainImage: 'models/TWIN BALL HAIR GIRL/Model.jpeg',
        nftId: networkType === 'testnet' ? 987 : 41971,
        nftName: ' #9178 Noa',
        token_id: networkType === 'testnet' ? '238' : '104',
        modalUrl:
            'https://api-test-xana.s3.amazonaws.com/xana-genisis/TWIN+BALL+HAIR+GIRL/31-35.model3.json',
        isPublic: true,
        iNFT: true,
        voiceAllowed: true,
        ownerAddress:
            process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
                ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
                : '0x944345c08aA9198a08d57F9De2390B53E740185C',
    },
    {
        collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
        image: 'https://ik.imagekit.io/xanalia/xana-genesis/006-.png',
        mainImage: 'models/One Side Glass Girl/Model.jpeg',
        nftId: networkType === 'testnet' ? 684 : 41972,
        nftName: ' #8078 Rino',
        token_id: networkType === 'testnet' ? '236' : '105',
        modalUrl:
            'https://api-test-xana.s3.amazonaws.com/xana-genisis/One+Side+Glass+Girl/1-5%E4%BA%8C%E6%94%B9.model3.json',
        isPublic: true,
        iNFT: true,
        voiceAllowed: true,
        ownerAddress:
            process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
                ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
                : '0x944345c08aA9198a08d57F9De2390B53E740185C',
    },
]
