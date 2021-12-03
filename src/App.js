import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StripeProvider } from '@stripe/stripe-react-native';
import * as React from 'react';
import { Image, Linking, LogBox } from 'react-native';
import 'react-native-gesture-handler';
import * as RNLocalize from 'react-native-localize';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Subject } from 'rxjs';
import '../shim';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from './common/responsiveFunction';
import { AppSplash, Loader } from './components';
import Colors from './constants/Colors';
import ImageSrc from './constants/Images';
import { screenWidth } from './constants/responsiveFunct';
import AuthStack from './navigations/authStack';
import { fonts, images } from './res';
import ArtistDetail from './screens/ArtistDetail';
import RecoveryPhrase from './screens/AuthScreens/recoveryPhrase';
import VerifyPhrase from './screens/AuthScreens/verifyPhrase';
import CertificateScreen from './screens/certificateScreen';
import CertificateDetailScreen from './screens/certificateScreen/detail';
import ChangePassword from './screens/changePassword';
import Connect from './screens/connect';
import ScanToConnect from './screens/connect/scanToConnect';
import DetailItemScreen from './screens/detailScreen';
import EditProfileScreen from './screens/edit_profile';
import ExploreScreen from './screens/explore';
import HomeScreen from './screens/homeScreen';
import MakeBidScreen from './screens/makeBidScreen';
import NewPostScreen from './screens/newPostScreen';
import AddCard from './screens/PaymentScreen/addCard';
import BuyGold from './screens/PaymentScreen/buyGold';
import Cards from './screens/PaymentScreen/cards';
import WalletPay from './screens/PaymentScreen/walletPay';
import PayScreen from './screens/payScreen';
import ProfileScreen from './screens/profile';
import SecurityScreen from './screens/security';
import PasscodeScreen from './screens/security/passcode';
import Setting from './screens/setting';
import Wallet from './screens/wallet';
import Receive from './screens/wallet/receive';
import Send from './screens/wallet/send';
import TokenDetail from './screens/wallet/tokenDetail';
import transactionsDetail from './screens/wallet/transactionsDetail';
import SellNFT from './screens/sellNft/index';
import Store from './store';

import { setRequestAppId } from './store/reducer/walletReducer';
import { environment, translate } from './walletUtils';

export const regionLanguage = RNLocalize.getLocales()
    .map(a => a.languageCode)
    .values()
    .next().value;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const deepLinkData = {
    url: 'xanalia://',
    param: '0165782121489',
};

const TabComponent = () => {
    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

    React.useEffect(() => {

    }, [selectedLanguageItem.language_name])

    return (
        <Tab.Navigator tabBarOptions={{
            labelStyle: {
                fontSize: 12,
                fontFamily: fonts.SegoeUIRegular,
                paddingTop: hp('0.75%')
            },
            tabStyle: {
                paddingVertical: hp('1%'),
            },
            activeTintColor: Colors.themeColor
        }} screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => {
                let iconName;

                if (route.name === "Home") {
                    iconName = focused ? images.icons.homeA : images.icons.homeD;
                } else if (route.name === 'Create') {
                    iconName = focused ? images.icons.createA : images.icons.createD;
                } else if (route.name === 'Explore') {
                    iconName = focused ? images.icons.exploreA : images.icons.exploreD;
                } else if (route.name === 'Certificate') {
                    iconName = focused ? images.icons.certificateA : images.icons.certificateD;
                } else if (route.name === 'Me') {
                    iconName = focused ? images.icons.meA : images.icons.meD;
                } else if (route.name === 'Wallet') {
                    iconName = focused ? ImageSrc.walletActive : ImageSrc.wallet;
                } else if (route.name === 'Connect') {
                    iconName = focused ? ImageSrc.connectA : ImageSrc.connect;
                }

                // You can return any component that you like here!
                return <Image source={iconName} resizeMode="contain" style={{ width: wp('6.5%'), height: wp('4.5%') }} />;
            },
        })} >
            <Tab.Screen
                name={"Home"}
                component={HomeScreen}
                options={{ tabBarLabel: translate("common.collected") }}
            />
            <Tab.Screen
                name={'Explore'}
                component={ExploreScreen}
                options={{ tabBarLabel: translate("wallet.common.explore") }}
            />
            <Tab.Screen
                name={'Wallet'}
                options={{ tabBarLabel: translate("wallet.common.wallet") }}
                component={Wallet}
            />
            <Tab.Screen
                name={'Connect'}
                options={{ tabBarLabel: translate("wallet.common.connect") }}
                component={Connect}
                initialParams={{}}
            />
            <Tab.Screen
                options={{ tabBarLabel: translate("wallet.common.me") }}
                name={'Me'}
                component={ProfileScreen}
            />
        </Tab.Navigator>
    );
};

