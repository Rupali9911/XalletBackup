import {Portal} from '@gorhom/portal';
import React, {useState, useEffect, useRef} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Colors from '../../constants/Colors';

const VideoModel = props => {
  const {
    url,
    isVisible,
    toggleModal,
    currentTime,
    updateTime,
    toggleVideoPlay,
  } = props;

  const refVideo = useRef(null);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setStatus(true);
    // Orientation.lockToPortrait();
  }, []);

  const updateStatus = state => {
    setStatus(state);
    toggleVideoPlay(state);
  };

  const videoPlayerView = () => {
    return (
      <VideoPlayer
        repeat
        ref={refVideo}
        source={{uri: url}}
        onBack={() => toggleModal(false)}
        resizeMode={'contain'}
        toggleResizeModeOnFullscreen={false}
        disableFullscreen={true}
        playInBackground={false}
        tapAnywhereToPause={true}
        paused={!status}
        onLoad={l => refVideo?.current?.player?.ref?.seek(currentTime)}
        onProgress={r => updateTime(r?.currentTime)}
        onPlay={() => updateStatus(true)}
        onPause={() => updateStatus(false)}
      />
    );
  };

  return (
    <Portal>
      <Modal
        animationType={'fade'}
        supportedOrientations={['portrait']}
        transparent={true}
        visible={isVisible}>
        <View style={styles.ModalWrapper}>{videoPlayerView()}</View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  ModalOutsideContainer: {
    flex: 1,
  },
  ModalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  ModalWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  ModalBox: {
    width: '85%',
    backgroundColor: Colors.white,
    paddingTop: 10,
    paddingHorizontal: 6,
    borderRadius: 4,
    opacity: 1,
  },
  VideoPlayerContainer: {
    width: '100%',
    height: 150,
  },
  VideoTitle: {
    paddingVertical: 8,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default React.memo(VideoModel);
