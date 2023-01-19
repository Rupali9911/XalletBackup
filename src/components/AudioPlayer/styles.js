import { StyleSheet } from 'react-native';
import {
    SIZE
} from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
    musicPlayer: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        height: SIZE(50),
        backgroundColor: '#f1f1f1',
        borderRadius: SIZE(80),
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: SIZE(10),
    },
    activity: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoIcon: {
        width: SIZE(80),
        height: SIZE(80),
        borderRadius: SIZE(80),
        backgroundColor: Colors.BLACK4,
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeView: {
        width: SIZE(90),
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    controlView: {
        width: SIZE(40),
        height: SIZE(40),
        borderRadius: SIZE(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionView: {
        width: SIZE(40),
        height: SIZE(40),
        borderRadius: SIZE(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuOption: {
        height: SIZE(35),
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },
    speedMenuOption: {
        height: SIZE(35),
        textAlign:'center'
    },
    playbackSpeedView:{
        flexDirection:"row",
        marginHorizontal:20,
    },
    playbackSpeedTitle:{
    textAlign:'center',
    left:20}
});

export default styles;

