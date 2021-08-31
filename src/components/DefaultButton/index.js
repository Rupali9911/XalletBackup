import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';

import {
  COLORS,
  SIZE,
  FONT,
} from 'src/constants';

import {
  RowWrap,
  SpaceView,
} from 'src/styles/common.styles';

const Button = styled.TouchableOpacity`
  width: ${props => props.width || '100%'};
  height: ${props => props.md ? SIZE(39) : SIZE(45)}px;
  align-items: center;
  justify-content: center;
  border-color: ${props => props.isBorder ? props.color : COLORS.WHITE1};
  border-width: ${props => props.isBorder ? 1 : 0}px;
  border-radius: ${SIZE(3.5)}px;
  background-color: ${props => props.isBorder ? COLORS.WHITE1 : props.color};
`;

const SignUpButton = styled.TouchableOpacity`
    width: 100%;
    height: ${SIZE(45)}px;
    border-width: 1px;
    border-radius: ${SIZE(3.5)}px;
    border-color: ${COLORS.BLACK2};
    padding-horizontal: ${SIZE(19)}px;
    background-color:${COLORS.WHITE7};
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: ${props => props.md ? FONT(12) : FONT(17)}px;
  font-weight: 400;
  color: ${props => props.isBorder ? props.color : COLORS.WHITE1};
`;

const SignUpButtonText = styled.Text`
    width: 90%;
    font-size: ${FONT(13)}px;
`;

const IconWrap = styled.View`
    height: 100%;
    justify-content: center;
    margin-right: ${SIZE(9)}px;
`;

const DefaultButton = ({
  width,
  md,
  text,
  color,
  isBorder,
  onPress
}) => {
  return (
    <Button
      onPress={onPress}
      width={width}
      isBorder={isBorder}
      color={color}
      md={md}
    >
      <ButtonText
        isBorder={isBorder}
        color={color}
        md={md}
      >
        {text}
      </ButtonText>
    </Button>
  );
}

export const SignUpButtons = ({ icon, label, onPress }) => {
  return (
    <SignUpButton onPress={onPress} >
      {
        icon &&
        <IconWrap>
          {icon}
        </IconWrap>
      }
      <SignUpButtonText>{label}</SignUpButtonText>
    </SignUpButton>
  )
}

export default DefaultButton;
