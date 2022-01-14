import React from 'react';
import {TouchableOpacity} from 'react-native';
import {C_Image} from '../../components';
import styles from './styles';

export default function NFTItem({item, image, onPress, onLongPress}) {
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.listItem}>
      <C_Image
        uri={image}
        type={
          item?.metaData?.image?.split('.')[
            item?.metaData?.image?.split('.')?.length - 1
          ]
        }
        imageStyle={styles.listImage}
      />
    </TouchableOpacity>
  );
}
