import { StyleSheet } from 'react-native';

import {
  SIZE,
  FONTS
} from 'src/constants';
import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF } from '../../common/responsiveFunction';

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
  bannerImage: {
    width: '100%',
    height: SIZE(200),
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
    fontWeight: '500',
    textAlign: 'center',
    marginTop: SIZE(44),
    fontFamily: fonts.ARIAL,
    marginBottom: SIZE(5),
  },
  collectionTable: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  collectionTableRow: {
    alignItems: 'center',
    width: SIZE(80),
    height: SIZE(46),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: -1,
    borderColor: '#eeeeee',
  },
  collectionTableRowText: {
    fontSize: SIZE(12),
    fontFamily: fonts.ARIAL,
  },
  collectionTableRowDec: {
    fontSize: SIZE(11),
    color: '#7B848D',
    marginTop: SIZE(2),
    fontFamily: fonts.ARIAL,
  },
  cryptoIcon: {
    width: SIZE(8),
    height: SIZE(12),
    marginRight: SIZE(4),
  },
  descriptionTabWrapper: {
    flexDirection: 'row',
    paddingHorizontal: SIZE(5),
    marginTop: SIZE(20),
  },
  descriptionTab: {
    flex: 1,
    height: SIZE(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  descriptionTabText: {
    fontSize: SIZE(13),
    color: '#575e64',
    fontFamily: fonts.ARIAL,
  },
  description: {
    borderColor: '#eee',
    borderWidth: 1,
    height: SIZE(90),
    marginHorizontal: SIZE(5),
    borderTopWidth: 0,
    paddingHorizontal: SIZE(15),
    paddingVertical: SIZE(9),
    marginBottom: SIZE(16),
  },
  descriptionText: {
    fontSize: SIZE(13),
    fontFamily: fonts.ARIAL,
    color: '#212529',
  },
  listItem: {
    marginVertical: wp("2"),
    marginHorizontal: wp("1"),
    width: (wp('100%') / 2) - wp('2%'),
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
  },
  listImage: {
    width: '100%',
    height: (wp('100%') / 2) - wp('1%'),
    borderTopRightRadius: SIZE(12),
    borderTopLeftRadius: SIZE(12),
  },
  sorryMessageCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  sorryMessage: {
    fontSize: 15,
    fontFamily: fonts.SegoeUIRegular,
  },
  trendCont: {
    backgroundColor: colors.white,
    flex: 1
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
  },
})

export default styles;
