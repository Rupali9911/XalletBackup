import { StyleSheet } from 'react-native';

import { SIZE } from '../../common/responsiveFunction';
import { colors, fonts } from '../../res';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  responsiveFontSize as RF,
} from '../../common/responsiveFunction';

const styles = StyleSheet.create({
  backIcon: {
    width: SIZE(16),
    height: SIZE(16),
    resizeMode: 'contain',
  },
  backButtonWrap: {
    position: 'absolute',
    left: SIZE(10),
    top: SIZE(10),
    zIndex: 1,
    backgroundColor: 'white',
    width: SIZE(26),
    height: SIZE(26),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZE(13),
  },
  bannerView: {
    width: '100%',
    height: SIZE(200),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  bannerIconWrap: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    top: SIZE(158),
    zIndex: 1,
  },
  bannerIcon: {
    width: SIZE(85),
    height: SIZE(85),
    borderRadius: SIZE(43),
  },
  collectionName: {
    fontSize: SIZE(22),
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginTop: SIZE(44),
    fontFamily: fonts.ARIAL,
    marginBottom: SIZE(5),
  },
  verifyIcon: {
    position: 'absolute',
    bottom: 2,
    left: 23,
    width: SIZE(22),
    height: SIZE(22),
    borderRadius: SIZE(10)
  },
  tokenPicker: {
    borderColor: colors.themeR,
    width:'90%',
    height:'10%',
    alignSelf:'center',
    borderRadius:0,
    marginTop:10
  },
  dropDownContainer: {
    borderColor: colors.themeR,
    backgroundColor: colors.white,
    marginTop:10,
    width:'90%',
    borderRadius:0,
    alignSelf:'center',
  },
  verifyIcon1: {
    width: SIZE(15),
    height: SIZE(15),
    borderRadius: SIZE(10),
  },
  storeCollectionName: {
    fontSize: SIZE(22),
    fontWeight: '600',
    textAlign: 'left',
    fontFamily: fonts.ARIAL,
    marginBottom: SIZE(15),
  },
  collectionTable: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  collectionTableRow: {
    alignItems: 'center',
    // width: SIZE(86),
    height: SIZE(46),
    // alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: -1,
    borderColor: '#eeeeee',
    paddingHorizontal: SIZE(15)
  },
  collectionTableRowText: {
    fontSize: SIZE(14),
    fontFamily: fonts.ARIAL,
    fontWeight: 'bold',
  },
  collectionTableRowDec: {
    fontSize: SIZE(11),
    color: '#7B848D',
    marginTop: SIZE(2),
    fontFamily: fonts.ARIAL,
  },
  cryptoIcon: {
    width: SIZE(14),
    height: SIZE(14),
    marginRight: SIZE(2),
    resizeMode: "contain"
  },
  descriptionTabWrapper: {
    flexDirection: 'row',
    // paddingHorizontal: SIZE(5),
    marginTop: SIZE(20),
  },
  descriptionTab: {
    flex: 1,
    height: SIZE(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderBottomColor: 'transparent',
  },
  selectedDescriptionTab: {
    flex: 1,
    height: SIZE(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#eee',
  },
  descriptionTabText: {
    fontSize: SIZE(13),
    color: '#575e64',
    fontWeight: "bold",
    fontFamily: fonts.ARIAL,
  },
  description: {
    borderColor: '#eee',
    borderWidth: 1,
    height: SIZE(90),
    marginHorizontal: SIZE(5),
    // borderTopWidth: 0,
    paddingHorizontal: SIZE(15),
    paddingVertical: SIZE(12),
    marginBottom: SIZE(16),
  },
  descriptionText: {
    fontSize: SIZE(12.5),
    // lineHeight: 18,
    fontFamily: fonts.ARIAL,
    color: '#212529',
  },
  sorryMessageCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sorryMessage: {
    fontSize: 15,
    fontFamily: fonts.SegoeUIRegular,
  },
  trendCont: {
    backgroundColor: colors.white,
    flex: 1,
  },
  tabBarItem: {
    width: SIZE(84),
    height: SIZE(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: colors.BLUE4,
    borderTopWidth: 2,
  },
  tabBarLabel: {
    fontSize: RF(1.6),
    fontFamily: fonts.SegoeUIRegular,
    textTransform: 'capitalize',
    fontWeight: "400",
    color: '#212529'

  },
  socialLinksWrap: {
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  headerContent: {
    position: 'absolute',
    right: SIZE(10),
    top: SIZE(10),
    zIndex: 1,
    backgroundColor: 'white',
    width: SIZE(26),
    height: SIZE(26),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZE(13),
  },
  chainListWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE(10),
    marginBottom: SIZE(10),
  },
  chainListButton: {
    width: SIZE(78),
    paddingVertical: SIZE(4),
    marginHorizontal: SIZE(2),
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chainListButtonText: {
    fontSize: SIZE(12),
    marginLeft: SIZE(2),
  },
  selectBlindBoxVideo: {
    width: '100%',
    height: SIZE(400),
    resizeMode: 'contain',
    marginBottom: SIZE(20),
  },
  selectBlindBoxName: {
    fontSize: SIZE(20),
    color: 'red',
    fontWeight: 'bold',
  },
  sellButton: {
    width: '100%',
    height: SIZE(38),
    backgroundColor: 'black',
    borderRadius: SIZE(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZE(15),
  },
  intoMystery: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp('100%')
  },
  descriptionTabData: {
    fontSize: SIZE(18),
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 5
  },
  floorPriceVw: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  blindBoxLoader: {
    position:"absolute",
    alignSelf:'center'
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'flex-start' 
  },
  tableView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center' 
  },
  tableCellImageView: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: 200
  },
  cellImage: {
    height: hp(5.5), 
    width: hp(5.5), 
    borderRadius: 3, 
    marginRight: 10,
  },
  cellAddress: {
    color: 'black',
    marginLeft: hp(0.5),
    marginRight: hp(0.5)
  },
  textStyle: {
    margin: SIZE(10), 
    fontSize: SIZE(12) 
  }

});

export default styles;
