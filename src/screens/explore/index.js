import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    ActivityIndicator,
    FlatList,
    View,
    StyleSheet
} from 'react-native';
import {
    Header,
    Container
} from 'src/styles/common.styles';
import {
    HeaderText
} from 'src/styles/text.styles';
import NftItem from '../detailScreen/nftItem';
import { getNFTList, pageChange } from '../../store/actions/nftTrendList';
import { changeScreenName } from '../../store/actions/authAction';
import { Loader, AppHeader } from '../../components';
import { colors } from '../../res';
import { translate } from '../../walletUtils';
import AppSearch from '../../components/appSearch';
import { hp } from '../../constants/responsiveFunct';

function ExploreScreen() {

    const { ListReducer } = useSelector(state => state);
    const dispatch = useDispatch();

    const getNFTlistData = React.useCallback((page) => {
        dispatch(getNFTList(page))
    }, []);

    const handlePageChange = (page) => {
        dispatch(pageChange(page))
    }

    const renderFooter = () => {
        if (!ListReducer.nftListLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    const renderItem = ({ item }) => {
        let findIndex = ListReducer.nftList.findIndex(x => x.id === item.id);
        if (item.metaData) {
            return (
                <NftItem item={item} index={findIndex} />
            )
        }
    }

    const memoizedValue = useMemo(
        () => renderItem,
        [ListReducer.nftList],
    );


    return (
        <Container>
            <Header>
                <HeaderText>
                    {translate("wallet.common.explore")}
                </HeaderText>
            </Header>
            <View style={{ flex: 1 }}>
                <View style={styles.listContainer}>
                    {
                        ListReducer.page === 1 && ListReducer.nftListLoading ?
                            <View style={styles.loaderContainer}><Loader /></View> :
                            <FlatList
                                initialNumToRender={10}
                                data={ListReducer.nftList}
                                renderItem={memoizedValue}
                                onEndReached={() => {
                                    if (!ListReducer.nftListLoading) {
                                        let num = ListReducer.page + 1;
                                        getNFTlistData(num);
                                        handlePageChange(num);
                                    }
                                }}
                                ListFooterComponent={renderFooter}
                                onEndReachedThreshold={1}
                                keyExtractor={(v, i) => "item_" + i}
                            />
                    }
                </View>
                <AppSearch />
            </View>
        </Container>
    )
}

export default ExploreScreen;

const styles = StyleSheet.create({
    listContainer: {
        paddingTop: hp("6%"),
        width: '100%',
        height: '100%',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center'
    }
});
