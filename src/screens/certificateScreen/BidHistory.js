import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NFTDetailDropdown from '../../components/NFTDetailDropdown';
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';
import historyImg from '../../../assets/images/history.png';
import { formatAddress } from '../../constants/addressFormat';
import { hp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { translate } from '../../walletUtils';
import styles from './styles';

// ====================== Trading History Component =======================
const BidHistory = ({ bidHistory, isDropDownOpen }) => {
  const { sellDetails, role } = bidHistory;
  const navigation = useNavigation();

  const bidHistoryTableHead = [
    translate('common.price'),
    translate('common.from'),
    translate('common.date'),
    translate('common.expiration'),
  ];

  const renderCell = (index, cellData, rowIndex) => {
    return (
      <Cell
        key={rowIndex}
        data={
          index === 1 ? (
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
      title={translate('wallet.common.bidHistory')}
      containerChildStyles={{
        height:
          sellDetails?.length === 0
            ? hp(19)
            : sellDetails?.length < 5
              ? hp(16) +
              hp(4) * sellDetails?.length
              : hp(35.7),
      }}
      icon={historyImg}
      isDropDownOpen={isDropDownOpen}>
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
          {sellDetails.length > 0
            ? sellDetails?.map((rowData, rowIndex) => {
              return (
                <TableWrapper key={rowIndex} style={CommonStyles.flexRow}>
                  {rowData?.map((cellData, cellIndex) => {
                    return renderCell(cellIndex, cellData, rowIndex);
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
  return prevProps.bidHistory.sellDetails === nextProps.bidHistory.sellDetails;
}

export default React.memo(BidHistory, arePropsEqual);