import {networkType} from '../common/networkType';

//===========================INFT=============================

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
];

//===========================INFTUserOwned Staging=============================

export const INFTUserOwnedStaging = [
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-2a-eyes-6c-clothes-28c-faceaccessories-7b-hairs-37d-earringsright-16b.png',
    mainImage:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-2a-eyes-6c-clothes-28c-faceaccessories-7b-hairs-37d-earringsright-16b.png',
    nftId: networkType === 'testnet' ? 678 : 46712,
    nftName: networkType === 'testnet' ? 'test bike' : ' #8505 Audri',
    token_id: networkType === 'testnet' ? '234' : '4936',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/8505+Audri/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: true,
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-5a-facespot-1a-eyes-19c-hairs-33a-clothes-62c-earrings-5a.png',
    mainImage:
      'https://storage.xanalia.com/output/nft-image/94/1663065618839_2.gif',
    nftId: networkType === 'testnet' ? 681 : 45888,
    nftName:
      networkType === 'testnet' ? 'test auction' : ' #4657 Shiori (汐璃)',
    token_id: networkType === 'testnet' ? '235' : '4112',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/4657/25-30%E5%8F%A6%E5%A4%96%E7%BA%A2%E5%A4%B4.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-5a-eyes-18a-hairs-5d-clothes-41e-hairaccessories-16b-earringsright-8b.png',
    mainImage:
      'https://storage.xanalia.com/output/nft-image/94/1663066242795_1.jpeg',
    nftId: networkType === 'testnet' ? 684 : 51700,
    nftName: networkType === 'testnet' ? 'testcat auction' : ' #2062 Constanza',
    token_id: networkType === 'testnet' ? '236' : '7250',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/2062/25-30+(1).model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-5a-eyes-18a-hairs-5d-clothes-41e-hairaccessories-16b-earringsright-8b.png',
    mainImage:
      'https://storage.xanalia.com/output/nft-image/94/1663066242795_1.jpeg',
    nftId: networkType === 'testnet' ? 684 : 51700,
    nftName: networkType === 'testnet' ? 'test modal' : ' #2062 Constanza',
    token_id: networkType === 'testnet' ? '236' : '7250',

    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/308+Final/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-2a-eyes-18b-hairs-1b-clothes-71b-hairaccessories-5a.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 43196,
    nftName: ' #1329 Maisha',
    token_id: networkType === 'testnet' ? '236' : '1329',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/1329+Maisha/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x2e9bbe6b591c353c413a1bb2e8e0f77e6d49993f',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-1a-eyes-19c-clothes-83d-hairs-22a-hairaccessories-5c-earrings-19a.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 43295,
    nftName: ' #1429 Calani',
    token_id: networkType === 'testnet' ? '236' : '1429',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/1429+Calani/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x5018fdfbc087d7c991030b4e535612d885b1d683',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://xanalia.s3.amazonaws.com/xana-genesis-old/…a-facespot-12a-eyes-12d-clothes-94c-hairs-23f.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 43840,
    nftName: ' #2062 YAVA',
    token_id: networkType === 'testnet' ? '236' : '2062',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/2062+YAVA/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: true,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0xb9e9ffc0392494069c14903d28adfad69316724e',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-3a-facespot-10a-eyes-29a-clothes-42e-hairs-6a-earringsleft-6a.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 43968,
    nftName: ' #2190 Kaedence',
    token_id: networkType === 'testnet' ? '236' : '2190',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/2190+Kaedence/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x8728a013c7173C6a643863B8E46BEE9990Bd01c0',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-4a-facespot-4a-eyes-3e-clothes-47a-hairs-13i.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 44195,
    nftName: ' #2419 Yumeka',
    token_id: networkType === 'testnet' ? '236' : '2419',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/2419+Yumeka/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x44d754a602fab4be509792f1ac360defb52801a5',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-2a-facespot-4a-eyes-18a-clothes-43e-hairs-10d-earrings-2b.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 44593,
    nftName: ' #2817 Kana',
    token_id: networkType === 'testnet' ? '236' : '2817',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/2817Kana/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0xbe8303fc0063c50fdced15c3306b311d7c83e157',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-1a-facespot-13a-eyes-9d-clothes-61c-hairs-29e.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 44832,
    nftName: ' #3056 Anabelle',
    token_id: networkType === 'testnet' ? '236' : '3056',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/3056Anabelle/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0xebe01d1898b97644cacc9cf7913291515a5ae968',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-1a-eyes-2a-hairs-35c-clothes-53b.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 45531,
    nftName: ' #3755 Kalia',
    token_id: networkType === 'testnet' ? '236' : '3755',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/3755Kalia/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x506e785479db6b86a9ddd161fd7b971db69abbcd',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-3a-facespot-15a-eyes-32e-clothes-13d-hairs-13b.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 48934,
    nftName: ' #8336 Miyuka',
    token_id: networkType === 'testnet' ? '236' : '8336',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/8336Miyuka/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x37976bae655c90bc140c24c880d3acca924492bb',
  },

  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-2a-facespot-3a-eyes-16d-clothes-54d-hairs-15f.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 46729,
    nftName: ' #4953 Misha',
    token_id: networkType === 'testnet' ? '236' : '4953',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/4953Misha/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: true,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x15d1de6e574f922f9d29bec95367f333a643876e',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-6a-eyes-24a-clothes-8b-hairs-27b-hairaccessories-3b.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 44199,
    nftName: ' #2423 Shizuri',
    token_id: networkType === 'testnet' ? '236' : '2423',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/2423+Shizuri/2423+Shizuri/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0xeb2d2efd492e7eaa1f8f745699bebc13d70af5e7',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-2a-facespot-11a-eyes-16b-hairs-3e-clothes-21c-earringsright-1b.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 45222,
    nftName: ' #3446 Inori',
    token_id: networkType === 'testnet' ? '236' : '3446',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/3446+Inori/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x423208b1462DDa33897629f462059f6CC02fbE27',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-1a-eyes-22b-hairs-32c-clothes-14c-hairaccessories-22a.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 46193,
    nftName: ' #4417 Roxy',
    token_id: networkType === 'testnet' ? '236' : '4417',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/4417+Roxy/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x7f3c894a1da20ea1b870ed4494b33ce60f4ee898',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-4a-eyes-14c-clothes-79b-hairs-29f-hairaccessories-10a.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 46433,
    nftName: ' #4657 Miah',
    token_id: networkType === 'testnet' ? '236' : '4657',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/4657+Miah/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x3f00bc1e83c4e47aa39cbddd3354b83ba3db4fea',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-4a-eyes-16d-hairs-34b-clothes-2a-hairaccessories-26a.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 49126,
    nftName: ' #8528 Ruby',
    token_id: networkType === 'testnet' ? '236' : '8528',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/8528+Ruby/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0xa43b64b7298c18ff58623f145b8e7321d785e9cd',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-4a-eyes-16d-clothes-28e-facepaint-7a-hairs-29e.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 44349,
    nftName: ' #2573 Yukari',
    token_id: networkType === 'testnet' ? '236' : '2573',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/2573+Yukari/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0xac7f104203821baf88cf9a0929610f3dc66fb1e1',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-1a-facespot-15a-eyes-19b-clothes-80f-hairs-18g.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 48077,
    nftName: ' #7348 Marguerite',
    token_id: networkType === 'testnet' ? '236' : '7348',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/7348+Marguerite/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0x11e0185434b499cac2cf77e0c3a96d6fc9578c14',
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-1a-facespot-13a-eyes-9d-clothes-61c-hairs-29e.png',
    mainImage: 'models/One Side Glass Girl/Model.jpeg',
    nftId: networkType === 'testnet' ? 684 : 44832,
    nftName: ' #3056 Anabelle',
    token_id: networkType === 'testnet' ? '236' : '3056',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/3056+Anabelle/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
    ownerAddress:
      process.env.NEXT_PUBLIC_NETWORK_TYPE === 'testnet'
        ? '0x138E3Dd54e5C3CB174F88232ad3fBba81331Db4b'
        : '0xebe01d1898b97644cacc9cf7913291515a5ae968',
  },
];


