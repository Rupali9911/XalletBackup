import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
    SIZE,
    SVGS,
    COLORS,
    FONT,
    FONTS
} from 'src/constants';
import styled from 'styled-components';
// import IonicIcon from 'react-native-vector-icons/Ionicons';

const Container = styled.View`
    width: ${props => props.width ? props.width : "100%"};
    height:  ${props => props.height || SIZE(45)}px;
    border-width: 1px;
    border-radius: ${SIZE(3.5)}px;
    border-color: ${COLORS.BLACK2};
    background-color: #FAFAFA
    flex-direction: row;
    padding-horizontal: ${SIZE(19)}px;
    justify-content: space-between;
`;

const ErrorText = styled.Text`
    font-size: ${FONT(13)}px;
    margin-Top: ${SIZE(10)}px;
    color: ${COLORS.DANGER};
`;

const TextInputView = styled.TextInput`
    flex: 1;
    font-size: ${FONT(13)}px;
`;

const IconWrap = styled.View`
    height: 100%;
    justify-content: center;
    margin-right: ${SIZE(9)}px;
`;

const EyeView = styled.TouchableOpacity`
    height: 100%;
    justify-content: center;
`;

const InputLabel = styled.Text`
    font-size: ${FONT(12)}px;
    font-family: ${FONTS.ARIAL};
    color: ${COLORS.BLACK1};
    margin-bottom: ${SIZE(7)}px;
`;

function TextInput({
    placeholder,
    icon,
    isEye,
    value,
    onChangeText,
    secureText,
    keyboardType,
    error,
    width,
    hide,
    eyePress,
    label,
    height
}) {
    return (
        <>
            {
                label &&
                <InputLabel>
                    {label}
                </InputLabel>
            }
            <Container width={width} height={height} >
                {
                    icon &&
                    <IconWrap>
                        {icon}
                    </IconWrap>
                }
                <TextInputView
                    multiline={height ? true : false}
                    keyboardType={keyboardType}
                    secureTextEntry={secureText}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                />
                {
                    isEye &&
                    <EyeView onPress={eyePress} >
                        {/* <IonicIcon
                            name={!hide ? "eye-outline" : "eye-off-outline"}
                            size={FONT(20)}
                            color={COLORS.BLACK1} /> */}
                    </EyeView>
                }
            </Container>
            {
                error ?
                    <ErrorText>
                        {error}
                    </ErrorText>
                    : null
            }

        </>
    )
}

export default TextInput;