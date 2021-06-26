import React from 'react';
import { View, Platform, KeyboardAvoidingView, Alert, StyleSheet } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
const firebase = require('firebase');
require('firebase/firestore');
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';



export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      _id: 0,
      user: {
        _id: '',
        name: '',
      },
      isConnected: false,
      image: null,
      location: null,
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

  //get messages from client side storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //delete message from client side storage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messsages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  //save message to client side storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //checks to see if user is online or offline and returns accordingly
  componentDidMount() {

    const { name } = this.props.route.params;
    this.referenceChatMessages = firebase.firestore().collection('messages');

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true
        });
        console.log('online');
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          this.setState({
            user: {
              _id: user._id,
              name: name,
            },
            messages: [],
          });
        });
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
      } else {
        console.log('offline');
        this.setState({
          isConnected: false
        });
        this.getMessages();
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  //updates messages when there is a new message or if one gets deleted
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
        },
        image: data.image || null,
        location: data.location || null,
      })
    })
    this.setState({
      messages,
    })
  }

  // is called when user send message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.saveMessages();
        this.addMessage();
      }
    )
  }

  //adds message to firestore
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    })
  }

  // checks if user is offline, if so input bar does not render
  renderInputToolbar = props => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  // returns custom map view
  renderCustomView = props => {
    const { currentMessage } = props;
    if (currentMessage.location) {
        return (
            <MapView
                style={{
                    width: 150,
                    height: 100,
                    borderRadius: 13,
                    margin: 3
                }}
                region={{
                    latitude: Number(currentMessage.location.latitude),
                    longitude: Number(currentMessage.location.longitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
            />
        );
    }
    return null;
}

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  }


  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: `${name}'s Chatroom` });
    let background = this.props.route.params.background;

    return (
      <View style={{ flex: 1, backgroundColor: background }}>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
          alwaysShowSend
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
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