import { StyleSheet } from 'react-native';
import { hp, wp } from '../../constants/responsiveFunct';
import {
  SIZE,
  COLORS
} from 'src/constants';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  listItem: {
    height: wp('100%') / 3 - wp('0.5%'),
    marginVertical: wp('0.3'),
    marginHorizontal: wp('0.3'),
    width: wp('100%') / 3 - wp('0.5%'),
  },
  listImage: {
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    paddingVertical: hp(0.30),
    backgroundColor: COLORS.BLACKRGBA(0.5)
  },
  collectionListItem: {
    marginVertical: wp("2"),
    marginHorizontal: wp("1"),
    width: (wp('100%') / 2) - wp('2%'),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    borderRadius: wp("5"),
    elevation: 5,
  },
  nftListItem: {
    marginVertical: wp("2"),
    marginHorizontal: wp("1"),
    width: (wp('100%') / 3) - wp('3%'),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 5,
  },
  listItemContainer: {
    width: "100%",
    borderRadius: SIZE(20),
    overflow: 'hidden'
  },
  collectionListImage: {
    width: '100%',
    height: (wp('100%') / 2) - wp('1%'),
    resizeMode: 'stretch',
    borderTopRightRadius: SIZE(12),
    borderTopLeftRadius: SIZE(12),
    backgroundColor: 'white'
  },
  collectionListVideo: {
    width: '100%',
    height: (wp('100%') / 2) - wp('1%'),
    borderTopRightRadius: SIZE(12),
    borderTopLeftRadius: SIZE(12),
    backgroundColor: 'white'
  },
  likeButton: {
    position: 'absolute',
    zIndex: 1,
    top: SIZE(10),
    right: SIZE(10)
  },
  collectionWrapper: {
    backgroundColor: 'white',
    height: Platform.OS === 'android' ? (wp('100%') / 3) - wp('1%') : (wp('100%') / 3.3) - wp('1%'),
  },
  collectionWrapperBlind: {
    padding: SIZE(10),
    backgroundColor: 'white',
    borderBottomRightRadius: SIZE(12),
    borderBottomLeftRadius: SIZE(12),
    // height: (hp('100%') / 8),
    justifyContent: 'space-between'
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'Arial',
    fontSize: SIZE(15),
    fontWeight: '400'
  },
  titleText2: {
    fontSize: SIZE(12),
    fontWeight: '700',
    marginTop: 5,
  },
  AuctionText: {
    color: COLORS.greenLight,
    fontSize: SIZE(12),
    marginVertical: SIZE(10),
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceText: {
    color: COLORS.greenLight,
    marginVertical: SIZE(10),
    marginRight: SIZE(2),
    fontSize: SIZE(12),
  },
  soldOutText: {
    color: COLORS.greenLight,
    fontSize: SIZE(12),
    marginVertical: SIZE(10),
  },
  Line: {
    borderTopColor: '#F4F4F4',
    borderTopWidth: 1,
    marginBottom: 10,
    marginHorizontal: -9,
  },
  chainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: SIZE(7)
  },
  chainView1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  chainViewColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // borderTopColor: 'red',
    // borderTopColor: '#F4F4F4',
    // borderTopWidth: 1,
    // paddingTop: 10,
    // marginHorizontal: -9,
    // alignItems: 'center',
  },
  endTimeView: { flexDirection: 'row', alignItems: 'center' },
  priceText1: {
    color: COLORS.grayLight,
    marginRight: SIZE(2),
    fontSize: SIZE(12),
  },
  auctionTimeRemainText: {
    fontSize: SIZE(12),
    color: COLORS.grayLight,
  },
  lastText: {
    color: '#aaa',
    fontSize: SIZE(12),
  },
  lastPriceText: {
    color: '#aaa',
    marginRight: SIZE(2),
    fontSize: SIZE(12),
  },
  awadImage: {
    height: 20,
    width: 20,
    left: 2
  },
  soldOutText1: {
    color: COLORS.greenLight,
    fontSize: SIZE(12),
  },
  auctionEnded: {
    color: COLORS.greenLight,
    fontSize: SIZE(12),
    fontWeight: '700'
  },
  newPrice: {
    marginTop: SIZE(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  nftName: {
    fontFamily:'Arial',
    textAlign: 'left',
    fontSize: SIZE(18),
    fontWeight: '400',
  },

  currencyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tokenIcon: {
    width: SIZE(16),
    height: SIZE(16),
    borderRadius: SIZE(16),
    marginRight: SIZE(3),
  },
  price: {
    color: '#60c083',
    fontSize: SIZE(12),
    fontWeight: '700'
  },
  statusOnSale: {
    fontFamily:'Arial',
    fontSize: SIZE(12),
    fontWeight: '700',
    color: '#56bbf8'
  },
  statusSoldOut: {
    fontSize: SIZE(12),
    fontWeight: '700',
    color: '#ff0125'
  },
  tokenIcon2: {
    width: SIZE(28),
    height: SIZE(28),
    borderRadius: SIZE(28),
  },
  creatorIcon: {
    width: SIZE(26),
    height: SIZE(26),
    borderRadius: SIZE(26),
    overlayColor: 'white'
  },
  ownerIcon: {
    width: SIZE(26),
    height: SIZE(26),
    borderRadius: SIZE(26),
    overlayColor: 'white'
  },
  ownerContainer: {
      backgroundColor: Colors.white,
      width: SIZE(32),
      height: SIZE(32),
      borderRadius: SIZE(32),
      marginLeft: SIZE(-7),
      alignItems:'center',
      justifyContent: 'center'
  }
});
export default styles;
