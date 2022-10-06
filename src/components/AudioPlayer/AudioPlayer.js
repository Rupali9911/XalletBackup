import Slider from '@react-native-community/slider';
import React, { useEffect, useRef, useState } from 'react';
import {
    Platform,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Sound from 'react-native-sound';
import {
    default as PlayPause,
    default as PlaySpeed
} from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMute from 'react-native-vector-icons/Octicons';

import { SIZE, SVGS } from 'src/constants';
import Colors from '../../constants/Colors';
import { wp } from '../../constants/responsiveFunct';
import { translate } from '../../walletUtils';
import styles from './styles';


const {
    ThreeDotsVerticalIcon,
} = SVGS;

const AudioPlayer = ({ mediaUrl }) => {
    const [music, setMusic] = useState(null);
    const [isPlaying, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [durationSec, setDurationSec] = useState(0);
    const [currentSec, setCurrentSec] = useState(0);
    const [currentmin, setCurrentmin] = useState(0);
    const [openPlaySpeed, setOpenPlaySpeed] = useState(false);
    const [mute, setMute] = useState(false);
    const [songCompleted, setSongCompleted] = useState(false);

    useEffect(() => {
        if (true) {
            console.log("@@@ media props ========>", mediaUrl)
            const audio = new Sound(mediaUrl, '', err => {
                console.log("@@@ sound load error  ========>", err)
                if (err) {
                    return;
                }
            });
            setMusic(audio);
            return function cleanup() {
                audio.release();
            };
        }
    }, [mediaUrl]);

    const durationRef = useRef(0);

    useEffect(() => {
        if (true) {
            const interval = setInterval(() => {
                if (music && durationRef?.current <= 0) {
                    setDuration(music?.getDuration());
                    setDurationMin(Math.floor(music.getDuration() / 60));
                    setDurationSec(Math.floor(music.getDuration() % 60));
                    durationRef.current = music.getDuration();
                } else if (music && isPlaying) {
                    music.getCurrentTime(seconds => {
                        setCurrentTime(Math.round(seconds));
                        setCurrentmin(Math.floor(seconds / 60));
                        setCurrentSec(Math.floor(seconds % 60));
                    });
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [isPlaying, music]);

    useEffect(() => {
        if (Math.floor(duration) === currentTime) {
            setCurrentTime(0);
            setCurrentmin(0);
            setCurrentSec(0);
            setPlaying(false);
            setSongCompleted(true);
        }
    }, [currentTime]);

    useEffect(() => {
        if (songCompleted) {
            setCurrentSec(0);
            setSongCompleted(false);
        }
    }, [songCompleted]);

    const onPlayPausePress = async () => {
        if (isPlaying) {
            music.pause();
            setPlaying(false);
        } else {
            music.play(success => {
                setPlaying(false);
            });
            setPlaying(true);
        }
    };

    useEffect(() => {
        if (mute) {
            music?.setVolume(0);
        } else {
            music?.setVolume(1);
        }
    }, [mute, music]);

    const seekAudio = async value => {
        if (value < 0) {
            await music?.setCurrentTime(0);
            setCurrentTime(0);
            setCurrentmin(0);
            setCurrentSec(0);
            return;
        }
        await music?.setCurrentTime(value);
        if (isPlaying) {
            await music?.play();
        }
        setCurrentTime(value);
        setCurrentmin(Math.floor(value / 60));
        setCurrentSec(Math.floor(value % 60));
    };

    const setAudioSpeed = speed => {
        setOpenPlaySpeed(false);
        music.setSpeed(speed);
    };
    return (
        <View style={styles.musicPlayer}>
            {duration === -1 ? (
                <View style={styles.controlView}>
                    <ActivityIndicator size="small" color="#0b0b0b" />
                </View>
            ) : (
                <TouchableOpacity
                    onPress={() => {
                        onPlayPausePress();
                    }}
                    style={styles.controlView}>
                    <PlayPause
                        name={isPlaying ? 'pause' : 'play'}
                        size={wp('6.5%')}
                    />
                </TouchableOpacity>
            )}

            {duration !== -1 ? (
                <View style={styles.timeView}>
                    <Text>
                        {currentmin}:
                        {currentSec > 9 ? currentSec : '0' + currentSec} /{' '}
                        {durationMin}:
                        {durationSec > 9 ? durationSec : '0' + durationSec}
                    </Text>
                </View>
            ) : (
                <View style={styles.timeView}>
                    <Text>0:00 / 0:00</Text>
                </View>
            )}
            <View style={{ width: SIZE(150) }}>
                <Slider
                    style={{ width: SIZE(140) }}
                    value={currentTime === 0 ? -1 : currentTime}
                    tapToSeek={true}
                    minimumValue={0}
                    maximumValue={duration}
                    minimumTrackTintColor={Colors.GREY1}
                    maximumTrackTintColor={Colors.GREY2}
                    onSlidingComplete={value => {
                        seekAudio(value);
                    }}
                />
            </View>
            <TouchableOpacity
                style={styles.controlView}
                onPress={() => setMute(!mute)}>
                <IconMute name={mute ? 'mute' : 'unmute'} size={wp('4.5%')} />
            </TouchableOpacity>
            <View>
                <Menu
                    onSelect={() => {
                        setOpenPlaySpeed(true);
                    }}>
                    <MenuTrigger
                        style={styles.optionView}
                        children={<ThreeDotsVerticalIcon />}
                    />
                    <MenuOptions>
                        <MenuOption style={styles.menuOption}>
                            <PlaySpeed size={wp('5%')} name={'play-speed'} />
                            <Text>{translate('common.playbackSpeed')}</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
            <View>
                <Menu
                    key={openPlaySpeed}
                    opened={openPlaySpeed}
                    onBackdropPress={() => setOpenPlaySpeed(false)}
                    style={
                        Platform.OS === 'android'
                            ? {
                                position: 'absolute',
                                left: 50,
                            }
                            : {}
                    }>
                    <MenuTrigger />
                    <MenuOptions>
                        <MenuOption
                            onSelect={() => setAudioSpeed(0.25)}
                            style={styles.speedMenuOption}
                            text="0.25"
                        />
                        <MenuOption
                            onSelect={() => setAudioSpeed(0.5)}
                            style={styles.speedMenuOption}
                            text="0.5"
                        />
                        <MenuOption
                            onSelect={() => setAudioSpeed(0.75)}
                            style={styles.speedMenuOption}
                            text="0.75"
                        />
                        <MenuOption
                            onSelect={() => setAudioSpeed(1)}
                            style={styles.speedMenuOption}
                            text="Normal"
                        />
                        <MenuOption
                            onSelect={() => setAudioSpeed(1.25)}
                            style={styles.speedMenuOption}
                            text="1.25"
                        />
                        <MenuOption
                            onSelect={() => setAudioSpeed(1.5)}
                            style={styles.speedMenuOption}
                            text="1.5"
                        />
                        <MenuOption
                            onSelect={() => setAudioSpeed(1.75)}
                            style={styles.speedMenuOption}
                            text="1.75"
                        />
                        <MenuOption
                            onSelect={() => setAudioSpeed(2)}
                            style={styles.speedMenuOption}
                            text="2"
                        />
                    </MenuOptions>
                </Menu>
            </View>
        </View>
    )
}

export default React.memo(AudioPlayer);