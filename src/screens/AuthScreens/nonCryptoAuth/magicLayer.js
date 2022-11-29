import React, {useState, useEffect} from 'react';
import {Platform, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {Loader} from '../../../components';
import Colors from '../../../constants/Colors';
import {
  hp,
  screenHeight,
  screenWidth,
} from '../../../constants/responsiveFunct';
import {getProxy} from './magic-link';

const MagicLayer = () => {
  const [magic, setMagic] = useState({});

  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);
  const {magicLoading} = useSelector(state => state.UserReducer);
  useEffect(() => {
    const magicLink = getProxy();
    setMagic(magicLink);
  }, [selectedLanguageItem]);

  return magic.Relayer ? <magic.Relayer /> : null

  // return magicLoading ? (
  //   <View style={styles.container}>
  //     <View style={styles.magicRelayer}>
  //       <magic.Relayer />
  //     </View>

  //     <View style={styles.loader}>
  //       <Loader />
  //     </View>
  //   </View>
  // ) : null;
};

export default MagicLayer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE1,
    height: screenHeight,
    width: screenWidth,
  },
  magicRelayer: {
    flex: 1 / 2,
  },
  loader: {
    marginTop: Platform.OS === 'android' ? hp(5) : null,
  },
});
