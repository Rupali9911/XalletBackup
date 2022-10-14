import {Magic} from '@magic-sdk/react-native';
import {ethers} from 'ethers';
import {NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY} from '../../../common/constants';

const requestConnectToDApp = async email => {
  return await enable({
    email,
    showUI: true,
  });
};

const enable = async payload => {
  try {
    console.log(
      '🚀 ~ file: magiclink.js ~ line 15 ~ enable ~ await isLoggedIn()',
    );
    const proxy = getProxy();
    if (proxy === undefined) return undefined;
    return await proxy.auth.loginWithMagicLink(payload);
  } catch (error) {
    console.log('🚀 ~ file: magicLink.js ~ line 19 ~ enable ~ error', error);
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
    console.error(error);
    return false;
  }
};

const getProxy = () => {
  const data = createMagicLinkProxy();
  console.log('🚀 ~ file: magicLink.js ~ line 37 ~ getProxy ~ data', data);

  return data?.MagicLink;
};

const createMagicLinkProxy = () => {
  const MagicLink = new Magic(NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
    locale: 'en',
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
  const data = createMagicLinkProxy();
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
