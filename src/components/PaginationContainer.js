import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const PaginationContainer = (props) => {

    return (
        <View
            style={styles.mainContainer(props.width, props.height, props.margin)}>
            <TouchableOpacity onPress={() => props.onPress('prev')} disabled={props.pageNum == 1}>
                <Icon name='arrow-back-ios' size={props.iconSize} color={props.pageNum == 1 ? 'gray' : 'black'} />
            </TouchableOpacity>
            <View>
                <TextInput
                    selectTextOnFocus={props.totalPage > 1}
                    editable={props.totalPage > 1}
                    onSubmitEditing={() => {
                        if (props.pageInput > 0 && props.pageInput <= props.totalPage) {
                            props.setPageNum(props.pageInput)
                            props.onPress(props.pageInput)
                        }
                    }}
                    value={props.pageInput}
                    onChangeText={(e) => {
                        if (Number(e) >= 0 && Number(e) <= props.totalPage) {
                            props.setPageInput(e)
                        }
                    }}
                    style={styles.InputContainer(props.inputWidth, props.inputHight, props.inputColor, props.marginBottomInput)} />
                <Text
                    style={styles.Font(props.fontSize, props.fontWeight, props.color)}>
                    Page {props.pageNum === '' ? '1' : props.pageNum} of {props.totalPage}</Text>
            </View>
            <TouchableOpacity onPress={() => props.onPress('next')} disabled={props.pageNum == props.totalPage}>
                <Icon name='arrow-forward-ios' size={props.iconSize} color={props.pageNum == props.totalPage ? 'gray' : 'black'} />
            </TouchableOpacity>
        </View >
    )
}

const styles = StyleSheet.create({
    mainContainer: (width, height, margin) => ({
        width: width,
        height: height,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        margin: margin
    }),
    InputContainer: (inputWidth, inputHeight, inputColor, marginBottomInput) => ({
        width: inputWidth,
        height: inputHeight,
        borderWidth: 2,
        borderColor: inputColor,
        padding: '5%',
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: marginBottomInput,
        textAlign: 'center'
    }),
    Font: (fontSize, fontWeight, color) => ({
        fontSize: fontSize,
        fontWeight: fontWeight,
        color: color
    }),
})

export default PaginationContainer