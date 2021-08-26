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
                    {'New Post'}
                </Text>
                <View style={styles.headerRight}>
                    <Text style={styles.headerRightText}>
                        {'Share'}
                    </Text>
                </View>
            </View>
            <ScrollView>
                <View style={styles.listItem}>
                    <View style={styles.rowWrap}>
                        <View style={styles.captionView}>
                        </View>
                        <TextInput style={styles.captionTitle}
                            placeholder={'Write a caption'}
                        />
                    </View>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemText}>
                        {'Tag People'}
                    </Text>
                    <Image style={styles.headerIcon} source={images.icons.forward} resizeMode="contain" />
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemText}>
                        {'Add Location'}
                    </Text>
                    <Image style={styles.headerIcon} source={images.icons.forward} resizeMode="contain" />
                </View>
                <View style={styles.betweenView}>
                    <Text style={styles.itemText}>
                        {'Facebook'}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={"#f4f3f4"}
                        ios_backgroundColor={colors.GREY2}
                        accessibilityRole='button'
                    />
                </View>
                <View style={styles.betweenView}>
                    <Text style={styles.itemText}>
                        {'Twitter'}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={"#f4f3f4"}
                        ios_backgroundColor={colors.GREY2}
                        accessibilityRole='button'

                    />
                </View>
                <View style={styles.betweenView}>
                    <Text style={styles.itemText}>
                        {'Tumblr'}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={"#f4f3f4"}
                        ios_backgroundColor={colors.GREY2}
                        accessibilityRole='button'
                    />
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.itemText}>
                        {'Ameba'}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={"#f4f3f4"}
                        ios_backgroundColor={colors.GREY2}
                        accessibilityRole='button'
                    />
                </View>
                <View style={styles.listItem}>
                    <View style={[styles.rowWrap, { alignItems: 'center', marginBottom: SIZE(28) }]}>
                        <Text style={styles.advancedText}>
                            {'Advanced Settings'}
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
