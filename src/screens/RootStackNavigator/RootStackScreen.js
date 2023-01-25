import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {screenWidth} from '../../constants/responsiveFunct';
import TabComponent from './BottomTabNavigator';
import PasscodeScreen from '../security/passcode';
import DetailItemScreen from '../detailScreen';
import CertificateDetailScreen from '../certificateScreen/detail';
import PayScreen from '../payScreen';
import MakeBidScreen from '../makeBidScreen';
import EditProfileScreen from '../edit_profile';
import ProfileScreen from '../profile';
import TokenDetail from '../wallet/tokenDetail';
import Receive from '../wallet/receive';
import transactionsDetail from '../wallet/transactionsDetail';
import Send from '../wallet/send';
import ScanToConnect from '../connect/scanToConnect';
import CreateNFTScreen from '../createNFTScreen';
import CertificateScreen from '../certificateScreen';
import ArtistDetail from '../ArtistDetail';
import AddCard from '../PaymentScreen/addCard';
import Cards from '../PaymentScreen/cards';
import Setting from '../setting';
import ChangePassword from '../changePassword';
import SecurityScreen from '../security';
import WalletPay from '../PaymentScreen/walletPay';
import RecoveryPhrase from '../AuthScreens/recoveryPhrase';
import VerifyPhrase from '../AuthScreens/verifyPhrase';
import SellNFT from '../sellNft/index';
import CollectionDetail from '../collectionDetail';
import ChatDetail from '../AiChat/ChatDetail';
import WebView from '../../components/WebView';
import AuthStack from './AuthStack';

const Stack = createStackNavigator();

const RootStackScreen = props => {
  const {passcode, userData} = useSelector(state => state.UserReducer);

  let initialRoute = passcode ? 'PasscodeScreen' : 'Home';

  return (
    <>
      {userData ? (
        <Stack.Navigator
          initialRouteName={initialRoute}
          headerMode="none"
          screenOptions={{
            animationEnabled: true,
            animationTypeForReplace: 'pop',
            transitionSpec: {
              open: {
                animation: 'timing',
                duration: 1000,
              },
              close: {
                animation: 'timing',
                duration: 1000,
              },
            },
            gestureResponseDistance: {horizontal: (screenWidth * 70) / 100},
          }}>
          <Stack.Screen name="Home" component={TabComponent} />
          <Stack.Screen
            name="PasscodeScreen"
            initialParams={{screen: 'Auth'}}
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
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="tokenDetail" component={TokenDetail} />
          <Stack.Screen name="receive" component={Receive} />
          <Stack.Screen
            name="transactionsDetail"
            component={transactionsDetail}
          />
          <Stack.Screen name="send" component={Send} />
          <Stack.Screen name="scanToConnect" component={ScanToConnect} />
          <Stack.Screen name="Create" component={CreateNFTScreen} />
          <Stack.Screen name="Certificate" component={CertificateScreen} />
          <Stack.Screen name="ArtistDetail" component={ArtistDetail} />
          <Stack.Screen name="AddCard" component={AddCard} />
          <Stack.Screen name="Cards" component={Cards} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
          <Stack.Screen name="WalletPay" component={WalletPay} />
          <Stack.Screen name="recoveryPhrase" component={RecoveryPhrase} />
          <Stack.Screen name="verifyPhrase" component={VerifyPhrase} />
          <Stack.Screen name="sellNft" component={SellNFT} />
          <Stack.Screen name="CollectionDetail" component={CollectionDetail} />
          {/* <Stack.Screen name="AiChat" component={AiChat} /> */}
          <Stack.Screen name="ChatDetail" component={ChatDetail} />
          <Stack.Screen name="WebView" component={WebView} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Authentication" component={AuthStack} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default RootStackScreen;
