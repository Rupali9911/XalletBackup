import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../screens/AuthScreens/welcome";
import Legal from "../screens/AuthScreens/legal";
import Backup from "../screens/AuthScreens/backup";
import RecoveryPhrase from "../screens/AuthScreens/recoveryPhrase";
import Policy from "../screens/AuthScreens/policy";
import VerifyPhrase from "../screens/AuthScreens/verifyPhrase";
import ImportWallet from "../screens/AuthScreens/importWallet";

const Auth = createStackNavigator();

const AuthStack = () => {
    return (
        <Auth.Navigator screenOptions={{headerShown: false}} headerMode="none">
            <Auth.Screen name="welcome" component={Welcome} />
            <Auth.Screen name="legal" component={Legal} />
            <Auth.Screen name="backup" component={Backup} />
            <Auth.Screen name="recoveryPhrase" component={RecoveryPhrase} />
            <Auth.Screen name="policy" component={Policy} />
            <Auth.Screen name="verifyPhrase" component={VerifyPhrase} />
            <Auth.Screen name="importWallet" component={ImportWallet} />
        </Auth.Navigator>
    )
}

export default AuthStack;
