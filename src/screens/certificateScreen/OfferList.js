import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NFTDetailDropdown from '../../components/NFTDetailDropdown';
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';
import { ImagekitType } from '../../common/ImageConstant';
import { C_Image } from '../../components';
import tradingImg from '../../../assets/images/trading.png';
import { formatAddress } from '../../constants/addressFormat';
import { hp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { translate } from '../../walletUtils';
import styles from './styles';

// ====================== Trading History Component =======================
const OfferList = ({ offerHistory }) => {
    console.log("@@@ Offer ======>");
    const { offerList, role } = offerHistory;
    const navigation = useNavigation();

    const bidHistoryTableHead = [
        translate('common.price'),
        translate('common.from'),
        translate('common.date'),
        translate('common.expiration'),
    ];

    const renderCell = (index, cellData, rowIndex, iconUri) => {
        return (
            <Cell
                key={rowIndex}
                data={
                    index === 0 && iconUri ? (
                        <View style={CommonStyles.rowAlign}>
                            <C_Image
                                uri={iconUri}
                                size={ImagekitType.AVATAR}
                                imageStyle={styles.networkIcon}
                            />
                            <Text>{cellData}</Text>
                        </View>
                    ) : index === 1 ? (
                        renderAddress(cellData)
                    ) : (
                        cellData
                    )
                }
                borderStyle={styles.cellBorderStyle}
                textStyle={styles.text}
                width={index === 0 ? 130 : index === 1 ? 180 : index === 2 ? 180 : 200}
            />
        );
    };

    const renderAddress = cellData => {
        return (
            <TouchableOpacity
                disabled={!cellData}
                onPress={() =>
                    navigation.push('Profile', {
                        id: cellData,
                        role: role,
                    })
                }>
                <Text numberOfLines={1} style={[styles.text, styles.themeColor]}>
                    {formatAddress(cellData)}
                </Text>
            </TouchableOpacity>
        );
    };

    const noDataRender = history => {
        return (
            <Cell
                style={styles.emptyData(history)}
                data={translate('common.noDataFound')}
            />
        );
    };

    return (
        <NFTDetailDropdown
            title={translate('common.offers')}
            containerChildStyles={{
                height:
                    offerList?.length === 0
                        ? hp(19)
                        : offerList?.length < 5
                            ? hp(16) +
                            hp(4) * offerList?.length
                            : hp(35.7),
            }}
            icon={tradingImg}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // nestedScrollEnabled={true}
                style={{ marginVertical: hp(2) }}>
                <Table borderStyle={styles.cellBorderStyle}>
                    <Row
                        data={bidHistoryTableHead}
                        style={styles.head}
                        textStyle={styles.text}
                        widthArr={[130, 180, 180, 200]}
                    />
                    {offerList?.length > 0
                        ? offerList?.map((rowData, rowIndex) => {
                            let temprowData = rowData.slice(0, 4);
                            let iconUri = rowData.find((e, i) => i === 4);
                            return (
                                <TableWrapper key={rowIndex} style={CommonStyles.flexRow}>
                                    {temprowData?.map((cellData, cellIndex) => {
                                        return renderCell(
                                            cellIndex,
                                            cellData,
                                            rowIndex,
                                            iconUri,
                                        );
                                    })}
                                </TableWrapper>
                            );
                        })
                        : noDataRender()}
                </Table>
            </ScrollView>
        </NFTDetailDropdown>
    )
}

function arePropsEqual(prevProps, nextProps) {
    return prevProps.offerHistory.offerList === nextProps.offerHistory.offerList;
}

export default React.memo(OfferList, arePropsEqual);