import styled from 'styled-components';

import {
    COLORS,
    SIZE
} from 'src/constants';

const MainContent = styled.View`
    flex-grow: 1;
    padding-horizontal: ${SIZE(23.5)}px;
`;

const BottomView = styled.View`
    padding: ${SIZE(24)}px;
    padding-bottom: ${SIZE(60)}px;
`;

export {
    MainContent,
    BottomView    
};