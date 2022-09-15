export const CREATED_DRAFT_TYPES = [
    {
        title: 'CHOOSE_VALUE',
        value: '',
    },
    {
        title: 'CREATED',
        value: 1,
    },
    {
        title: 'DRAFT',
        value: 0,
    },
]

export const CREATED_COLLECTED_FILTER = [
    {
        title: 'CHOOSE_VALUE',
        value: '',
    },
    {
        title: 'CREATED',
        value: 'created',
    },
    {
        title: 'COLLECTED',
        value: 'collected',
    },
]

export const FILTER_ITEMS_KEY = {
    CREATED_DRAFT_KEY: 'createdDraftType',
    CREATED_COLLECTED_KEY: 'createdCollected',
    NETWORK_TYPE_KEY: 'networkType',
    COLLECTION_KEY: 'collection',
    ACTION_SEARCH_KEY: 'actionSearch',
}

export const SORT_FILTER_LIST = {
    MOST_LIKE: 0,
    ON_SALE: 1,
    RECENTLY_CREATED: 2,
    LOW_TO_HIGH: 3,
    HIGH_TO_LOW: 4,
    ON_AUTION: 5,
}

export const sortFilterList = [
    {
        value: SORT_FILTER_LIST.MOST_LIKE,
        label: 'MOST_LIKED',
    },
    {
        value: SORT_FILTER_LIST.ON_SALE,
        label: 'ON_SALE',
    },
    {
        value: SORT_FILTER_LIST.RECENTLY_CREATED,
        label: 'RECENTLY_CREATED',
    },
    {
        value: SORT_FILTER_LIST.LOW_TO_HIGH,
        label: 'PRICE_LOW_TO_HIGH',
    },
    {
        value: SORT_FILTER_LIST.HIGH_TO_LOW,
        label: 'PRICE_HIGH_TO_LOW',
    },
    {
        value: SORT_FILTER_LIST.ON_AUTION,
        label: 'ON_AUCTION',
    },
]

export const CATEGORY_FILTER_LIST = {
    trending: 0,
    art: 1,
    image: 2,
    gif: 3,
    movie: 4,
    music: 5,
    all_nfts: 6,
}

export const FILTER_NFT_IN_COLLECTION = {
    on_sale: 1,
    not_on_sale: 2,
    gallery: 3,
}

export const NFT_BY_USER = {
    created: 1,
    owned: 2,
}
