import { StyleSheet } from 'react-native';
import { hp, wp } from '../../constants/responsiveFunct';
import {
  SIZE,
  COLORS
} from 'src/constants';

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
    shadowRadius: 1,

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
  },
  collectionListVideo: {
    width: '100%',
    height: (wp('100%') / 2) - wp('1%'),
    borderTopRightRadius: SIZE(12),
    borderTopLeftRadius: SIZE(12),
  },
  likeButton: {
    position: 'absolute',
    zIndex: 1,
    top: SIZE(10),
    right: SIZE(10)
  },
  collectionWrapper: {
    padding: SIZE(10),
    backgroundColor: 'white',
    borderBottomRightRadius: SIZE(12),
    borderBottomLeftRadius: SIZE(12),
    height: (hp('100%') / 8) ,
    justifyContent: 'space-between'
  },
});
export default styles;
