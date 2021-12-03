import React from 'react';
import styled from 'styled-components';
import { View } from 'react-native';
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

const LimitableInput = (props) => {
    const { placeholder, value, limit, onChangeText, ...other } = props;
    return (
        <View>
            <RowBetweenWrap>
                <RowWrap>
                    <SpaceView mLeft={SIZE(19)} />
                    <NormalText>
                        {placeholder}
                    </NormalText>
                </RowWrap>
                <EditableInput
                    isLimit={value?.length > limit}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor={'grey'}
                    placeholder={placeholder}
                    {...other} />
            </RowBetweenWrap>
            {value?.length > limit && (
                <LimitView>
                    <WhiteText>
                        {translate('wallet.common.limitInputLength', { number: limit })}
                    </WhiteText>
                </LimitView>
            )}
        </View>
    )
}

export default LimitableInput;
