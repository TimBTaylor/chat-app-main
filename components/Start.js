
import React from 'react';
import { View, Text, TextInput, StyleSheet, Button , ImageBackground, TouchableOpacity, Alert, KeyboardAvoidingView} from 'react-native';

const image = require('../images/mainbackground.png');

export default class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			background: '',
			buttonColor: '#757083',
		}
	}
//check to see if user entered a name and color then redirects them to Chat.js passing name and background props
	setStates = () => {
		if (this.state.name.length === 0 ) {
			Alert.alert('must enter a name')
		} else if (this.state.background.length === 0) {
			Alert.alert('must choose a background color')
		} else {
			this.props.navigation.navigate('Chat', {name: this.state.name, background: this.state.background})
		}
		
	}
//sets background color and the button color to the users choice
	setColors = (color) => {
		this.setState({background: color});
		this.setState({buttonColor: color});
	}
	
	render() {
		const image = require('../images/mainbackground.png');
		return (
			<ImageBackground source={image} style={styles.image}>
				<Text style={styles.appTitle}>Chat App</Text>
				<View style={styles.content}>
					<TextInput
					style={styles.inputBox}
					onChangeText={(name) => this.setState({name})}
					placeholder='Enter username here'
					/>
					<Text style={styles.chooseColor}>
						Choose a Background Color:
					</Text>
					<View style={styles.backgroundColors} >
						<TouchableOpacity onPress={() => this.setColors('#090C08')} style={styles.backgroundcolor1}/>
						<TouchableOpacity onPress={() => this.setColors('#474056')} style={styles.backgroundcolor2}/>
						<TouchableOpacity onPress={() => this.setColors('#8A95A5')} style={styles.backgroundcolor3}/>
						<TouchableOpacity onPress={() => this.setColors('#B9C6AE')} style={styles.backgroundcolor4}/>
					</View>
					<TouchableOpacity
					onPress={() => this.setStates()}
					style={[styles.chatButton, {backgroundColor: this.state.buttonColor} ]}
					>
						<Text style={styles.startChatting}>Start chatting</Text>
					</TouchableOpacity>
				</View>
				<KeyboardAvoidingView behavior='height'/>
			</ImageBackground>
		)
  }
}
const styles = StyleSheet.create({
	image: {
		flex: 1,
		resizeMode: "cover",
		justifyContent: "space-evenly",
		alignItems: 'center',
	  },
	appTitle: {
		fontSize: 45,
		fontWeight: 'bold',
		color: 'white',
		top: -25
	},
	content: {
		backgroundColor: 'white',
		alignItems: 'center',
		width: "88%",
		height: "44%",
		justifyContent: 'space-evenly',
		flexDirection: 'column',
		bottom: -100,
	},
	inputBox : {
		height: '15%',
		width: '88%',
		borderColor: 'gray',
		borderWidth: 1,
		opacity: 50,
		paddingLeft: '3%',
	},
	chooseColor: {
		fontSize: 16,
		color: '#757083',
		opacity: 100,
	},
	backgroundColors: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	backgroundcolor1: {
		height: 40,
		width: 40,
		borderRadius: 20,
		flexDirection: 'row',
		marginLeft: 10,
		backgroundColor: '#090C08',
	},
	backgroundcolor2: {
		height: 40,
		width: 40,
		borderRadius: 20,
		flexDirection: 'row',
		marginLeft: 10,
		backgroundColor: '#474056',
	},
	backgroundcolor3: {
		height: 40,
		width: 40,
		borderRadius: 20,
		flexDirection: 'row',
		marginLeft: 10,
		backgroundColor: '#8A95A5',
	},
	backgroundcolor4: {
		height: 40,
		width: 40,
		borderRadius: 20,
		flexDirection: 'row',
		marginLeft: 10,
		backgroundColor: '#B9C6AE',
	},
	chatButton: {
		width: '88%',
		height: '15%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 15,
	},
	startChatting: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'white'
	}
});