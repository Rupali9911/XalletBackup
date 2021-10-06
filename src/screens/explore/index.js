import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    ActivityIndicator,
    FlatList,
} from 'react-native';
import {
    SVGS,
} from 'src/constants';
import {
    Header,
    Container,
} from 'src/styles/common.styles';
import {
    HeaderText,
} from 'src/styles/text.styles';
import NftItem from '../detailScreen/nftItem';
import { getNFTList, pageChange, nftLoadStart } from '../../store/actions/nftTrendList';
import { changeScreenName } from '../../store/actions/authAction';
import { Loader } from '../../components';
import { colors } from '../../res';
import { translate } from '../../walletUtils';

const {
    LeftArrowIcon
} = SVGS;

function ExploreScreen({
    navigation
}) {

    const [listIndex, setListIndex] = React.useState(0);
    const { ListReducer, AuthReducer, NewNFTListReducer, MyNFTReducer, TwoDReducer } = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(changeScreenName("Hot"))
    }, []);

    const getNFTlistData = React.useCallback((page) => {
        dispatch(getNFTList(page))

    });

    const handlePageChange = (page) => {
        dispatch(pageChange(page))
    }

    const renderFooter = () => {
        if (!ListReducer.nftListLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    let list = ListReducer.nftList;

    let loading = ListReducer.nftListLoading;

    return (
        <Container>
            <Header>
                <HeaderText>
                    {translate("wallet.common.explore")}
                </HeaderText>
            </Header>
            {
                ListReducer.page === 1 && loading ?
                    <Loader /> :
                    <FlatList
                        initialNumToRender={10}
                        data={list.slice(listIndex)}
                        renderItem={({ item }) => {
                            let findIndex = list.findIndex(x => x.id === item.id);
                            if (item.metaData) {
                                return (
                                    <NftItem item={item} index={findIndex} />
                                )
                            }
                        }}
                        onEndReached={() => {
                            let num = AuthReducer.screenName == "Hot" ?
                                ListReducer.page + 1 :
                                AuthReducer.screenName == "newNFT" ?
                                    NewNFTListReducer.newListPage + 1 :
                                    AuthReducer.screenName == "favourite" ?
                                        MyNFTReducer.favoritePage + 1 :
                                        AuthReducer.screenName == "twoDArt" ?
                                            TwoDReducer.page + 1 : null;
                            getNFTlistData(num)
                            handlePageChange(num)
                        }}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={1}
                        keyExtractor={(v, i) => "item_" + i}
                    />
            }
        </Container>
    )
}

export default ExploreScreen;