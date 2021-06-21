import { times } from 'lodash';
import React from 'react';
import { View, Platform, KeyboardAvoidingView, Alert, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
const firebase = require('firebase');
require('firebase/firestore');


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      _id: 0,
      user : {
        _id: '',
        name: '',
      }
    }

    const firebaseConfig = {
      apiKey: "AIzaSyAZjBco710dUiLwG5nC8zXlrl_tArP4zAo",
      authDomain: "chat-app-5e7d9.firebaseapp.com",
      projectId: "chat-app-5e7d9",
      storageBucket: "chat-app-5e7d9.appspot.com",
      messagingSenderId: "1002269206931",
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

  }

//shows static messages when component is mounted
  componentDidMount() {
    const { name } = this.props.route.params;
    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      this.setState({
        user: {
          _id: user.uid,
          name: name,
        },
        messages: [],
      });
    });
    this.unsubscribe = this.referenceChatMessages
       .orderBy("createdAt", "desc")
       .onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshots data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createAt: data.createdAt,
        user: {
          _id: data.user._id,
          name: data.user.name,
        }
      })
    })
    this.setState({
      messages,
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessage();
    }
    )
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: message.user,
    })
  }


  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({title: name });
    let background = this.props.route.params.background;

    return (
      <View style={{flex: 1, backgroundColor: background}}>
        <GiftedChat
      messages = {this.state.messages}
      onSend={(messages) => this.onSend(messages)}
      user={this.state.user}
      alwaysShowSend
      />
      { Platform.OS === 'android' ?  <KeyboardAdvoidingView behavior='height' /> : null }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: "blue",
  },
  text: {
    fontSize: 30,
  },
});