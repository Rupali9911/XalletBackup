import styled from 'styled-components';

import {
    COLORS,
    SIZE
} from 'src/constants';
import {
    GreySmallText,
    SmallNormalText
} from 'src/styles/text.styles';

const MainContent = styled.View`
    flex: 1;
`;

const Content = styled.View`
   padding-horizontal: ${SIZE(23.5)}px;
`;

const IconImage = styled.View`
    width: ${SIZE(70)}px;
    height: ${SIZE(70)}px;
    overflow: hidden;
    borderRadius: ${SIZE(70) / 2}px;
`;

const LabelSeparatorContainer = styled.View`
    width: 75%;
    flex-direction: row;
    align-items: center;
    align-self: center;
    margin-vertical:  ${SIZE(10)}px;
`;

const Separator = styled.View`
    flex: 1;
    height: 1px;
    background-color: #C4C4C4;
    align-self: center;
`;

const SeparatorLabel = styled(SmallNormalText)`
    margin-horizontal: ${SIZE(10)}px;
`;

const Description = styled(GreySmallText)`
    text-align: center;
    width: 95%;
    align-self: center;
`;

const BottomView = styled.View`
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    padding-bottom:  ${SIZE(10)}px;
`;

export {
    MainContent,
    Content,
    BottomView,
    IconImage,
    Description,
    LabelSeparatorContainer,
    Separator,
    SeparatorLabel
};