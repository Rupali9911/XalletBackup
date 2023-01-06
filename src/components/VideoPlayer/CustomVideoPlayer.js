import React, {useState, useRef, useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import {ActivityIndicator} from 'react-native-paper';
import {default as FullScreen} from 'react-native-vector-icons/MaterialCommunityIcons';

import {C_Image} from '../../components';
import {SIZE, SVGS} from 'src/constants';
import {hp, wp} from '../../constants/responsiveFunct';
import {ImagekitType} from '../../common/ImageConstant';
import Colors from '../../constants/Colors';
import {COLORS} from '../../constants';
import {translate} from '../../walletUtils';
import VideoModel from '../../screens/certificateScreen/ModalVideo';
import styles from './style';

const {PlayButtonIcon} = SVGS;

const CustomVideoPlayer = ({
  thumbnailUrl,
  mediaUrl,
  isVideoPlay,
  isVideoFullScreen,
}) => {
  console.log(
    '@@@ Custom Video Player (props)=========>',
    thumbnailUrl,
    mediaUrl,
    isVideoPlay,
    isVideoFullScreen,
  );
  const refVideo = useRef(null);

  const [showThumb, toggleThumb] = useState(true);
  const [videoLoadErr, setVideoLoadErr] = useState(false);
  const [playVideo, toggleVideoPlay] = useState(false);
  const [isFullScreeen, setFullScreeen] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const hitSlop = {top: 5, bottom: 5, left: 5, right: 5};

  useEffect(() => {
    if (!showVideoModal) {
      refVideo?.current?.player?.ref?.seek(videoCurrentTime);
    }
  }, [showVideoModal]);

  const toggleModal = state => {
    setShowVideoModal(state);
    if (state) {
      toggleVideoPlay(true);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        toggleVideoPlay(!playVideo);
        setFullScreeen(!playVideo);
      }}>
      <View
        style={[
          styles.modalImage,
          {
            backgroundColor: videoLoadErr ? Colors.BLACK1 : styles.modalImage,
          },
        ]}>
        {showThumb && (
          <C_Image
            uri={thumbnailUrl}
            size={ImagekitType.FULLIMAGE}
            imageStyle={styles.modalImage}
          />
        )}
        {showThumb && (
          <ActivityIndicator
            style={styles.activity}
            size="medium"
            color={COLORS.BLACK1}
          />
        )}
        {videoError !== '' ? (
          <Text style={styles.videoError}>{videoError}</Text>
        ) : (
          <>
            <VideoPlayer
              repeat
              disableBack
              disableVolume
              key={1}
              ref={refVideo}
              source={{uri: mediaUrl}}
              playInBackground={false}
              disableFullscreen={!playVideo}
              disablePlayPause={!playVideo}
              disableSeekbar={!playVideo}
              disableTimer={!playVideo}
              tapAnywhereToPause={true}
              paused={showVideoModal ? true : !playVideo}
              onProgress={r => setVideoCurrentTime(r?.currentTime)}
              resizeMode={'cover'}
              onError={error => {
                console.log(error);
                setVideoLoadErr(true);
                toggleThumb(false);
                setVideoError(translate('common.VIDEO_FORMAT_ERROR'));
              }}
              onReadyForDisplay={() => toggleThumb(false)}
              onPlay={() => {
                toggleVideoPlay(true);
                setFullScreeen(true);
              }}
              onPause={() => {
                toggleVideoPlay(false);
                setFullScreeen(false);
              }}
              onLoad={o =>
                refVideo?.current?.player?.ref?.seek(videoCurrentTime)
              }
              onHideControls={() => setFullScreeen(false)}
              onShowControls={() => setFullScreeen(true)}
              style={styles.video}
            />
            {showVideoModal ? (
              <VideoModel
                url={mediaUrl}
                toggleModal={toggleModal}
                isVisible={showVideoModal}
                currentTime={videoCurrentTime}
                updateTime={setVideoCurrentTime}
                toggleVideoPlay={toggleVideoPlay}
              />
            ) : null}
          </>
        )}

        {playVideo && isFullScreeen && (
          <TouchableOpacity
            onPress={() => toggleModal(true)}
            hitSlop={hitSlop}
            style={styles.videoFullScreen}>
            <FullScreen
              size={wp('6%')}
              name={'fullscreen'}
              color={Colors.white}
            />
          </TouchableOpacity>
        )}
        {!playVideo && !showThumb && videoError === '' && (
          <View style={styles.videoIcon}>
            <PlayButtonIcon width={SIZE(100)} height={SIZE(100)} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(CustomVideoPlayer);
