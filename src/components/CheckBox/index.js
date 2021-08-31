import React from 'react';
import {
    SIZE,
    SVGS,
} from 'src/constants';
import styled from 'styled-components';

const {
    CheckOnIcon,
    CheckOffIcon,
} = SVGS;

const CheckBoxButton = styled.TouchableOpacity`
    width: ${SIZE(23)}px;
    height: ${SIZE(23)}px;
`;

function CheckBox({
    isCheck,
    onCheck
}) {

    return (
        <CheckBoxButton onPress={onCheck}>
            {
                isCheck
                    ? <CheckOnIcon />
                    : <CheckOffIcon />
            }
        </CheckBoxButton>
    )
}

export default CheckBox;