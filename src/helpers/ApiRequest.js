import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import base64 from 'base-64';
import { translate, environment } from '../walletUtils';
import { modalAlert } from '../common/function';

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
            if (state.isConnected) {
                isAlert = false;
                fetch(url, requestOptions)
                    .then(response => {
                        const statusCode = response.status;
                        // return JSON.parse(JSON.stringify(response));
                        if (statusCode == 200) {
                            return response.json();
                        } else {
                            switch (statusCode) {
                                case 404:
                                    throw Error(`${statusCode} Object not found`);
                                case 500:
                                    if (statusCode == 500 && (url.includes('receiveToken') || url.includes('sendToken'))) {
                                        throw Error(`Try again !!!`);
                                    }
                                    throw Error(`${statusCode} Internal server error`);
                                default:
                                    throw Error(`${statusCode} Some error occured`);
                            }
                        }

                        // try {
                        //     return response.json();
                        // } catch (err) {
                        //     if (statusCode == 500 && (url.includes('receiveToken') || url.includes('sendToken'))) {
                        //         throw Error(`Try again !!!`);
                        //     }
                        // };
                        // return response.json();
                    })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error)
                        // modalAlert(
                        //     translate("wallet.common.alert"),
                        //     translate("wallet.common.error.apiFailed"),
                        //     (e) => {
                        //     }
                        // );
                        // alert(error)
                    });
            } else {
                if (!isAlert) {
                    isAlert = true;
                    modalAlert(
                        translate('common.alertTitle'),
                        translate('wallet.common.error.networkError'),
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
            reject(err);
            // modalAlert(
            //     translate("wallet.common.alert"),
            //     translate("wallet.common.error.apiFailed"),
            //     (e) => {
            //     }
            // );
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
    return new Promise(function (resolve, reject) {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                isAlert = false;
                fetch(`${STRIPE_API_URL}${url}`, requestOptions)
                    .then(response => {
                        const statusCode = response.status;
                        try {
                            return response.json();
                        } catch (err) {
                            if (statusCode == 500 && (url.includes('receiveToken') || url.includes('sendToken'))) {
                                throw `Try again !!!`;
                            } else if (err?.code) {
                            }
                        };
                        return response.json();
                    })
                    .then(response => {
                        resolve(response)
                    })
                    .catch(error => {
                        reject();
                        // modalAlert(
                        //     translate("wallet.common.alert"),
                        //     translate("wallet.common.error.networkFailed"),
                        //     (e) => {
                        //     }
                        // );
                    });
            } else {
                if (!isAlert) {
                    isAlert = true;
                    modalAlert(
                        translate('common.alertTitle'),
                        translate('wallet.common.error.networkError'),
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
            // modalAlert(
            //     translate("wallet.common.alert"),
            //     translate("wallet.common.error.apiFailed"),
            //     (e) => {
            //     }
            // );
        });
    })
}
