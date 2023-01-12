import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import NFTDetailDropdown from '../../components/NFTDetailDropdown';
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';
import detailsImg from '../../../assets/images/details.png';
import { formatAddress } from '../../constants/addressFormat';
import { hp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { translate } from '../../walletUtils';
import styles from './styles';

// ====================== Filter Components ======================= 
const Filters = React.memo((props) => {
    const [open, setOpen] = useState(false);
    return (
        <DropDownPicker
            open={open}
            value={props.value}
            items={props.data}
            multiple={true}
            min={0}
            mode={'BADGE'}
            setOpen={setOpen}
            setValue={props.setValue}
            setItems={props.setData}
            onSelectItem={() => setOpen(false)}
            closeAfterSelecting={true}
            style={styles.tokenPicker}
            dropDownContainerStyle={styles.dropDownContainer}
            placeholder={translate('wallet.common.filter')}
            dropDownDirection={'BOTTOM'}
            maxHeight={hp(20)}
            listMode="SCROLLVIEW"
        />
    );
});

// ====================== Trading History Component =======================
const TradingHistory = ({ tradingHistory, setFilterTableValue, setFilterTableList, isDropDownOpen }) => {
    console.log("@@@ Trading ======>");
    const { tradingTableData, filterTableList, filterTableValue, role } = tradingHistory;

    const navigation = useNavigation();

    const tradingTableHead = [
        translate('common.event'),
        translate('common.price'),
        translate('common.from'),
        translate('common.to'),
        translate('common.date') + ' (YYYY/MM/DD)',
    ];

    const noDataRender = history => {
        return (
            <Cell
                style={styles.emptyData(history)}
                data={translate('common.noDataFound')}
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

    return (
        <NFTDetailDropdown
            title={translate('common.tradingHistory')}
            containerChildStyles={{
                height:
                    tradingTableData?.length === 0
                        ? hp(28)
                        : tradingTableData?.length < 5
                            ? hp(16) +
                            hp(4) *
                            (tradingTableData.length <= 3
                                ? 3.4
                                : tradingTableData?.length)
                            : hp(35.7),
            }}
            icon={detailsImg}
            isDropDownOpen={isDropDownOpen}>
            <Filters
                value={filterTableValue}
                setValue={setFilterTableValue}
                setData={setFilterTableList}
                data={filterTableList}
            />
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // nestedScrollEnabled={true}
                style={{ marginVertical: hp(2) }}>
                <Table borderStyle={styles.cellBorderStyle}>
                    <Row
                        data={tradingTableHead}
                        style={styles.head}
                        textStyle={styles.text}
                        widthArr={[200, 130, 180, 180, 200]}
                    />
                    {tradingTableData.length > 0
                        ? tradingTableData?.map((rowData, rowIndex) => {
                            return (
                                <TableWrapper key={rowIndex} style={CommonStyles.flexRow}>
                                    {rowData?.map((cellData, cellIndex) => {
                                        let wid;
                                        if (cellIndex === 0) {
                                            wid = 200;
                                        }
                                        if (cellIndex === 1) {
                                            wid = 130;
                                        }
                                        if (cellIndex === 2) {
                                            wid = 180;
                                        }
                                        if (cellIndex === 3) {
                                            wid = 180;
                                        }
                                        if (cellIndex === 4) {
                                            wid = 200;
                                        }
                                        return (
                                            <Cell
                                                key={cellIndex}
                                                data={
                                                    (cellIndex == 2 || cellIndex == 3) &&
                                                        cellData !== 'Null Address'
                                                        ? renderAddress(cellData)
                                                        : cellData
                                                }
                                                textStyle={styles.text}
                                                width={wid}
                                            />
                                        );
                                    })}
                                </TableWrapper>
                            );
                        })
                        : noDataRender('trading')}
                </Table>
            </ScrollView>
        </NFTDetailDropdown>
    )
}

function arePropsEqual(prevProps, nextProps) {
    return prevProps.tradingHistory.tradingTableData === nextProps.tradingHistory.tradingTableData && prevProps.tradingHistory.filterTableList === nextProps.tradingHistory.filterTableList;
}

export default React.memo(TradingHistory, arePropsEqual);