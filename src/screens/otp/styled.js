import styled from 'styled-components';

import {
    COLORS,
    SIZE
} from 'src/constants';

const MainContent = styled.View`
    flex: 1;
    padding-horizontal: ${SIZE(23.5)}px;
`;

const BottomView = styled.View`
    width: 100%;
    align-self: flex-end;
    align-items: center;
    justify-content: center;
    padding-horizontal: ${SIZE(24)}px;
`;

const SendAgainText = styled.Text`
    color: ${COLORS.BLUE2};
    font-size: ${SIZE(13)}px;
    font-weight: 700;
`;

export {
    MainContent,
    BottomView,
    SendAgainText
};