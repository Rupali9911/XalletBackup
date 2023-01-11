// import React from 'react';
import React, {useCallback} from 'react';
import {
  View,
  StyleSheet,
  ListRenderItemm,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import {
  Tabs,
  CollapsibleRef,
  CollapsibleProps,
} from 'react-native-collapsible-tab-view';
import {COLORS, FONT, FONTS, SIZE, SVGS} from 'src/constants';
import {AppHeader, C_Image} from '../../components';
import colors from '../../res/colors';
import {ImagekitType} from '../../common/ImageConstant';
import {IMAGES} from '../../constants';
import DummyImg from '../../../assets/images/DummyImg.jpeg';
import {EditButton, EditButtonText} from '../profile/styled';
import {
  heightPercentageToDP as hp,
  responsiveFontSize as RF,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import AppBackground from '../../components/appBackground';
import Contacts from './arrays';
import NftCreated from '../profile/nftCreated';

const {SettingIcon, DefaultProfile} = SVGS;

const DummyProfile = props => {
  const renderBannerImage = () => {
    const renderBanner = useCallback(() => {
      return (
        <Image
          style={styles.collectionListImage}
          resizeMode="contain"
          source={DummyImg}
        />
      );
    }, []);

    return renderBanner();
  };

  const renderIconImage = () => {
    return (
      <View style={styles.iconImage}>
        <DefaultProfile width={SIZE(150)} height={SIZE(150)} />
      </View>
    );
  };

  const HeaderComponent = () => {
    return (
      <View>
        <View
          style={{
            position: 'relative',
            paddingBottom: SIZE(10),
          }}>
          <View>
            <TouchableOpacity style={styles.settings}>
              <SettingIcon width={SIZE(23)} height={SIZE(23)} />
            </TouchableOpacity>
            <View style={styles.collectionWrapper}>{renderBannerImage()}</View>
            <View style={styles.iconWrapper}>
              <View style={styles.iconBadgeVw}>{renderIconImage()}</View>
            </View>
            <View style={styles.socialSiteView}>
              <Text>Social Links</Text>
            </View>
            <EditButton
              style={{
                alignSelf: 'center',
                width: wp(60),
                height: hp(4),
                marginTop: SIZE(5),
              }}>
              <EditButtonText>{'Edit Profile'}</EditButtonText>
            </EditButton>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AppBackground>
      <Tabs.Container renderHeader={HeaderComponent} {...props} lazy>
        <Tabs.Tab name="article" label="Article">
          <Contacts />
        </Tabs.Tab>
        <Tabs.Tab name="albums" label="Albums">
          <Contacts />
        </Tabs.Tab>
        {/* <Tabs.Tab name="contacts" label="Contacts">
          <NftCreated />
        </Tabs.Tab>
        <Tabs.Tab name="ordered" label="Ordered">
          <NftCreated />
        </Tabs.Tab> */}
      </Tabs.Container>
    </AppBackground>
  );
};

export default DummyProfile;

const styles = StyleSheet.create({
  header: {
    // height: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196f3',
  },

  buttonText: {
    padding: 20,
    color: 'white',
    fontSize: 20,
  },
  listInner: {
    padding: 10,
    backgroundColor: '#2196f3',
    color: 'white',
    fontSize: 20,
    alignItems: 'center',
  },

  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
  },
  content: {
    paddingVertical: 16,
  },
  author: {
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  meta: {
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  name: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 24,
  },
  timestamp: {
    color: '#999',
    fontSize: 14,
    lineHeight: 21,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 36,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  paragraph: {
    color: '#000',
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 8,
  },

  box: {
    height: 250,
    width: '100%',
  },
  boxA: {
    backgroundColor: 'white',
  },
  boxB: {
    backgroundColor: '#D8D8D8',
  },
  header: {
    // height: HEADER_HEIGHT,
    width: '100%',
    backgroundColor: '#2196f3',
  },
  tabStyle: {
    height: SIZE(40),
    width: wp('50%'),
    paddingHorizontal: wp('1%'),
    justifyContent: 'center',
  },
  label: {
    fontSize: RF(1.6),
    fontFamily: 'Arial',
    textTransform: 'none',
  },
  tabbar: {
    elevation: 0,
    borderTopColor: '#EFEFEF',
    borderTopWidth: 1,
    shadowOpacity: 0,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  collectionWrapper: {
    height: SIZE(200),
    alignItems: 'center',
    backgroundColor: colors.DARK_GREY,
  },
  iconImage: {
    width: SIZE(140),
    height: SIZE(140),
    borderRadius: SIZE(150),
    backgroundColor: colors.PERIWINKLE,
    alignItems: 'center',
  },
  iconWrapper: {
    marginTop: SIZE(-80),
    marginBottom: SIZE(10),
    alignItems: 'center',
    height: SIZE(150),
  },
  collectionListImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  settings: {
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'flex-end',
    right: SIZE(10),
    top: SIZE(10),
  },
  socialSiteView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: SIZE(15),
  },
});

// import * as Tabs from 'react-native-collapsible-tab-view';

// import React, {useCallback} from 'react';
// import {
//   View,
//   StyleSheet,
//   ListRenderItemm,
//   TouchableOpacity,
//   Image,
//   Text,
//   ScrollView,
//   RefreshControl,
//   useWindowDimensions,
//   SafeAreaView,
// } from 'react-native';

// import AppBackground from '../../components/appBackground';
// import {COLORS, FONT, FONTS, SIZE, SVGS} from 'src/constants';
// import {AppHeader, C_Image} from '../../components';
// import colors from '../../res/colors';
// import {ImagekitType} from '../../common/ImageConstant';
// import {IMAGES} from '../../constants';
// import DummyImg from '../../../assets/images/DummyImg.jpeg';
// import {EditButton, EditButtonText} from '../profile/styled';
// import {
//   heightPercentageToDP as hp,
//   responsiveFontSize as RF,
//   widthPercentageToDP as wp,
// } from '../../common/responsiveFunction';
// import NFTCreated from '../profile/nftCreated';
// import NftOwned from '../profile/nftOwned';
// import {useRefresh} from './useRefresh';
// import Contacts from './arrays';

// const {SettingIcon, DefaultProfile} = SVGS;

// const HEADER_HEIGHT = 200;
// const title = 'Adding and removing tabs dynamically';

// const ComponentTypes = [<NFTCreated />, <NftOwned />];

// const DummyProfile = () => {
//   const [tabs, setTabs] = React.useState([
//     {name: 'Created', component: ComponentTypes[0]},
//     {name: 'Owner', component: ComponentTypes[1]},
//     // {name: 'Owner', component: ComponentTypes[1]},
//   ]);

//   const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
//   const [tabName, setTabName] = React.useState('Created');

//   const renderBannerImage = () => {
//     const renderBanner = useCallback(() => {
//       return (
//         <Image
//           style={styles.collectionListImage}
//           resizeMode="contain"
//           source={DummyImg}
//         />
//       );
//     }, []);

//     return renderBanner();
//   };

//   const renderIconImage = () => {
//     return (
//       <View style={styles.iconImage}>
//         <DefaultProfile width={SIZE(150)} height={SIZE(150)} />
//       </View>
//     );
//   };

//   const HeaderComponent = () => {
//     return (
//       <View>
//         <View
//           style={{
//             position: 'relative',
//             paddingBottom: SIZE(10),
//           }}>
//           <View>
//             <TouchableOpacity style={styles.settings}>
//               <SettingIcon width={SIZE(23)} height={SIZE(23)} />
//             </TouchableOpacity>
//             <View style={styles.collectionWrapper}>{renderBannerImage()}</View>
//             <View style={styles.iconWrapper}>
//               <View style={styles.iconBadgeVw}>{renderIconImage()}</View>
//             </View>
//             <View style={styles.socialSiteView}>
//               <Text>Social Links</Text>
//             </View>
//             <EditButton
//               style={{
//                 alignSelf: 'center',
//                 width: wp(60),
//                 height: hp(4),
//                 marginTop: SIZE(5),
//               }}>
//               <EditButtonText>{'Edit Profile'}</EditButtonText>
//             </EditButton>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const TabBarComponent = React.useCallback(
//     props => (
//       <Tabs.MaterialTabBar
//         {...props}
//         scrollEnabled
//         tabStyle={{
//           width: wp('50%'),
//           paddingHorizontal: wp('1%'),
//           justifyContent: 'center',
//         }}
//         activeColor={COLORS.BLUE2}
//         inactiveColor={COLORS.BLACK5}
//         labelStyle={{
//           fontSize: RF(1.6),
//           fontFamily: 'Arial',
//           textTransform: 'none',
//         }}
//         indicatorStyle={{
//           borderBottomColor: COLORS.BLUE4,
//           height: 1,
//           marginBottom: SIZE(39),
//           backgroundColor: COLORS.BLUE4,
//         }}
//         index={currentTabIndex}
//         focusedTab={tabName}
//       />
//     ),
//     [],
//   );

//   const makeLabel = useCallback(props => {
//     <Tabs.TabItem
//       index={props.index}
//       indexDecimal={props.indexDecimal}
//       label={props.label}
//     />;
//   }, []);

//   return (
//     <AppBackground>
//       <Tabs.Container
//         renderHeader={HeaderComponent}
//         // lazy={true}
//         // cancelLazyFadeIn={false}
//         onTabChange={e => {
//           setTabName(e.tabName);
//         }}
//         onIndexChange={index => {
//           setCurrentTabIndex(index);
//         }}
//         renderTabBar={TabBarComponent}
//         // initialTabName={}
//       >
//         {tabs.map(tab => {
//           return (
//             <Tabs.Tab name={tab.name} key={tab.name}>
//               {tab.component}
//             </Tabs.Tab>
//           );
//         })}
//         {/* <Tabs.Tab name={'A'} label={'A'}>
//           <NFTCreated />
//         </Tabs.Tab>
//         <Tabs.Tab name={'B'} label={'B'}>
//           <NFTCreated />
//         </Tabs.Tab> */}
//       </Tabs.Container>
//     </AppBackground>
//   );
// };

// export default DummyProfile;

// const styles = StyleSheet.create({
//   header: {
//     height: HEADER_HEIGHT,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#2196f3',
//   },

//   buttonText: {
//     padding: 20,
//     color: 'white',
//     fontSize: 20,
//   },
//   listInner: {
//     padding: 10,
//     backgroundColor: '#2196f3',
//     color: 'white',
//     fontSize: 20,
//     alignItems: 'center',
//   },

//   scrollViewContainer: {
//     flexGrow: 1,
//     backgroundColor: 'white',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   container: {
//     backgroundColor: 'white',
//   },
//   content: {
//     paddingVertical: 16,
//   },
//   author: {
//     flexDirection: 'row',
//     marginVertical: 8,
//     marginHorizontal: 16,
//   },
//   meta: {
//     marginHorizontal: 8,
//     justifyContent: 'center',
//   },
//   name: {
//     color: '#000',
//     fontWeight: 'bold',
//     fontSize: 16,
//     lineHeight: 24,
//   },
//   timestamp: {
//     color: '#999',
//     fontSize: 14,
//     lineHeight: 21,
//   },
//   avatar: {
//     height: 48,
//     width: 48,
//     borderRadius: 24,
//   },
//   title: {
//     color: '#000',
//     fontWeight: 'bold',
//     fontSize: 36,
//     marginVertical: 8,
//     marginHorizontal: 16,
//   },
//   paragraph: {
//     color: '#000',
//     fontSize: 16,
//     lineHeight: 24,
//     marginVertical: 8,
//     marginHorizontal: 16,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//     marginVertical: 8,
//   },

//   box: {
//     height: 250,
//     width: '100%',
//   },
//   boxA: {
//     backgroundColor: 'white',
//   },
//   boxB: {
//     backgroundColor: '#D8D8D8',
//   },
//   header: {
//     height: HEADER_HEIGHT,
//     width: '100%',
//     backgroundColor: '#2196f3',
//   },
//   tabStyle: {
//     height: SIZE(40),
//     width: wp('50%'),
//     paddingHorizontal: wp('1%'),
//     justifyContent: 'center',
//   },
//   label: {
//     fontSize: RF(1.6),
//     fontFamily: 'Arial',
//     textTransform: 'none',
//   },
//   tabbar: {
//     elevation: 0,
//     borderTopColor: '#EFEFEF',
//     borderTopWidth: 1,
//     shadowOpacity: 0,
//     backgroundColor: 'white',
//     marginVertical: 10,
//   },
//   collectionWrapper: {
//     height: SIZE(200),
//     alignItems: 'center',
//     backgroundColor: colors.DARK_GREY,
//   },
//   iconImage: {
//     width: SIZE(140),
//     height: SIZE(140),
//     borderRadius: SIZE(150),
//     backgroundColor: colors.PERIWINKLE,
//     alignItems: 'center',
//   },
//   iconWrapper: {
//     marginTop: SIZE(-80),
//     marginBottom: SIZE(10),
//     alignItems: 'center',
//     height: SIZE(150),
//   },
//   collectionListImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   settings: {
//     position: 'absolute',
//     zIndex: 10,
//     alignSelf: 'flex-end',
//     right: SIZE(10),
//     top: SIZE(10),
//   },
//   socialSiteView: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     marginTop: SIZE(15),
//   },
// });

// // import React, {useCallback} from 'react';
// // import {
// //   View,
// //   StyleSheet,
// //   ListRenderItemm,
// //   TouchableOpacity,
// //   Image,
// //   Text,
// //   ScrollView,
// //   RefreshControl,
// //   useWindowDimensions,
// //   SafeAreaView,
// // } from 'react-native';
// // import {
// //   Tabs,
// //   MaterialTabBar,
// //   MaterialTabItem,
// //   CollapsibleProps,
// // } from 'react-native-collapsible-tab-view';
// // import {TabBar, TabView} from 'react-native-tab-view';

// // import AppBackground from '../../components/appBackground';
// // import {COLORS, FONT, FONTS, SIZE, SVGS} from 'src/constants';
// // import {AppHeader, C_Image} from '../../components';
// // import colors from '../../res/colors';
// // import {ImagekitType} from '../../common/ImageConstant';
// // import {IMAGES} from '../../constants';
// // import DummyImg from '../../../assets/images/DummyImg.jpeg';
// // import {EditButton, EditButtonText} from '../profile/styled';
// // import {
// //   heightPercentageToDP as hp,
// //   responsiveFontSize as RF,
// //   widthPercentageToDP as wp,
// // } from '../../common/responsiveFunction';
// // import NFTCreated from '../profile/nftCreated';
// // import AiChat from '../AiChat';
// // import NftOwned from '../profile/nftOwned';
// // import {useRefresh} from './useRefresh';
// // // const {contentContainerStyle, progressViewOffset, style} =
// // //   useCollapsibleStyle();

// // const {
// //   ConnectSmIcon,
// //   SettingIcon,
// //   CopyToClipboard,
// //   EditImage,
// //   CopyProfile,
// //   SettingIconBlack,
// //   DefaultProfile,
// //   YouTubeIcon,
// //   WebIcon,
// //   Twitter,
// //   Instagram,
// //   DiscordIcon,
// //   VerficationIcon,
// // } = SVGS;

// // const HEADER_HEIGHT = 250;

// // const DATA = [0, 1, 2, 3, 4];
// // const identity = v => v + '';

// // const Header = () => {
// //   return <View style={styles.header} />;
// // };

// // const DummyProfile = props => {
// //   const windowHeight = useWindowDimensions().height;
// //   const [isRefreshing, startRefreshing] = useRefresh();

// //   const renderBannerImage = () => {
// //     const renderBanner = useCallback(() => {
// //       return (
// //         <Image
// //           style={styles.collectionListImage}
// //           resizeMode="contain"
// //           source={DummyImg}
// //         />
// //       );
// //     }, [isRefreshing]);

// //     return renderBanner();
// //   };

// //   const renderIconImage = () => {
// //     return (
// //       <View style={styles.iconImage}>
// //         <DefaultProfile width={SIZE(150)} height={SIZE(150)} />
// //       </View>
// //     );
// //   };

// //   const Header = () => {
// //     return (
// //       <View>
// //         <View
// //           style={{
// //             position: 'relative',
// //             paddingBottom: SIZE(10),
// //           }}>
// //           <View>
// //             <TouchableOpacity style={styles.settings}>
// //               <SettingIcon width={SIZE(23)} height={SIZE(23)} />
// //             </TouchableOpacity>
// //             <View style={styles.collectionWrapper}>{renderBannerImage()}</View>
// //             <View style={styles.iconWrapper}>
// //               <View style={styles.iconBadgeVw}>{renderIconImage()}</View>
// //             </View>
// //             <View style={styles.socialSiteView}>
// //               <Text>Social Links</Text>
// //             </View>
// //             <EditButton
// //               style={{
// //                 alignSelf: 'center',
// //                 width: wp(60),
// //                 height: hp(4),
// //                 marginTop: SIZE(5),
// //               }}>
// //               <EditButtonText>{'Edit Profile'}</EditButtonText>
// //             </EditButton>
// //           </View>
// //         </View>
// //       </View>
// //     );
// //   };

// //   const TabNames = ['screenA', 'screenB'];

// //   return (
// //     <AppBackground>
// //       <Tabs.Container
// //         renderHeader={Header}
// //         // renderTabBar={() => <MaterialTabBar />}
// //       >
// //         <Tabs.Tab name="article" label="Article">
// //           <NFTCreated />
// //         </Tabs.Tab>
// //         <Tabs.Tab name="article1" label="Article1">
// //           <NftOwned />
// //         </Tabs.Tab>
// //       </Tabs.Container>
// //     </AppBackground>
// //   );
// // };

// // export default DummyProfile;

// // const styles = StyleSheet.create({
// //   scrollViewContainer: {
// //     flexGrow: 1,
// //     backgroundColor: 'white',
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   container: {
// //     backgroundColor: 'white',
// //   },
// //   content: {
// //     paddingVertical: 16,
// //   },
// //   author: {
// //     flexDirection: 'row',
// //     marginVertical: 8,
// //     marginHorizontal: 16,
// //   },
// //   meta: {
// //     marginHorizontal: 8,
// //     justifyContent: 'center',
// //   },
// //   name: {
// //     color: '#000',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //     lineHeight: 24,
// //   },
// //   timestamp: {
// //     color: '#999',
// //     fontSize: 14,
// //     lineHeight: 21,
// //   },
// //   avatar: {
// //     height: 48,
// //     width: 48,
// //     borderRadius: 24,
// //   },
// //   title: {
// //     color: '#000',
// //     fontWeight: 'bold',
// //     fontSize: 36,
// //     marginVertical: 8,
// //     marginHorizontal: 16,
// //   },
// //   paragraph: {
// //     color: '#000',
// //     fontSize: 16,
// //     lineHeight: 24,
// //     marginVertical: 8,
// //     marginHorizontal: 16,
// //   },
// //   image: {
// //     width: '100%',
// //     height: 200,
// //     resizeMode: 'cover',
// //     marginVertical: 8,
// //   },

// //   box: {
// //     height: 250,
// //     width: '100%',
// //   },
// //   boxA: {
// //     backgroundColor: 'white',
// //   },
// //   boxB: {
// //     backgroundColor: '#D8D8D8',
// //   },
// //   header: {
// //     height: HEADER_HEIGHT,
// //     width: '100%',
// //     backgroundColor: '#2196f3',
// //   },
// //   tabStyle: {
// //     height: SIZE(40),
// //     width: wp('50%'),
// //     paddingHorizontal: wp('1%'),
// //     justifyContent: 'center',
// //   },
// //   label: {
// //     fontSize: RF(1.6),
// //     fontFamily: 'Arial',
// //     textTransform: 'none',
// //   },
// //   tabbar: {
// //     elevation: 0,
// //     borderTopColor: '#EFEFEF',
// //     borderTopWidth: 1,
// //     shadowOpacity: 0,
// //     backgroundColor: 'white',
// //     marginVertical: 10,
// //   },
// //   collectionWrapper: {
// //     height: SIZE(200),
// //     alignItems: 'center',
// //     backgroundColor: colors.DARK_GREY,
// //   },
// //   iconImage: {
// //     width: SIZE(140),
// //     height: SIZE(140),
// //     borderRadius: SIZE(150),
// //     backgroundColor: colors.PERIWINKLE,
// //     alignItems: 'center',
// //   },
// //   iconWrapper: {
// //     marginTop: SIZE(-80),
// //     marginBottom: SIZE(10),
// //     alignItems: 'center',
// //     height: SIZE(150),
// //   },
// //   collectionListImage: {
// //     width: '100%',
// //     height: '100%',
// //     resizeMode: 'cover',
// //   },
// //   settings: {
// //     position: 'absolute',
// //     zIndex: 10,
// //     alignSelf: 'flex-end',
// //     right: SIZE(10),
// //     top: SIZE(10),
// //   },
// //   socialSiteView: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     flexDirection: 'row',
// //     marginTop: SIZE(15),
// //   },
// // });
