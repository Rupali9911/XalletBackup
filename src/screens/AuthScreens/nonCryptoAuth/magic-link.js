import {Magic} from '@magic-sdk/react-native';
import {ethers} from 'ethers';
import {NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY} from '../../../common/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const requestConnectToDApp = async email => {
  return await enable({
    email,
    showUI: true,
  });
};

const enable = async payload => {
  try {
    if (await isLoggedIn()) return true;
    const proxy = getProxy();
    if (proxy === undefined) return undefined;
    const token = await proxy.auth.loginWithMagicLink(payload);
    return token;
  } catch (error) {
    return error;
  }
};

const requestDisconnectDApp = async () => {
  return await disable();
};

const disable = async () => {
  try {
    if (!(await isLoggedIn())) return true;
    const proxy = getProxy();
    if (proxy === undefined) return undefined;
    await proxy.user.logout();
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getProxy = () => {
  const data = createMagicLinkProxy();
  return data?.MagicLink;
};

const createMagicLinkProxy = async () => {
  const language_name = await AsyncStorage.getItem('language_name');
  const MagicLink = new Magic(NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
    locale: language_name || 'en',
  });

  const MagicLinkProvider = MagicLink.rpcProvider;
  return {
    MagicLink: MagicLink,
    MagicLinkProvider: MagicLinkProvider,
  };
};

async function isLoggedIn() {
  const proxy = getProxy();
  if (!proxy) return undefined;
  return await proxy.user.isLoggedIn();
}

function getProxyProvider() {
  const data = createMagicLinkProxy();
  return data?.MagicLinkProvider;
}

function getProvider() {
  const proxy = getProxyProvider();
  return new ethers.providers.Web3Provider(proxy, 'any');
}

async function getAddress() {
  const proxy = getProxy();
  if (!proxy) return undefined;
  const provider = getProvider();

  const signer = provider.getSigner();
  return await signer.getAddress();
}

async function signMessage(message) {
  const provider = getProvider();
  const signer = provider.getSigner();
  return await signer.signMessage(message);
}

export {
  createMagicLinkProxy,
  getProxy,
  requestConnectToDApp,
  enable,
  requestDisconnectDApp,
  disable,
  isLoggedIn,
  getAddress,
  signMessage,
};
