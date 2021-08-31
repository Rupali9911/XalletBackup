import styled from 'styled-components';

import {
    COLORS,
    SIZE
} from 'src/constants';
import {
    GreySmallText
} from 'src/styles/text.styles';

const MainContent = styled.View`
    flex: 1;
    padding-horizontal: ${SIZE(23.5)}px;
`;

const BottomView = styled.View`
    width: 100%;
    flex-direction: row;
    height: ${SIZE(50)}px;
    flex-direction: row;
    align-self: flex-end;
    align-items: center;
    justify-content: center;
`;

const SignUpText = styled(GreySmallText)`
    font-weight: bold;
    color: ${COLORS.BLUE1}
`

export {
    MainContent,
    BottomView,
    SignUpText  
};