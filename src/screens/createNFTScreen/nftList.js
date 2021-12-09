import React, {useState} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Image} from 'react-native';
import {colors} from '../../res';

import styles from './styles';
import {CardCont, CardField, CardLabel, CardButton} from './components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import {IMAGES} from '../../constants';

const ListItem = props => {
  return (
    <TouchableOpacity style={styles.listCont}>
      <View style={styles.listCenter}>
        <Text style={styles.listLabel}>Testing</Text>
      </View>
      <Image source={IMAGES.leftArrow} style={styles.imageStyles(3)} />
    </TouchableOpacity>
  );
};

const NFTList = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <View style={styles.childCont}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CardCont>
          <CardLabel>Collection</CardLabel>
          <CardField pressable showRight />
          <View style={[styles.saveBtnGroup, {justifyContent: 'center'}]}>
            <CardButton
              onPress={() => setToggle(true)}
              border={!toggle ? colors.BLUE6 : null}
              label="Created"
              buttonCont={styles.leftToggle}
            />
            <CardButton
              onPress={() => setToggle(false)}
              border={toggle ? colors.BLUE6 : null}
              buttonCont={styles.rightToggle}
              label="Draft"
            />
          </View>

          <View style={styles.listMainCont}>
            <ListItem />
            <View style={styles.separator} />
            <ListItem />
            <View style={styles.separator} />
            <ListItem />
            <View style={styles.separator} />
            <ListItem />
            <View style={styles.separator} />
            <ListItem />
          </View>
        </CardCont>
      </ScrollView>
    </View>
  );
};

export default NFTList;
