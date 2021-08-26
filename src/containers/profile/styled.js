import styled from 'styled-components';

import {
    COLORS,
    SIZE,
    FONT
} from 'src/constants';

const UserImageView = styled.View`
    width: ${SIZE(76)}px;
    height: ${SIZE(76)}px;
    border-radius: ${SIZE(76)}px;
    background-color: ${COLORS.GREY1};
`;

const FollowButton = styled.TouchableOpacity`
    width: ${SIZE(178)}px;
    height: ${SIZE(29)}px;
    background-color: ${COLORS.BLUE2};
    border-radius: ${SIZE(1.5)};
    align-items: center;
    justify-content: center;
`;

const FollowButtonText = styled.Text`
    color: ${COLORS.WHITE1};
    font-size: ${FONT(12)}px;
    font-weight: 700;
`;

const EditButton = styled.TouchableOpacity`
    flex: 1;
    height: ${SIZE(30)}px;
    border-radius: ${SIZE(2)}px;
    border-width: ${SIZE(1)}px;
    border-color: ${COLORS.GREY7};
    align-items: center;
    justify-content: center;
`;

const EditButtonText = styled.Text`
    color: ${COLORS.BLACK1};
    font-size: ${FONT(12)}px;
    font-weight: 700;
`;

const DescriptionView = styled.View`
    padding-horizontal: ${SIZE(16)}px;
`;

const SmallText = styled.Text`
    font-size: ${FONT(11)}px;
    color: ${COLORS.BLACK1};
    font-weight: 400;
`;

const ImageView = styled.View`
  height: ${SIZE(170)}px;
`;

const DetailView = styled.View`
  flex: 1;
  justify-content: space-between;
  padding-horizontal: ${SIZE(5)}px;
  padding-vertical: ${SIZE(5)}px;
`;

const Title = styled.Text`
  font-size: ${FONT(14)}px;
  color: ${COLORS.BLACK1};
  font-weight: 400;
`;

const PriceView = styled.View`
    flex-direction: row;
    align-items: flex-end;
`;

const PriceText = styled.Text`
    color: ${COLORS.RED1};
    font-size: ${FONT(18)}px;
    font-weight: 400;
`;

const PriceTypeText = styled.Text`
    color: ${COLORS.RED1};
    font-size: ${FONT(11)}px;
    font-weight: 400;
    padding-bottom: ${SIZE(2)}px;
`;

const NumberOfPersonText = styled.Text`
  color: #B2B2B2;
  font-size: ${FONT(11)}px;
  font-weight: 400;
  margin-left: ${SIZE(5)}px;
  margin-top: ${SIZE(3)}px;
`;

const DotView = styled.View`
  width: ${SIZE(4)}px;
  height: ${SIZE(4)}px;
  background-color: ${COLORS.GREY2};
  border-radius: ${SIZE(4)}px;
  margin-top: ${SIZE(4)}px;
`;

export {
    UserImageView,
    FollowButton,
    FollowButtonText,
    EditButton,
    EditButtonText,
    DescriptionView,
    SmallText,
    ImageView,
    DetailView,
    Title,
    PriceView,
    PriceText,
    PriceTypeText,
    NumberOfPersonText,
    DotView
}