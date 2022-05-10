import React from 'react';
import styled from 'styled-components';
import { View, Text } from 'react-native';
import {
    COLORS,
    SIZE,
    FONT,
    FONTS
} from 'src/constants';
import { translate } from '../walletUtils';
import {
    RowBetweenWrap,
    RowWrap,
    SpaceView,
} from 'src/styles/common.styles';
import {
    NormalText,
} from 'src/styles/text.styles';
import {responsiveFontSize as RF} from "../common/responsiveFunction";
import fonts from "../res/fonts";
import colors from "../res/colors";

const EditableInput = styled.TextInput`
    width: ${SIZE(239)}px;
    height: ${SIZE(44)}px;
    border-bottom-width: 0.8px;
    border-color: ${COLORS.WHITE3};
    font-size: ${FONT(14)}px;
    font-family: ${FONTS.ARIAL};
    padding-right: ${SIZE(10)}px;
    color: ${props => props.isLimit ? COLORS.RED1 : COLORS.BLACK1};
`;

const LimitView = styled.View`
    width: 100%;
    height: ${SIZE(36)}px;
    background-color: ${COLORS.RED1};
    align-items: center;
    justify-content: center;
`;

const WhiteText = styled.Text`
    font-size: ${FONT(14)}px;
    font-family: ${FONTS.ARIAL};
    color: ${COLORS.WHITE1};
    margin-top: ${SIZE(4)}px;
`;

const MultiLineEditableInput = styled.TextInput`
    flex: 1;
    border-width: 0.8px;
    border-color: ${COLORS.WHITE3};
    padding: ${SIZE(12)}px;
    font-size: ${FONT(14)}px;
    font-family: ${FONTS.ARIAL};
    color: ${COLORS.BLACK1};
`;

const TextLimit = styled.Text`
    font-size: ${FONT(14)}px;
    font-family: ${FONTS.ARIAL};
    color: ${COLORS.BLACK1};
`;

const LimitableInput = (props) => {
    const { multiLine, label, value, onChange,about, error, ...inputProps } = props;
    console.log('about', about)
    return (
        <View>
            {!multiLine ? (
                <RowBetweenWrap>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {label}
                        </NormalText>
                    </RowWrap>
                    <EditableInput
                        {...inputProps}
                        value={value}
                        onChangeText={onChange}
                        placeholderTextColor={'grey'} />
                </RowBetweenWrap>
            ) : (
                <>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {label}
                        </NormalText>
                        <TextLimit> ({about? about.length : 0} / 200)</TextLimit>
                    </RowWrap>
                    <SpaceView mTop={SIZE(12)} />
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <MultiLineEditableInput
                            {...inputProps}
                            value={value}
                            onChangeText={onChange}
                            multiline
                            autoCapitalize= 'none'
                            placeholderTextColor={'grey'} />
                        <SpaceView mRight={SIZE(19)} />
                    </RowWrap>
                </>
            )}
            {error && (
                <LimitView>
                    <WhiteText>
                        {/* {translate('wallet.common.limitInputLength', { number: limit })} */}
                        {error}
                    </WhiteText>
                </LimitView>
            )}
        </View>
    )
}

export default LimitableInput;
