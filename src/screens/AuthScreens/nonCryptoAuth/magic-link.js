import {Magic} from '@magic-sdk/react-native';
import {ethers} from 'ethers';
import {NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY} from '../../../common/constants';
import Store from '../../../store';

const requestConnectToDApp = async email => {
  return await enable({
    email,
    showUI: true,
  });
};

const enable = async payload => {
  try {
    // if (await isLoggedIn()) return true
    const proxy = getProxy();
    if (proxy === undefined) return undefined;
    return await proxy.auth.loginWithMagicLink(payload);
  } catch (error) {
    return false;
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
    return false;
  }
};

const getProxy = () => {
  const language_name =
    Store.getState().LanguageReducer.selectedLanguageItem?.language_name;

  const data = createMagicLinkProxy(language_name);
  return data?.MagicLink;
};

const createMagicLinkProxy = language_name => {
  const MagicLink = new Magic(NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
    locale: language_name,
  });
  const MagicLinkProvider = MagicLink.rpcProvider;
  return {
    MagicLink: MagicLink,
    MagicLinkProvider: MagicLinkProvider,
  };
};

const isLoggedIn = async () => {
  const proxy = getProxy();
  if (!proxy) return undefined;
  return await proxy.user.isLoggedIn();
};

const getProxyProvider = () => {
  const language_name =
    Store.getState().LanguageReducer.selectedLanguageItem?.language_name;
  const data = createMagicLinkProxy(language_name);
  return data?.MagicLinkProvider;
};

const getProvider = () => {
  const proxy = getProxyProvider();
  return new ethers.providers.Web3Provider(proxy, 'any');
};

const getAddress = async () => {
  const proxy = getProxy();
  if (!proxy) return undefined;
  const provider = getProvider();

  const signer = provider.getSigner();
  return await signer.getAddress();
};

const signMessage = async message => {
  const provider = getProvider();
  const signer = provider.getSigner();
  return await signer.signMessage(message);
};

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
