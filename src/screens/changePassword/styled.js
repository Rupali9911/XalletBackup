import styled from 'styled-components';

import {
    COLORS,
    SIZE
} from 'src/constants';

const MainContent = styled.View`
    flex-grow: 1;
    padding-horizontal: ${SIZE(23.5)}px;
    margin-vertical: ${SIZE(10)}px;
`;

const ProfileImage = styled.View`
    width: ${SIZE(60)}px;
    height: ${SIZE(60)}px;
    overflow: hidden;
    borderRadius: ${SIZE(60)/2}px;
    margin-right: ${SIZE(20)}px;
`;

export {
    MainContent,
    ProfileImage,
};