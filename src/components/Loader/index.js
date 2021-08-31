import React from 'react';
import styled from 'styled-components';
import { ActivityIndicator } from "react-native";

import {
    COLORS,
    SIZE,
} from 'src/constants';

const LoaderIndicator = () => {

    return (
        <MainContainer>
            <CardContainer>
                <ActivityIndicator size="large" color={COLORS.BLUE2} />
            </CardContainer>
        </MainContainer>
    )
}

const MainContainer = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  zIndex: 1;
  background-color: ${COLORS.BLACKRGBA(0.3)};
`;

const CardContainer = styled.View`
    width: ${SIZE(100)}px;
    height: ${SIZE(100)}px;
    border-radius: ${SIZE(20)}px;
    align-items: center;
    justify-content: center;
    background-color: ${COLORS.WHITE1};
`;

export default LoaderIndicator;