const AppRoutes = () => {
    const { wallet, passcode, mainLoader, showSplash } = useSelector(
        state => state.UserReducer,
    );
    const dispatch = useDispatch();
    const navigatorRef = React.useRef(null);
    let initialRoute = passcode ? 'PasscodeScreen' : 'Home';

    React.useEffect(() => {
        LogBox.ignoreAllLogs();

        Linking.addEventListener('url', ({ url }) => {
            console.log('e', url);
            if (url && url.includes('xanaliaapp://connect')) {
                let id = url.substring(url.lastIndexOf('/') + 1);
                if (wallet) {
                    setTimeout(() => {
                        navigatorRef.current?.navigate('Connect', { appId: id });
                    }, 500);
                } else {
                    dispatch(setRequestAppId(id));
                }
            }
        });
    }, []);

    const linking = {
        prefixes: ['xanaliaapp://'],
        config: {
            screens: {
                Home: {
                    path: '/connect',
                    screens: {
                        Connect: {
                            path: '/:appId',
                        },
                    },
                },
            },
        },
        getStateFromPath: (path, options) => {
            console.log('path', path);
            let id = path.substring(path.lastIndexOf('/') + 1);
            dispatch(setRequestAppId(id));
            // Return a state object here
            // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`
        },
        // getPathFromState(state, config) {
        //   // Return a path string here
        //   // You can also reuse the default logic by importing `getPathFromState` from `@react-navigation/native`
        // },
    };

    return (
        <>
            {showSplash ? (
                <AppSplash />
            ) : (
                mainLoader ?
                    <Loader />
                    :
                    <NavigationContainer ref={navigatorRef} linking={linking}>
                        {wallet ? (

                            <Stack.Navigator
                                initialRouteName={initialRoute}
                                headerMode="none"
                                screenOptions={{
                                    gestureResponseDistance: { horizontal: (screenWidth * 70) / 100 },
                                }}>
                                <Stack.Screen name="Home" component={TabComponent} />
                                <Stack.Screen
                                    name="PasscodeScreen"
                                    initialParams={{ screen: 'Auth' }}
                                    component={PasscodeScreen}
                                />
                                <Stack.Screen name="DetailItem" component={DetailItemScreen} />
                                <Stack.Screen
                                    name="CertificateDetail"
                                    component={CertificateDetailScreen}
                                />
                                <Stack.Screen name="Pay" component={PayScreen} />
                                <Stack.Screen name="MakeBid" component={MakeBidScreen} />
                                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                                <Stack.Screen name="tokenDetail" component={TokenDetail} />
                                <Stack.Screen name="receive" component={Receive} />
                                <Stack.Screen
                                    name="transactionsDetail"
                                    component={transactionsDetail}
                                />
                                <Stack.Screen name="send" component={Send} />
                                <Stack.Screen name="scanToConnect" component={ScanToConnect} />
                                <Stack.Screen name="Create" component={NewPostScreen} />
                                <Stack.Screen name="Certificate" component={CertificateScreen} />
                                <Stack.Screen name="ArtistDetail" component={ArtistDetail} />
                                <Stack.Screen name="AddCard" component={AddCard} />
                                <Stack.Screen name="Cards" component={Cards} />
                                <Stack.Screen name="BuyGold" component={BuyGold} />
                                <Stack.Screen name="Setting" component={Setting} />
                                <Stack.Screen name="ChangePassword" component={ChangePassword} />
                                <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
                                <Stack.Screen name="WalletPay" component={WalletPay} />
                                <Stack.Screen name="recoveryPhrase" component={RecoveryPhrase} />
                                <Stack.Screen name="verifyPhrase" component={VerifyPhrase} />
                                <Stack.Screen name="sellNft" component={SellNFT} />
                            </Stack.Navigator>
                        ) : (
                            <Stack.Navigator headerMode="none">
                                <Stack.Screen name="Authentication" component={AuthStack} />
                            </Stack.Navigator>
                        )}
                    </NavigationContainer>
            )}
        </>
    );
};

export const Events = new Subject();

const App = () => {
    return (
        <Provider store={Store}>
            <StripeProvider
                publishableKey={environment.stripeKey.p_key}
                urlScheme="xanalia" // required for 3D Secure and bank redirects
                merchantIdentifier="merchant.com.xanalia" // required for Apple Pay
            >
                <AppRoutes />
            </StripeProvider>
        </Provider>
    );
};

export default App;
