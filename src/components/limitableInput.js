import React from 'react';
import styled from 'styled-components';
import {View, Text} from 'react-native';
import {COLORS, SIZE, FONT, FONTS} from 'src/constants';
import {translate} from '../walletUtils';
import {RowBetweenWrap, RowWrap, SpaceView} from 'src/styles/common.styles';
import {NormalText} from 'src/styles/text.styles';
import {responsiveFontSize as RF} from '../common/responsiveFunction';
import fonts from '../res/fonts';
import colors from '../res/colors';

const EditableInput = styled.TextInput`
  width: ${SIZE(239)}px;
  height: ${SIZE(44)}px;
  border-bottom-width: 0.8px;
  border-color: ${COLORS.WHITE3};
  font-size: ${FONT(14)}px;
  font-family: ${FONTS.ARIAL};
  padding-right: ${SIZE(10)}px;
  color: ${props => (props.isLimit ? COLORS.RED1 : COLORS.BLACK1)};
`;

const LimitView = styled.View`
  width: 90%;
  margin-left: ${SIZE(20)}px;
`;

const WhiteText = styled.Text`
  font-size: ${FONT(14)}px;
  font-family: ${FONTS.ARIAL};
  color: ${COLORS.RED2};
`;

const MultiLineEditableInput = styled.TextInput`
    flex: 1;
    flex-direction: row
    border-width: 1px;
    height: ${SIZE(50)}px;
    border-radius : ${SIZE(7)}px
    border-color: ${COLORS.themeColor};
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

const LimitableInput = props => {
  const {
    multiLine,
    label,
    limit,
    value,
    onChange,
    about,
    error,
    singleLine = true,
    ...inputProps
  } = props;
  return (
    <View>
      {!multiLine ? (
        <RowBetweenWrap>
          <RowWrap>
            <SpaceView mLeft={SIZE(19)} />
            <NormalText>{label}</NormalText>
          </RowWrap>
          <EditableInput
            {...inputProps}
            value={value}
            onChangeText={onChange}
            placeholderTextColor={'grey'}
          />
        </RowBetweenWrap>
      ) : (
        <>
          <RowWrap mTop={SIZE(18)}>
            <SpaceView mLeft={SIZE(19)} />
            <View
              style={{
                width: '90%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <NormalText
                style={{
                  fontSize: SIZE(16),
                  fontWeight: '700',
                  color: '#212529',
                }}>
                {label}
              </NormalText>
              {limit && <TextLimit>{about ? about.length : 0} / 200</TextLimit>}
            </View>
          </RowWrap>
          <SpaceView mTop={SIZE(12)} />
          <RowWrap style={{alignItems: 'center'}}>
            <SpaceView mLeft={SIZE(19)} />
            <MultiLineEditableInput
              {...inputProps}
              value={value}
              onChangeText={onChange}
              multiline={singleLine}
              autoCapitalize="none"
              placeholderTextColor={'grey'}></MultiLineEditableInput>
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
  );
};

export default LimitableInput;
