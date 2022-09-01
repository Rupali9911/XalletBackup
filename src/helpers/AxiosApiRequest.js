import NetInfo from '@react-native-community/netinfo';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios'
import { NEW_BASE_URL } from '../common/constants';
import { alertWithSingleBtn } from '../common/function';

var isAlert = false;

//=============== API Calling function ========================
async function sendRequest(payload) {
    try {
        const token = await getAccessToken('ACCESS_TOKEN')
        payload.headers = payload.headers
            ? {
                ...payload.headers,
                Authorization: 'Bearer ' + token
            }
            : token ? {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            } : {
                'content-type': 'application/json',
            }
        const state = await NetInfo.fetch()
        console.log("Connection type", state.type, state.isConnected);
        if (state.isConnected) {
            isAlert = false;
            const response = await axiosInstance.request(payload);
            return response?.data
        } else {
            if (!isAlert) {
                isAlert = true;
                alertWithSingleBtn(
                    translate("wallet.common.alert"),
                    translate("wallet.common.error.networkError"),
                    () => {
                        isAlert = false;
                        // return Promise.reject()
                    }
                );
            } else {
                // return Promise.reject()
            }
        }
    } catch (error) {
        return Promise.reject(error)
    }
}

export const axiosInstance = axios.create()

//=============== Axios Interceptors ========================
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (err) => {
        const { response, config } = err
        try {
            if (response?.status === 401) {
                const rest = await APIRefreshToken()
                if (!rest || !rest.newToken) {
                    return response
                }
                await setAccesToken(rest.newToken)
                config.headers['Authorization'] = 'Bearer ' + rest.newToken
                return axiosInstance(config)
            } else if (response?.status === 403) {
                // if (!!location && !!localStorage) {
                //     localStorage.clear()
                //     location.href = location.origin
                // }
            } else if (response?.status === 455) {
                // const { data } = err.response?.data
                // if (
                //     !!err.response?.data &&
                //     !!data &&
                //     !!location &&
                //     !location.pathname.includes('maintenance')
                // ) {
                //     location.href = location.origin + '/maintenance'
                // }
            }

            return response
        } catch (error) {
            console.log("@@@ error in interceptors ==========>", error)
            return response
        }
    },
)

//================= Set Access Token =======================
export async function setAccesToken(value) {
    try {
        let sessionToken = null;
        const token = await EncryptedStorage.getItem("SESSION_TOKEN");
        if (token !== undefined) {
            sessionToken = JSON.parse(token);
            const newSessionToken = { ...sessionToken, accessToken: value };
            await EncryptedStorage.setItem("SESSION_TOKEN", JSON.stringify(newSessionToken));
        }
        return value
    } catch (error) {
        console.log('@@@ Set access token error ======>', error)
    }
}

//================== Get Access Token =====================
export async function getAccessToken(tokenName) {
    try {
        let sessionToken = null;
        const token = await EncryptedStorage.getItem("SESSION_TOKEN");
        if (token !== undefined) {
            sessionToken = JSON.parse(token);
            return tokenName === 'ACCESS_TOKEN' ? sessionToken?.accessToken : sessionToken?.refreshToken
        } else {
            return null;
        }
    } catch (error) {
        console.log('@@@ Get access token error ======>', error)
    }
}

//================== Get Wallet Function  =====================
export const getWallet = async () => {
    try {
        let userWallet = null;
        const wallet = await EncryptedStorage.getItem("@WALLET");
        if (wallet !== undefined) {
            return JSON.parse(wallet);
        } else {
            return null;
        }
    } catch (error) {
        console.log("@@@ Get wallet error =========>", error);
    }
}

//================== Refresh Token API call =====================
export async function APIRefreshToken() {
    const token = await getAccessToken('ACCESS_TOKEN')
    const refreshToken = await getAccessToken('REFRESH_TOKEN')
    if (!token || !refreshToken) return undefined

    return sendRequest(
        {
            url: `${NEW_BASE_URL}/auth/refresh-token`,
            method: 'POST',
            data: { token, refreshToken },
        }
    )
}

export default sendRequest