//============================INFTUserOwned Production=========================

export const INFTUserOwnedProduction = [
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-2a-eyes-6c-clothes-28c-faceaccessories-7b-hairs-37d-earringsright-16b.png',
    mainImage:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-2a-eyes-6c-clothes-28c-faceaccessories-7b-hairs-37d-earringsright-16b.png',
    nftId: networkType === 'testnet' ? 678 : 46712,
    nftName: networkType === 'testnet' ? 'test bike' : ' #8505 Audri',
    token_id: networkType === 'testnet' ? '234' : '4936',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/8505+Audri/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: true,
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-5a-facespot-1a-eyes-19c-hairs-33a-clothes-62c-earrings-5a.png',
    mainImage:
      'https://storage.xanalia.com/output/nft-image/94/1663065618839_2.gif',
    nftId: networkType === 'testnet' ? 681 : 45888,
    nftName:
      networkType === 'testnet' ? 'test auction' : ' #4657 Shiori (汐璃)',
    token_id: networkType === 'testnet' ? '235' : '4112',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/4657/25-30%E5%8F%A6%E5%A4%96%E7%BA%A2%E5%A4%B4.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
  },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image:
      'https://ik.imagekit.io/xanalia/xana-genesis/body-5a-eyes-18a-hairs-5d-clothes-41e-hairaccessories-16b-earringsright-8b.png',
    mainImage:
      'https://storage.xanalia.com/output/nft-image/94/1663066242795_1.jpeg',
    nftId: networkType === 'testnet' ? 684 : 51700,
    nftName: networkType === 'testnet' ? 'testcat auction' : ' #2062 Constanza',
    token_id: networkType === 'testnet' ? '236' : '7250',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/2062/25-30+(1).model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: false,
  },
];

