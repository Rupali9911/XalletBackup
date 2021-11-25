import React from 'react'
import { View, StyleSheet } from 'react-native'
import {Searchbar} from 'react-native-paper';
import Colors from '../constants/Colors';
import { hp, RF, wp } from '../constants/responsiveFunct';

export default function AppSearch() {
    return (
        <View style={styles.container}>
            <Searchbar 
                style={styles.searchbar}
                inputStyle={styles.inputStyle}/>

            

        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        // marginVertical: hp("6%"),
        // position: 'absolute'
    },  
    searchbar: {
        borderWidth: 1,
        borderColor: Colors.borderLightColor3,
        borderRadius: hp("3%"),
        marginBottom: hp("1%"),
        marginHorizontal: wp("2"),
        height: hp("5.5%")
    },
    inputStyle: {
        fontSize: RF(1.8),
    }
});