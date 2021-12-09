import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import {colors} from '../../res';

import styles from './styles';
import {CardCont, CardField, CardLabel, CardButton} from './components';
import {heightPercentageToDP as hp} from '../../common/responsiveFunction';

const Filter = () => {
  return (
    <View style={styles.childCont}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CardCont>
          <CardLabel>Collection</CardLabel>
          <CardField pressable showRight />
          <CardLabel style={{marginTop: hp(5)}}>Filter name</CardLabel>
          <CardField inputProps={{placeholder: 'Filter name'}} />
          <CardLabel>Type</CardLabel>
          <CardField inputProps={{value: 'Number'}} pressable showRight />
          <CardLabel>Value</CardLabel>
          <View style={styles.groupField}>
            <CardField
              inputProps={{value: 'Number'}}
              contStyle={{width: '38%'}}
            />
            <View style={styles.centerFieldCont}>
              <Text style={styles.titleDes}>to</Text>
            </View>
            <CardField
              inputProps={{value: 'Number'}}
              contStyle={{width: '38%'}}
            />
          </View>

          <View style={styles.saveBtnGroup}>
            <CardButton label="Save" buttonCont={{width: '48%'}} />
            <CardButton
              border={colors.BLUE6}
              buttonCont={{width: '48%'}}
              label="Cancel"
            />
          </View>

          <CardButton label="Add New Filter" />
        </CardCont>
      </ScrollView>
    </View>
  );
};

export default Filter;
