import { StyleSheet } from 'react-native';
import { hp, wp } from '../../constants/responsiveFunct';
import {
  SIZE,
  COLORS
} from 'src/constants';

const styles = StyleSheet.create({
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
    height: (wp('100%') / 3) - wp('1%'),
    resizeMode: 'stretch',
    borderTopRightRadius: SIZE(12),
    borderTopLeftRadius: SIZE(12),
  },
  collectionListVideo: {
    width: '100%',
    height: (wp('100%') / 3) - wp('1%'),
    borderTopRightRadius: SIZE(12),
    borderTopLeftRadius: SIZE(12),
  },
  iconImage: {
    width: SIZE(46),
    height: SIZE(46),
    borderRadius: SIZE(23),
    marginTop: SIZE(-33),
    // backgroundColor: '#d8d8d8',
  },
  collectionWrapper: {
    padding: SIZE(10),
    backgroundColor: 'white',
    borderBottomRightRadius: SIZE(12),
    borderBottomLeftRadius: SIZE(12),
    height: (wp('100%') / 2.7) - wp('1%'),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  bottomCenterWrap: {
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  byUser: {
    marginTop:SIZE(3),
    fontFamily:'Arial',
    fontWeight:'400',
    color: '#56bbf8',
    fontSize: SIZE(12),
  },
  collectionName: {
    fontFamily:'Arial',
    fontWeight:'400',
    color: '#23262f',
    fontSize: SIZE(14),
    marginBottom: SIZE(4),
    marginHorizontal: SIZE(5),
  },
  soldOutText: {
    color: COLORS.greenLight,
    fontSize: SIZE(12),
    marginVertical: SIZE(10),
  },
  verifyIcon: {
    position: 'absolute',
    bottom: 2,
    left: 37,
    width: SIZE(14),
    height: SIZE(14),
    borderRadius: SIZE(10)
  },
  verifyIcon: {
    width: SIZE(14),
    height: SIZE(14),
    borderRadius: SIZE(10)
  },
  bottomText:{
    flexDirection:'row',
    width:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  count:{
    fontFamily:'Arial',
    fontWeight:'400',
    marginTop:SIZE(10),
    color: '#a660d8',
    fontSize: SIZE(12)
  }
});
export default styles;
