import React from 'react';
import {View, ScrollView, Text, Image, TouchableOpacity} from 'react-native';
import {colors} from '../../res';

import styles from './styles';
import {CardCont, CardField, CardLabel, CardButton} from './components';
import {heightPercentageToDP as hp} from '../../common/responsiveFunction';
import {IMAGES} from '../../constants';

const Collection = () => {
  return (
    <View style={styles.childCont}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CardCont>
          <CardLabel>Collection Name</CardLabel>
          <CardField />
        </CardCont>

        <CardCont>
          <CardLabel>Collection Symbol</CardLabel>
          <CardField />
        </CardCont>

        <CardCont>
          <CardLabel>Collection description</CardLabel>
          <Text style={styles.cardfieldCount}>0 / 150</Text>
          <CardField
            inputProps={{placeholder: 'Type Something', multiline: true}}
            contStyle={{height: hp('20%')}}
          />
        </CardCont>

        <CardCont>
          <CardLabel>Contract Address</CardLabel>
          <CardField
            contStyle={{backgroundColor: colors.GREY10}}
            inputProps={{editable: false}}
          />
          <CardButton disable label="Copy" />
        </CardCont>

        <CardCont style={styles.imageMainCard}>
          <TouchableOpacity activeOpacity={0.5} style={styles.cardImageCont}>
            <Image
              style={styles.completeImage}
              source={IMAGES.imagePlaceholder}
            />
          </TouchableOpacity>
          <View style={styles.bannerCardCont}>
            <CardLabel>Banner Image</CardLabel>
            <Text style={styles.bannerDes}>Max Size 1600 * 300</Text>
            <CardButton buttonCont={styles.changeBtn} label="Change" />
          </View>
        </CardCont>

        <CardCont style={styles.imageMainCard}>
          <TouchableOpacity activeOpacity={0.5} style={styles.cardImageCont}>
            <Image
              style={styles.completeImage}
              source={IMAGES.imagePlaceholder}
            />
          </TouchableOpacity>
          <View style={styles.bannerCardCont}>
            <CardLabel>Icon Image</CardLabel>
            <Text style={styles.bannerDes}>Max Size 512 * 512</Text>
            <CardButton buttonCont={styles.changeBtn} label="Change" />
          </View>
        </CardCont>

        <CardButton
          border={colors.BLUE6}
          label="Save as Draft"
          buttonCont={{marginBottom: 0}}
        />
        <View style={styles.saveBtnGroup}>
          <CardButton label="Save" buttonCont={{width: '48%'}} />
          <CardButton
            border={colors.BLUE6}
            buttonCont={{width: '48%'}}
            label="Cancel"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Collection;
