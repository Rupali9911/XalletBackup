import React from 'react';
import {View, ScrollView, Text, Image, TouchableOpacity} from 'react-native';
import {colors} from '../../res';

import styles from './styles';
import {CardCont, CardField, CardLabel, CardButton} from './components';
import {heightPercentageToDP as hp} from '../../common/responsiveFunction';
import {IMAGES} from '../../constants';

const UploadNFT = () => {
  return (
    <View style={styles.childCont}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CardCont style={styles.imageMainCard}>
          <TouchableOpacity activeOpacity={0.5} style={styles.cardImageCont}>
            <Image
              style={styles.completeImage}
              source={IMAGES.imagePlaceholder}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.bannerDes,
              {textAlign: 'center', marginTop: hp('2%')},
            ]}>
            Browse media on your device
          </Text>
        </CardCont>

        <CardCont>
          <CardLabel>NFT Name</CardLabel>
          <CardField />
          <CardLabel>Collection</CardLabel>
          <CardField showRight pressable />
          <CardLabel>Description</CardLabel>
          <Text style={styles.cardfieldCount}>0 / 150</Text>
          <CardField
            inputProps={{multiline: true}}
            contStyle={{height: hp('15%')}}
          />
        </CardCont>

        <CardCont>
          <CardLabel>Network</CardLabel>
          <CardField inputProps={{value: 'Binance'}} pressable showRight />
          <CardLabel>BasePrice</CardLabel>
          <CardField
            inputProps={{value: 'Select Base Price'}}
            pressable
            showRight
          />
          <CardLabel>Also payable in</CardLabel>
          <CardField
            inputProps={{value: 'Select the Currency'}}
            pressable
            showRight
          />
          <CardButton label="Change" />
        </CardCont>

        <CardCont>
          <CardLabel>NFT Type</CardLabel>
          <CardField inputProps={{value: 'Type'}} pressable showRight />
        </CardCont>

        <CardCont>
          <CardLabel>Sale Type</CardLabel>
          <View style={styles.saveBtnGroup}>
            <CardButton label="Fixed Price" buttonCont={{width: '48%'}} />
            <CardButton
              border={colors.BLUE6}
              buttonCont={{width: '48%'}}
              label="Auction"
            />
          </View>
        </CardCont>

        <CardCont>
          <CardLabel>Fixed Price</CardLabel>
          <CardField
            contStyle={{paddingRight: 0}}
            showRight
            rightComponent={
              <CardButton
                buttonCont={{width: '15%', borderRadius: 0}}
                label="ALIA"
              />
            }
          />
        </CardCont>

        <View style={styles.saveBtnGroup}>
          <CardButton label="Save as Draft" buttonCont={{width: '48%'}} />
          <CardButton
            border={colors.BLUE6}
            buttonCont={{width: '48%'}}
            label="Upload"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default UploadNFT;
