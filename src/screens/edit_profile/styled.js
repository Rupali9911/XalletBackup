import styled from 'styled-components';

import {
    COLORS,
    SIZE,
    FONT,
    FONTS
} from 'src/constants';

const Avatar = styled.View`
    background-color: ${COLORS.GREY2};
    width: ${SIZE(85)}px;
    height: ${SIZE(85)}px;
    border-radius: ${SIZE(85)}px;
    overflow: hidden;
`;

const ChangeAvatar = styled.Text`
    font-size: ${FONT(12)}px;
    font-family: ${FONTS.ARIAL};
    color: ${COLORS.BLUE4};
`;

const DoneText = styled.Text`
    font-size: ${FONT(14)}px;
    font-family: ${FONTS.ARIAL_BOLD};
    color: ${COLORS.BLUE4};
`;

const EditableInput = styled.TextInput`
    width: ${SIZE(239)}px;
    height: ${SIZE(44)}px;
    border-bottom-width: 0.8px;
    border-color: ${COLORS.WHITE3};
    font-size: ${FONT(14)}px;
    font-family: ${FONTS.ARIAL};
`;

const MultiLineEditableInput = styled.TextInput`
    width: 100%;
    border-bottom-width: 0.8px;
    border-color: ${COLORS.WHITE3};
    padding-bottom: ${SIZE(12)}px;
    font-size: ${FONT(14)}px;
    font-family: ${FONTS.ARIAL};
`;

export {
    Avatar,
    ChangeAvatar,
    DoneText,
    EditableInput,
    MultiLineEditableInput
}