import { alertWithSingleBtn } from '../utils';
import { translate } from '../walletUtils';

export const ApiCalls = async (url, method, body, headers) => {

    const requestOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
    };

    if (method == "POST") {
        requestOptions.body = JSON.stringify(body)
    }
    return new Promise(function (resolve, reject) {
        fetch(url, requestOptions)
            .then(response => {
                const statusCode = response.status;
                console.log('response', response.status);

                try{
                    return response.json();
                }catch(err){
                    if (statusCode == 500 && (url.includes('receiveToken') || url.includes('sendToken'))) {
                        throw `Try again !!!`;
                    }
                };
                return response.json();
            })
            .then(response => {
                resolve({ response })
            })
            .catch(error => {
                // alertWithSingleBtn(
                //     translate("wallet.common.alert"),
                //     translate("wallet.common.error.networkFailed"),
                //     () => {
                //         console.log(e);
                //     }
                // );
            });

    })
};
