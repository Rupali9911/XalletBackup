import styled from 'styled-components';

import {
  COLORS,
  SIZE,
  FONT,
  FONTS
} from 'src/constants';

const TitleText = styled.Text`
  font-size: ${FONT(60)}px;
  font-weight: 700;
  color: ${COLORS.BLACK1}
`;

const HeaderText = styled.Text`
  font-size: ${FONT(16)}px;
  color: ${props => props.color || COLORS.BLACK1};
  text-align: center;
  font-family: ${FONTS.PINGfANG_SBOLD};
`;

const GreyBoldText = styled.Text`
  font-size: ${FONT(15)}px;
  color: ${COLORS.GREY1};
  font-weight: 700;
`;

const GreySmallText = styled.Text`
  font-size: ${FONT(12)}px;
  color: ${COLORS.GREY3};
  font-family: ${FONTS.ARIAL};
`;

const SmallNormalText = styled.Text`
  font-size: ${FONT(13)}px;
  color: ${COLORS.BLACK1};
  font-weight: 400;
`;

const SmallBoldText = styled.Text`
  font-size: ${FONT(13)}px;
  color: ${COLORS.BLACK1};
  font-weight: 700;
`;

const NormalText = styled.Text`
  font-size: ${FONT(14)}px;
  color: ${COLORS.BLACK1};
  font-weight: 400;
  letter-spacing: ${-0.36}px;
`;

const NormalBoldText = styled.Text`
  font-size: ${FONT(15)}px;
  color: ${COLORS.BLACK1};
  font-family: ${FONTS.ARIAL_BOLD};
`;

const BoldText = styled.Text`
  font-size: ${FONT(16)}px;
  color: ${COLORS.BLACK1};
  line-height: ${SIZE(17)}px;
  font-family: ${FONTS.PINGfANG_SBOLD};
`;

const RegularText = styled.Text`
  font-size: ${FONT(16)}px;
  color: ${props => props.color || COLORS.BLACK1};
  font-weight: 400;
`;

const LargeText = styled.Text`
  font-size: ${FONT(22)}px;
  color: ${COLORS.BLACK1};
  font-family: ${FONTS.ARIAL};
`;

export {
  HeaderText,
  TitleText,
  GreyBoldText,
  GreySmallText,
  SmallNormalText,
  SmallBoldText,
  NormalText,
  NormalBoldText,
  BoldText,
  RegularText,
  LargeText
}