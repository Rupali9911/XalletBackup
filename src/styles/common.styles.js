import React from 'react';
import styled from 'styled-components';

import {
  COLORS,
  SIZE1,
  SIZE2,
  SIZE12,
  FONT,
  SIZE,
  WIDTH
} from 'src/constants';

const Header = styled.View`
  height: ${SIZE(55)}px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.backgroundColor || COLORS.WHITE1};
`;

const HeaderLeft = styled.View`
  position: absolute;
  top: 0;
  left: ${SIZE(13)}px;
  bottom: 0;
  align-items: center;
  flex-direction: row;
`;

const HeaderRight = styled.View`
  position: absolute;
  top: 0;
  right: ${SIZE(13)}px;
  bottom: 0;
  align-items: center;
  flex-direction: row;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.color || COLORS.WHITE1};
`;

const Content = styled.View`
  flex: 1;
  background-color: ${props => props.color || COLORS.WHITE2};
`;

const CenterWrap = styled.View`
  align-items: center;
`;

const ContentWrap = styled.View`
  margin-left: ${props => props.mLeft || 0}px;
  margin-right: ${props => props.mRight || 0}px;
  padding-top: ${props => props.mTop || 0}px;
  padding-horizontal: ${SIZE(49)}px;
  background-color: ${props => props.color || COLORS.WHITE1};
`;

const BorderView = styled.View`
  margin-left: ${props => props.mLeft || 0}px;
  margin-right: ${props => props.mRight || 0}px;
  height: 0px;
  border-top-width: ${props => props.height || 0.8}px;
  border-color: ${props => props.color || COLORS.WHITE3};
`;

const ShadowWrap = styled.View`
  elevation: 10;
  z-index: 1;
  box-shadow:
    0px ${(props) => (props.forUp ? '-' : '+')}8px;
  shadow-color: ${COLORS.BLACK1};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  background-color: ${COLORS.WHITE1};
`;

const LoadingWrap = styled.View`
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.WHITE2};
`;

const FullImage = styled.Image`
  width: 100%;
  height: 100%;
`;

//
const SearchBarWrap = styled.View`
  width: 100%;
  height: ${SIZE12}px;
  padding: ${SIZE1}px;
  flex-direction: row;
  align-items: center;
  background-color: ${COLORS.WHITE2};
`;

const SearchIconWrap = styled.View`
  padding-horizontal: ${SIZE2}px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  padding: 0px;
  font-size: ${FONT(15)}px;
  font-weight: 500;
  color: ${COLORS.BLACK2};
`;

const RowWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RowBottomWrap = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
`;

const RowBetweenWrap = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ColumnBetweenWrap = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: ${props => props.align ? props.align : 'flex-start'};
`;

const FlexWrap = styled.View`
  flex: ${props => props.flex || 1};
  background-color: ${COLORS.WHITE1};
`;

const SpaceView = styled.View`
  margin-left: ${props => props.mLeft || 0}px;
  margin-top: ${props => props.mTop || 0}px;
  margin-right: ${props => props.mRight || 0}px;
  margin-bottom: ${props => props.mBottom || 0}px;
`;

const CenteredWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const BottomView = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const VerticalLine = styled.View`
  height: ${props => props.height || 0}px;
  width: 1px;
  background-color: ${props => props.color || COLORS.BLACK1};
`;

const ModelView = styled.TouchableOpacity`
  width: ${SIZE(172)}px;
  height: ${SIZE(246)}px;
  margin-left: ${SIZE(10)}px;
  margin-vertical: ${SIZE(4)}px;
  elevation: 2;
  z-index: 1;
  box-shadow: 2px 1px;
  shadow-color: ${COLORS.BLACK1};
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  background-color: ${COLORS.WHITE1};
  border-radius: ${SIZE(8)}px;
`;

const ScrollView = styled.ScrollView`
  background-color: ${COLORS.WHITE1};
`;

const ModelListView = styled.View`
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
`;

export {
  Header,
  HeaderLeft,
  HeaderRight,
  Container,
  Content,
  CenterWrap,
  ContentWrap,
  BorderView,
  ShadowWrap,
  LoadingWrap,
  FullImage,
  SearchBarWrap,
  SearchIconWrap,
  SearchInput,
  RowWrap,
  RowBottomWrap,
  RowBetweenWrap,
  ColumnBetweenWrap,
  FlexWrap,
  SpaceView,
  CenteredWrap,
  BottomView,
  VerticalLine,
  ModelView,
  ScrollView,
  ModelListView
};
