import { Alert } from "react-native";

const confirmationAlert = (title, message, leftText, rightText, onOkPress, onCancelPress) => {
    Alert.alert(
        title,
        message,
        [
            onCancelPress && {
                text: leftText ? leftText : 'Cancel',
                onPress: () => onCancelPress
            },
            {
                text: rightText ? rightText : 'Ok',
                onPress: onOkPress
            }
        ]
    );
}

const alertWithSingleBtn = (title, message, onOkPress, btnTxt) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: btnTxt ? btnTxt : 'Ok',
                onPress: onOkPress
            }
        ]
    );
}

const twitterLink = (username) => `https://twitter.com/${username}`

export {
    confirmationAlert,
    alertWithSingleBtn,
    twitterLink
}
