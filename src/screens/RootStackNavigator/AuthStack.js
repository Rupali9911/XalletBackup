import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Backup from '../AuthScreens/backup';
import chooseWallet from '../AuthScreens/chooseWallet';
import ImportWallet from '../AuthScreens/importWallet';
import Legal from '../AuthScreens/legal';
import Policy from '../AuthScreens/policy';
import RecoveryPhrase from '../AuthScreens/recoveryPhrase';
import VerifyPhrase from '../AuthScreens/verifyPhrase';
import Welcome from '../AuthScreens/welcome';
import {
  SignupCrypto,
  LoginCrypto,
  ForgetCrypto,
  Verify,
} from '../AuthScreens/nonCryptoAuth';
import WalletBTNS from '../AuthScreens/walletBTNS';

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
