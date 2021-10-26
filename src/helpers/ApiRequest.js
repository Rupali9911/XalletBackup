import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import base64 from 'base-64';
import { translate, environment } from '../walletUtils';
import { alertWithSingleBtn } from '../common/function';

var isAlert = false;
export const STRIPE_API_URL = "https://api.stripe.com/v1/";
export const BASE_URL = "https://testapi.xanalia.com/";

export const ApiRequest = async (url, method, body, headers) => {

    const requestOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
    };

    if (method == "POST" || method == "DELETE" || method == "PUT") {
        requestOptions.body = JSON.stringify(body)
    }
    return new Promise(function (resolve, reject) {
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type, state.isConnected);
            if (state.isConnected) {
                isAlert = false;
                fetch(url, requestOptions)
                    .then(response => {
                        const statusCode = response.status;
                        // console.log('response from API', response);

                        try {
                            return response.json();
                        } catch (err) {
                            if (statusCode == 500 && (url.includes('receiveToken') || url.includes('sendToken'))) {
                                throw `Try again !!!`;
                            }
                        };
                        return response.json();
                    })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject()
                        alertWithSingleBtn(
                            translate("wallet.common.alert"),
                            translate("common.error.apiFailed"),
                            () => {
                                console.log(e);
                            }
                        );
                        // alert(error)
                    });
            } else {
                if (!isAlert) {
                    isAlert = true;
                    alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate("common.error.networkError"),
                        () => {
                            isAlert = false;
                            reject();
                        }
                    );
                } else {
                    reject();
                }
            }
        }).catch(err => {
            reject();
            alertWithSingleBtn(
                translate("wallet.common.alert"),
                translate("common.error.apiFailed"),
                () => {
                    console.log(e);
                }
            );
        });
    })
};

export const StripeApiRequest = (url, body, method = "POST") => {
    const requestOptions = {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + base64.encode(environment.stripeKey.p_key + ":" + '')
        },
    };
    let formBody = [];
    if (method == "POST") {
        for (let property in body) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(body[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        requestOptions.body = formBody;
    }
    console.log('requestOptions', requestOptions);
    return new Promise(function (resolve, reject) {
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type, state.isConnected);
            if (state.isConnected) {
                isAlert = false;
                // console.log('requestOptions',requestOptions);
                fetch(`${STRIPE_API_URL}${url}`, requestOptions)
                    .then(response => {
                        const statusCode = response.status;
                        // console.log('response from API', response);
                        try {
                            return response.json();
                        } catch (err) {
                            if (statusCode == 500 && (url.includes('receiveToken') || url.includes('sendToken'))) {
                                throw `Try again !!!`;
                            }
                        };
                        return response.json();
                    })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject();
                        alertWithSingleBtn(
                            translate("wallet.common.alert"),
                            translate("wallet.common.error.networkFailed"),
                            () => {
                                console.log(e);
                            }
                        );
                    });
            } else {
                if (!isAlert) {
                    isAlert = true;
                    alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate("common.error.networkError"),
                        () => {
                            isAlert = false;
                            reject();
                        }
                    );
                } else {
                    reject();
                }
            }
        }).catch(err => {
            reject();
            alertWithSingleBtn(
                translate("wallet.common.alert"),
                translate("common.error.apiFailed"),
                () => {
                    console.log(e);
                }
            );
        });
    })
}