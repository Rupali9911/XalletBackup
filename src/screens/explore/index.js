import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { twoPageChange } from '../../store/actions/twoDAction';
import {
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {
    SIZE,
    SVGS,
    COLORS,
    FONT
} from 'src/constants';
import {
    Header,
    SpaceView,
    BorderView,
    Container,
    RowWrap
} from 'src/styles/common.styles';
import {
    HeaderText,
    BoldText,
} from 'src/styles/text.styles';
import {
    MainContent,
    PriceTextInput,
    UserText,
    PriceLabel,
    DescriptionText,
    GroupButtonView,
    GrouponButton,
    GroupText,
    TimeLeftText
} from './styled';
import { FlexWrap, HeaderLeft } from '../../styles/common.styles';
import {
    Chart,
    Line,
    Area,
    HorizontalAxis,
    VerticalAxis
} from 'react-native-responsive-linechart';
import {
    KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import NftItem from '../detailScreen/nftItem';
import { getNFTList, pageChange } from '../../store/actions/nftTrendList';
import { changeScreenName } from '../../store/actions/authAction';
import { Loader } from '../../components';

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

    let list = ListReducer.nftList;

    let loading = ListReducer.nftListLoading;

    return (
        <Container>
            <Header>
                <HeaderText>
                    {'Explore'}
                </HeaderText>
            </Header>
            {
                loading ?
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

                        onEndReachedThreshold={1}
                        keyExtractor={(v, i) => "item_" + i}
                    />
            }
        </Container>
    )
}

export default ExploreScreen;