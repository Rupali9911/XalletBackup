import styled from 'styled-components';

import {
    COLORS,
    SIZE
} from 'src/constants';

import {
    NormalText
} from 'src/styles/text.styles';

const MainContent = styled.View`
    height: ${SIZE(64)}px;
    background-color: ${COLORS.WHITE1};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-horizontal: ${SIZE(18)}px;
`;

const SettingLabel = styled(NormalText)`
    flex: 1;
`;


export {
    MainContent,
    SettingLabel
};