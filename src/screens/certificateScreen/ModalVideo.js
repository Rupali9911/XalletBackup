import React, {useState, useEffect, useRef} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';
import Colors from '../../constants/Colors';

const VideoModel = props => {
  const {
    url,
    isVisible,
    toggleModal,
    currentTime,
    updateTime,
    videoPlay,
    toggleVideoPlay,
  } = props;

  const refVideo = useRef(null);
  // const [screenState, setScreenState] = useState({
  //   fullScreen: false,
  //   Width_Layout: '',
  //   Height_Layout: '',
  //   potraitMode: true,
  // });
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setStatus(true);
    Orientation.lockToPortrait();
  }, []);

  // useEffect(() => {
  //   let {fullScreen, potraitMode} = screenState;
  //   !fullScreen && !potraitMode ? Orientation.lockToPortrait() : '';
  // }, [screenState.fullScreen]);

  // const changeState = values => {
  //   setScreenState(prevState => {
  //     return {
  //       ...prevState,
  //       ...values,
  //     };
  //   });
  // };

  const videoPlayerView = () => {
    return (
      <VideoPlayer
        repeat
        ref={refVideo}
        source={{uri: url}}
        onBack={() => {
          console.log(
            '🚀 ~ file: ModalVideo.js ~ line 55 ~ videoPlayerView ~ onBack',
            // currentTime,
            status,
          );
          toggleModal(false);
        }}
        resizeMode={'contain'}
        toggleResizeModeOnFullscreen={false}
        playInBackground={false}
        tapAnywhereToPause={true}
        paused={!status}
        onEnterFullscreen={() => {
          console.log(
            '🚀 ~ file: ModalVideo.js ~ line 65 ~ videoPlayerView ~ onEnterFullscreen',
            // currentTime,
            status,
          );
          toggleModal(false);
        }}
        onLoad={l => {
          console.log(
            '🚀 ~ file: ModalVideo.js ~ line 70 ~ onLoad ~ l',
            currentTime,
            // l,
          );
          refVideo?.current?.player?.ref?.seek(currentTime);
        }}
        onProgress={r => {
          //   console.log(
          //     '🚀 ~ file: ModalVideo.js ~ line 73 ~ onLoad ~ r',
          //     r?.currentTime,
          //   );
          updateTime(r?.currentTime);
        }}
        onPlay={() => {
          console.log('🚀 ~ file: ModalVideo.js ~ line 100 ~  ~ onPlay');
          setStatus(true);
          toggleVideoPlay(true);
        }}
        onPause={() => {
          console.log('🚀 ~ file: ModalVideo.js ~ line 106 ~  ~ onPause');
          setStatus(false);
          toggleVideoPlay(false);
        }}
      />
    );
  };

  return (
    <Modal
      animationType={'fade'}
      supportedOrientations={['portrait']}
      transparent={true}
      visible={isVisible}>
      <View
        style={styles.ModalWrapper}
        // onLayout={event => {
        //   const {layout} = event.nativeEvent;
        //   // changeState({
        //   //   Width_Layout: layout.width,
        //   //   Height_Layout: layout.height,
        //   // });
        // }}
      >
        {videoPlayerView()}
      </View>

      {/* <TouchableOpacity
        onPress={() => {
          console.log('Modal Close');
          console.log(
            '🚀 ~ file: ModalVideo.js ~ line 55 ~ videoPlayerView ~ onBack',
            // currentTime,
            status,
          );
          toggleModal(false);
        }}
        // hitSlop={hitSlop}
        style={{
          // height: 40,
          // width: 50,
          position: 'absolute',
          top: 150,
          left: 10,
        }}>
        <FullScreen size={30} name={'fullscreen'} color={Colors.white} />
      </TouchableOpacity> */}
    </Modal>
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
