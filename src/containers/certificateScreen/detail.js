import React from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Image,
    Text,
    ScrollView,
    TextInput,
    Switch
} from 'react-native';
import styles from './styles';
import { images, colors } from '../../res';

import getLanguage from '../../utils/languageSupport';
import { SIZE } from '../../common/responsiveFunction';
import { C_Image, GroupButton } from '../../components';
const langObj = getLanguage();

const DetailScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerText}>
                    {'Certificate'}
                </Text>
            </View>
            <ScrollView>
                <C_Image uri={''} imageStyle={styles.modalImage} />
                <Text style={styles.nftName}>
                    {'NFT Name NFT Name'}
                </Text>
                <View style={styles.person}>
                    <View style={styles.personType}>
                        <Image style={styles.iconsImage} source={images.icons.pIcon} />
                        <View>
                            <Text style={styles.personTypeText}>
                                {'Owner'}
                            </Text>
                            <Text style={styles.personName}>
                                {'Name Name Name'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.personType}>
                        <Image style={styles.iconsImage} source={images.icons.pIcon} />
                        <View>
                            <Text style={styles.personTypeText}>
                                {'Creator'}
                            </Text>
                            <Text style={styles.personName}>
                                {'Name Name Name'}
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.description}>
                    {'Description'}
                </Text>
                <View style={styles.moreView}>
                    <Text style={styles.moreTitle}>
                        {'More from this creator'}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}>
                        <View style={styles.moreItem}>
                        </View>
                        <View style={styles.moreItem}>
                        </View>
                        <View style={styles.moreItem}>
                        </View>
                        <View style={styles.moreItem}>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <Text style={styles.count}>
                        {'# 1 / 1'}
                    </Text>
                    <View style={styles.row}>
                        <Text style={styles.priceUnit}>
                            {'￥'}
                        </Text>
                        <Text style={styles.price}>
                            {'829,023'}
                        </Text>
                    </View>
                    <GroupButton
                        leftText={'Buy'}
                        rightText={'Offer Other price'}
                        onLeftPress={() => navigation.navigate('Pay')}
                        onRightPress={() => navigation.navigate('MakeBid')}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DetailScreen;
