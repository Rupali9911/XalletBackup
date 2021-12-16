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
    maxHeight: ${SIZE(100)}px;
    border-bottom-width: 0.8px;
    border-color: ${COLORS.WHITE3};
    padding-bottom: ${SIZE(12)}px;
    font-size: ${FONT(14)}px;
    font-family: ${FONTS.ARIAL};
    padding-right: ${SIZE(19)}px;
    color: ${COLORS.BLACK1};
`;

const LimitableInput = (props) => {
    const { multiLine, label, input, meta: { touched, error, warning }, ...inputProps } = props;
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
                        value={input.value}
                        onChangeText={input.onChange}
                        onBlur={input.onBlur}
                        onFocus={input.onFocus}
                        placeholderTextColor={'grey'} />
                </RowBetweenWrap>
            ) : (
                <>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {label}
                        </NormalText>
                    </RowWrap>
                    <SpaceView mTop={SIZE(12)} />
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <MultiLineEditableInput
                            {...inputProps}
                            value={input.value}
                            onChangeText={input.onChange}
                            onBlur={input.onBlur}
                            onFocus={input.onFocus}
                            multiline
                            placeholderTextColor={'grey'} />
                    </RowWrap>
                </>
            )}
            {touched && error && (
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
