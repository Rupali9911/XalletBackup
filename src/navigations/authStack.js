import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Backup from '../screens/AuthScreens/backup';
import chooseWallet from '../screens/AuthScreens/chooseWallet';
import ImportWallet from '../screens/AuthScreens/importWallet';
import Legal from '../screens/AuthScreens/legal';
import Policy from '../screens/AuthScreens/policy';
import RecoveryPhrase from '../screens/AuthScreens/recoveryPhrase';
import VerifyPhrase from '../screens/AuthScreens/verifyPhrase';
import Welcome from '../screens/AuthScreens/welcome';
import {
  SignupCrypto,
  LoginCrypto,
  ForgetCrypto,
  Verify,
} from '../screens/AuthScreens/nonCryptoAuth';
import WalletBTNS from '../screens/AuthScreens/walletBTNS';

const Auth = createStackNavigator();

const AuthStack = () => {
  return (
    <Auth.Navigator screenOptions={{headerShown: false}} headerMode="none">
      <Auth.Screen name="welcome" component={Welcome} />
      <Auth.Screen name="WalletBTNS" component={WalletBTNS} />
      <Auth.Screen name="CryptoLogin" component={LoginCrypto} />
      <Auth.Screen name="CryptoSignUp" component={SignupCrypto} />
      <Auth.Screen name="CryptoForget" component={ForgetCrypto} />
      <Auth.Screen name="CryptoVerify" component={Verify} />
      <Auth.Screen name="legal" component={Legal} />
      <Auth.Screen name="chooseWallet" component={chooseWallet} />
      <Auth.Screen name="backup" component={Backup} />
      <Auth.Screen name="recoveryPhrase" component={RecoveryPhrase} />
      <Auth.Screen name="policy" component={Policy} />
      <Auth.Screen name="verifyPhrase" component={VerifyPhrase} />
      <Auth.Screen name="importWallet" component={ImportWallet} />
    </Auth.Navigator>
  );
};

export default AuthStack;