//================================INFTCompanyOwned========================

export const INFTCompanyOwned = [
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image: 'https://ik.imagekit.io/xanalia/xana-genesis/004-.png',
    mainImage: 'models/School Girl/MODEL.jpeg',
    nftId: networkType === 'testnet' ? 986 : 41970,
    nftName: ' #3894 Karen',
    token_id: networkType === 'testnet' ? '237' : '103',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/School+Girl/31-35.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: true,
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
    isPublic: false,
    iNFT: true,
    voiceAllowed: true,
  },
  // {
  //     collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
  //     image: 'models/Black Bob Kimono/MODEL.jpeg',
  //     mainImage: 'models/Black Bob Kimono/MODEL.jpeg',
  //     nftId: networkType === 'testnet' ? 1052 : 1,
  //     nftName: 'Genie',
  //     token_id: networkType === 'testnet' ? '239' : '1',
  //     modalUrl: 'models/Black Bob Kimono/20-25.model3.json',
  //     isPublic: false,
  // iNFT: true,
  //     voiceAllowed: true
  // },
  {
    collectionAddress: '0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
    image: 'https://ik.imagekit.io/xanalia/xana-genesis/002-.png',
    mainImage: 'models/BROWN BOB/MODEL.jpeg',
    nftId: networkType === 'testnet' ? 1378 : 41968,
    nftName: ' #7857 Sana',
    token_id: networkType === 'testnet' ? '241' : '101',
    modalUrl:
      'https://api-test-xana.s3.amazonaws.com/xana-genisis/BROWN+BOB/10hair.model3.json',
    isPublic: false,
    iNFT: true,
    voiceAllowed: true,
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
    isPublic: false,
    iNFT: true,
    voiceAllowed: true,
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
    isPublic: false,
    iNFT: true,
    voiceAllowed: true,
  },
];
