//======================== Common Imports =============================
import React from 'react';
import {
    Dimensions, SafeAreaView, StyleSheet
} from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';

//======================== Style Imports ==============================
import {
    responsiveFontSize as RF,
    SIZE, widthPercentageToDP as wp
} from '../../common/responsiveFunction';
import { colors } from '../../res';


const TabViewScreen = ({ index, routes, switchRoutes, indexChange, tabBarStyle }) => {

    const renderTabBar = props => (
        <TabBar
            {...props}
            bounces={false}
            scrollEnabled={true}
            indicatorStyle={styles.indicator}
            activeColor={colors.BLUE4}
            inactiveColor={colors.GREY1}
            style={styles.tabbar}
            labelStyle={styles.label}
            tabStyle={{ ...tabBarStyle }}
        />
    );

    const renderTabViews = () => {
        return (
            <TabView
                navigationState={{ index, routes }}
                renderScene={switchRoutes}
                renderTabBar={renderTabBar}
                onIndexChange={indexChange}
                scrollEnabled={true}
                initialLayout={{ width: Dimensions.get('window').width }}
                lazy
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {renderTabViews()}
        </SafeAreaView>
    )
}

export default TabViewScreen;

const styles = StyleSheet.create({
    tabbar: {
        // elevation: 0,
        // borderTopColor: '#EFEFEF',
        // borderTopWidth: 1,
        // shadowOpacity: 0,
        backgroundColor: 'white',
    },

    label: {
        fontSize: RF(1.4),
        fontFamily: 'Arial',
        textTransform: 'none',
    },
    tabStyle: {
        height: SIZE(40),
        width: wp('30%'),
        paddingHorizontal: wp('1%'),
        justifyContent: 'center',
    },

    indicator: {
        borderBottomColor: colors.BLUE4,
        height: 1,
        marginBottom: SIZE(39),
        backgroundColor: colors.BLUE4,
    },
})