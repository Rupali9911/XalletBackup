import { BlurView } from '@react-native-community/blur';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
// import Video from 'react-native-fast-video';
import Video from 'react-native-video';

import { createImageProgress } from 'react-native-image-progress';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';
import { COLORS, FONT, FONTS, IMAGES, SIZE, WIDTH } from 'src/constants';
import { BorderView, RowWrap, SpaceView } from 'src/styles/common.styles';
import { NormalText } from 'src/styles/text.styles';
import styled from 'styled-components';
import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';
import { handleLikeDislike } from '../../store/actions/nftTrendList';
import { useSelector, useDispatch } from 'react-redux';

const ModalContainer = styled.View`
  flex: 1;
`;

const MainContent = styled.View`
  background-color: ${COLORS.WHITE1};
  border-radius: ${SIZE(12)}px;
  overflow: hidden;
`;

const ProfileIcon = styled.View`
  width: ${SIZE(28)}px;
  height: ${SIZE(28)}px;
  border-radius: ${SIZE(14)}px;
  background-color: ${COLORS.GREY2};
  overflow: hidden;
`;

const ImageView = styled.View`
  width: ${WIDTH * 0.9};
  height: ${WIDTH * 0.9};
  overflow: hidden;
`;

const ButtonList = styled.View`
  background-color: #ffffff99;
  border-radius: ${SIZE(12)}px;
  overflow: hidden;
  width: ${WIDTH * 0.6};
`;

const ButtonItem = styled.TouchableOpacity`
  padding-left: ${SIZE(20)}px;
  padding-vertical: ${SIZE(12)}px;
`;

const CreatorName = styled.Text`
  font-size: ${FONT(12)}px;
  color: ${COLORS.BLACK1};
  font-family: ${FONTS.ARIAL_BOLD};
  max-width: ${WIDTH * 0.7};
`;

const Image = createImageProgress(FastImage);

const DetailModal = ({ isModalVisible, toggleModal, data, index }) => {

  const dispatch = useDispatch();
  const [artist, setArtist] = useState('');
  const [profileImage, setCreatorImage] = useState();
  const fileType =
    data.metaData.image.split('.')[data.metaData.image.split('.').length - 1];
  const imageUrl = fileType !== 'mp4' ? data.thumbnailUrl : data.metaData.image;

  useEffect(() => {
    let params = data.tokenId.toString().split('-');
    let chainType = params.length > 1 ? params[0] : 'binance';

    let body_data = {
      tokenId: data.tokenId,
      networkType: networkType,
      type: '2D',
      chain: chainType,
    };

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch(`${BASE_URL}/xanalia/getDetailNFT`, fetch_data_body)
      .then(response => response.json())
      .then(res => {
        if (res.data.length > 0 && res.data !== 'No record found') {
          const data = res.data[0];

          setArtist(data.returnValues.to);

          let req_data = {
            owner: data.returnValues.to,
            token: 'HubyJ*%qcqR0',
          };

          let body = {
            method: 'POST',
            body: JSON.stringify(req_data),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          };
          fetch(`${BASE_URL}/xanalia/getProfile`, body)
            .then(response => response.json())
            .then(res => {
              if (res.data) {
                res.data.username && setArtist(res.data.username);
                setCreatorImage(res.data.profile_image);
              }
            });
        } else if (res.data.data === 'No record found') {
          alertWithSingleBtn(
            translate('common.error'),
            translate('common.norecordfound'),
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const onToggleLike = async () => {
    dispatch(handleLikeDislike(data, index));
    toggleModal();
  }

  return (
    <ModalContainer>
      <Modal
        onRequestClose={toggleModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        transparent={true}
        visible={isModalVisible}
        style={{ margin: 0 }}>
        <BlurView
          blurType="light"
          style={{
            flex: 1,
          }}>
          <TouchableOpacity
            onPress={toggleModal}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback>
              <View>
                <MainContent>
                  <SpaceView mTop={SIZE(10)} />
                  <RowWrap>
                    <SpaceView mLeft={SIZE(10)} />
                    <ProfileIcon>
                      <Image
                        source={
                          profileImage
                            ? { uri: profileImage }
                            : IMAGES.DEFAULTPROFILE
                        }
                        style={{ width: '100%', height: '100%' }}
                      />
                    </ProfileIcon>
                    <SpaceView mLeft={SIZE(10)} />
                    <CreatorName numberOfLines={1}>{artist}</CreatorName>
                    <SpaceView mRight={SIZE(10)} />
                  </RowWrap>
                  <SpaceView mTop={SIZE(10)} />
                  <ImageView>
                    {fileType !== 'mp4' && fileType !== 'mov' ? (
                      <Image
                        indicator={Progress.Pie}
                        source={{
                          uri: imageUrl,
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <Video
                        source={{ uri: imageUrl }} // Can be a URL or a local file.
                        repeat
                        playInBackground={false}
                        paused={!isModalVisible}
                        resizeMode={'cover'} // Store reference
                        // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                        // onError={this.videoError}               // Callback when video cannot be loaded
                        style={{ width: '100%', height: '100%' }}
                      />
                    )}
                  </ImageView>
                </MainContent>
                <SpaceView mTop={SIZE(20)} />
                <ButtonList>
                  <ButtonItem onPress={onToggleLike}>
                    <NormalText>
                      {data.like === 0 ? translate('wallet.common.Like') : translate('wallet.common.Dislike') }
                    </NormalText>
                  </ButtonItem>
                  <BorderView />
                  <ButtonItem onPress={toggleModal}>
                    <NormalText>
                      {translate('wallet.common.Comment')}
                    </NormalText>
                  </ButtonItem>
                  <BorderView />
                  <ButtonItem onPress={toggleModal}>
                    <NormalText>
                      {translate('wallet.common.sendMessage')}
                    </NormalText>
                  </ButtonItem>
                </ButtonList>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </BlurView>
      </Modal>
    </ModalContainer>
  );
};

export default DetailModal;
