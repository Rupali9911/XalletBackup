import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  responsiveFontSize as RF,
} from '../../common/responsiveFunction';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: colors.GREY8,
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: RF(2.5),
    fontFamily: fonts.PINGfANG_SBOLD,
    color: colors.black,
  },
  titleDes: {
    color: colors.GREY7,
    fontSize: RF(1.5),
    marginVertical: hp('1%'),
    fontFamily: fonts.PINGfANG,
  },
  collectionButton: {
    padding: wp('2%'),
    paddingVertical: wp('1.5%'),
    backgroundColor: colors.BLUE4,
  },
  collectionButtonLabel: {
    color: 'white',
    fontFamily: fonts.PINGfANG,
    fontSize: RF(1.5),
  },
  childCont: {
    flex: 1,
    backgroundColor: colors.GREY8,
    paddingVertical: hp('2%'),
  },
  cardfieldCount: {
    fontSize: RF(1.5),
    fontFamily: fonts.SegoeUIRegular,
    color: colors.BLACK7,
    marginTop: hp('1%'),
  },
  imageMainCard: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  cardImageCont: {
    width: '100%',
    height: hp('30%'),
    backgroundColor: colors.GREY11,
  },
  completeImage: {
    flex: 1,
    backgroundColor: colors.GREY11,
    height: null,
    width: null,
    resizeMode: 'contain',
  },
  bannerCardCont: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1%'),
  },
  bannerDes: {
    fontSize: RF(1.3),
    fontFamily: fonts.SegoeUIRegular,
    color: colors.BLACK2,
    marginVertical: hp('1%'),
  },
  changeBtn: {
    alignSelf: 'flex-end',
    width: wp('20%'),
  },
  saveBtnGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  groupField: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerFieldCont: {
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
  },
  leftToggle: {
    width: '30%',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightToggle: {
    width: '30%',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  imageStyles: size => ({
    height: wp(size),
    width: wp(size),
    resizeMode: 'contain',
  }),
  listMainCont: {
    marginVertical: hp(3),
    flex: 1,
  },
  listCont: {
    flexDirection: 'row',
    paddingVertical: hp(1),
    alignItems: 'center',
  },
  listLeft: {
    width: wp('10%'),
  },
  listCenter: {
    flex: 1,
    paddingHorizontal: wp(3),
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.GREY9,
    marginVertical: hp(1),
  },
  listTitle: {
    fontSize: RF(1.5),
    color: colors.BLUE5,
    fontFamily: fonts.PINGfANG_SBOLD,
  },
  listLabel: {
    fontSize: RF(1.5),
    color: colors.BLUE5,
    fontFamily: fonts.SegoeUIRegular,
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
  thumbNail: {
    height: wp(20),
    width: wp(20),
    overflow: "hidden",
    borderRadius: wp(2)
  },
  cardDesCont: {
    paddingVertical: hp("1%"),
    paddingHorizontal: wp(5)
  },
  nftImageError: {
    textAlign: 'center',
    color: "red",
    marginVertical: 0
  },
  thumbnailEditButton: {
    color: colors.BLUE6,
    paddingHorizontal: wp(5),
    fontSize: RF(1.8)
  },
  tagCont: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  tagItems: {
    width: null,
    paddingHorizontal: wp(5),
    height: hp(4),
    borderRadius: wp(1),
    marginHorizontal: wp(2),
    marginVertical: hp(1),
  },
  negIcon: {
    color: colors.BLUE6,
    fontSize: RF(2.7),
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: colors.white,
  },
  modalCont: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: wp('2%'),
    maxHeight: hp(80),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('3%')
  },
  modalTitle: {
    fontFamily: fonts.ARIAL_BOLD,
    fontSize: RF(2.5),
    color: colors.BLACK8,
    textAlign: "center"
  },
  modalItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp("5%"),
  },
  listLabel1: {
    fontFamily: fonts.ARIAL,
    fontSize: RF(1.9),
    color: colors.BLACK8,
  },
  progressLoader: {
    width: "100%",
    marginVertical: hp(3),
    justifyContent: "center",
    alignItems: "center"
  },
  error: {
    fontSize: RF(1.4),
    fontFamily: fonts.ARIAL,
    color: "red",
    textAlign: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: hp(1)
  },
  modalNftItemCont: {
    width: "100%",
    paddingVertical: hp(1),
    flexDirection: "row",
    justifyContent: "space-between"
  },
  nftImageCont: {
    width: "100%",
    paddingVertical: hp(2),
    justifyContent: "center",
    alignItems: "center"
  }
});

export default styles;
