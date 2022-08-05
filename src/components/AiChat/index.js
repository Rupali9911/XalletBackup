import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { AppHeader } from '../../components'
import Colors from '../../constants/Colors'
import { hp, RF, wp } from '../../constants/responsiveFunct'
import React, { useState } from 'react'

const AiChat = () => {

    const [message,setMessage] = useState('')

  return (
    <SafeAreaView style={styles.mainContainer}>
        <AppHeader
          title={'Chat With AI'}
          showBackButton
          isWhite
          containerStyle={{backgroundColor:'#FF3B65'}}
        />
      <View style={styles.chatContainer}>

      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message"
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendBtn} >
          <Text style={styles.sendText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#FF3B65'
    },
    chatContainer:{
        flex:1,
        width:'100%',
        height:'100%',
        backgroundColor: Colors.WHITE1
    },
    inputContainer: {
        paddingHorizontal: hp(0.1),
        width: '100%',
        height: hp(10),
        alignItems: 'center',
        backgroundColor: '#FF3B65',
        bottom:hp(1.5),
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    input: {
        fontSize: 17,
        marginHorizontal: 3,
        paddingHorizontal: 15,
        borderColor: '#fff',
        borderWidth: 2,
        width: '80%',
        height: 50,
        borderRadius: 300 / 2,
        backgroundColor:'#fff'
    },
    sendBtn: {
        width: 50,
        height: 50,
        borderRadius: 60 / 2,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 3
    },
    sendText: {
    fontSize: 30,
    color: 'black',
    },

})

export default AiChat