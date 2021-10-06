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
import {
    SIZE,
    COLORS
} from 'src/constants';
import { translate } from '../../walletUtils';

const langObj = getLanguage();

const NewPostScreen = () => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header} >
                <View style={styles.headerLeft}>
                    <TouchableOpacity>
                        <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.headerText}>
                    {translate("wallet.common.newPost")}
                </Text>
                <View style={styles.headerRight}>
                    <Text style={styles.headerRightText}>
                        {translate("wallet.common.share")}
                    </Text>
                </View>
            </View>
            <ScrollView>
                <View style={styles.listItem}>
                    <View style={styles.rowWrap}>
                        <View style={styles.captionView}>
                        </View>
                        <TextInput style={styles.captionTitle}
                            placeholder={translate("wallet.common.writeCaption")}
                        />
                    </View>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemText}>
                        {translate("wallet.common.tagPeople")}
                    </Text>
                    <Image style={styles.headerIcon} source={images.icons.forward} resizeMode="contain" />
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemText}>
                        {translate("wallet.common.addLocation")}
                    </Text>
                    <Image style={styles.headerIcon} source={images.icons.forward} resizeMode="contain" />
                </View>
                <View style={styles.betweenView}>
                    <Text style={styles.itemText}>
                        {translate("common.facebook")}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: 'red' }}
                        thumbColor={COLORS.WHITE1}
                        ios_backgroundColor={COLORS.WHITE1}
                        accessibilityRole='button'
                    />
                </View>
                <View style={styles.betweenView}>
                    <Text style={styles.itemText}>
                        {translate("common.twitter")}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: 'red' }}
                        thumbColor={COLORS.WHITE1}
                        ios_backgroundColor={COLORS.WHITE1}
                        accessibilityRole='button'

                    />
                </View>
                <View style={styles.betweenView}>
                    <Text style={styles.itemText}>
                        {translate("wallet.common.tumblr")}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: 'red' }}
                        thumbColor={COLORS.WHITE1}
                        ios_backgroundColor={COLORS.WHITE1}
                        accessibilityRole='button'
                    />
                </View>
                <View style={styles.betweenView}>
                    <Text style={styles.itemText}>
                        {'Ameba'}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: 'red' }}
                        thumbColor={COLORS.WHITE1}
                        ios_backgroundColor={COLORS.WHITE1}
                        accessibilityRole='button'
                    />
                </View>
                <View style={[styles.listItem, { paddingVertical: SIZE(7), }]}>
                    <Text style={styles.itemText}>
                        {'Lorem ipsum'}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: 'red' }}
                        thumbColor={COLORS.WHITE1}
                        ios_backgroundColor={COLORS.WHITE1}
                        accessibilityRole='button'
                    />
                </View>
                <View style={styles.listItem}>
                    <View style={[styles.rowWrap, { alignItems: 'center', marginBottom: SIZE(28) }]}>
                        <Text style={styles.advancedText}>
                            {translate("wallet.common.advancedSettings")}
                        </Text>
                        <Image
                            style={{ width: SIZE(5), height: SIZE(9), marginLeft: SIZE(8) }}
                            source={images.icons.forward} resizeMode="contain" />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NewPostScreen;
