import * as React from "react";
import { ScrollView } from "react-native";
import KeyboardShift from "./keyboardShift";

export default class KeyboardAwareScrollView extends React.Component {
    render() {
        return (
            <ScrollView
                ref={(ref) => {
                    if (this.props.scrollViewRef) this.props.scrollViewRef(ref)
                }}
                keyboardShouldPersistTaps={'handled'}
                keyboardDismissMode={'on-drag'}
                {...this.props}>
                <KeyboardShift style={this.props.KeyboardShiftStyle}>{this.props.children}</KeyboardShift>
            </ScrollView>
        )
    }
}