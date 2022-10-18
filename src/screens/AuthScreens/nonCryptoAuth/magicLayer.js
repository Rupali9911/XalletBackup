import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {getProxy} from './magic-link';

const MagicLayer = () => {
  const [magic, setMagic] = useState({});

  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);
  useEffect(() => {
    const magicLink = getProxy();
    setMagic(magicLink);
  }, [selectedLanguageItem]);

  return magic?.Relayer ? <magic.Relayer /> : null;
};

export default MagicLayer;
