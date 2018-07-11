import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AppRegistry } from 'react-native';
import Trends from './Trends';
const FBSDK = require('react-native-fbsdk');

const {
    LoginButton,
    AccessToken
} = FBSDK;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        };
    }

    componentDidMount() {
        // Check if user is already logged in
        AccessToken.getCurrentAccessToken().then(
            (data) => {
                console.log(data);
                if (data !== null) {
                    this.setState({ loggedIn: true });
                    console.log(this.state.loggedIn);
                } else {
                    this.setState({ loggedIn: false });
                    console.log(this.state.loggedIn);
                }
            }
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <LoginButton
                    publishPermissions={["publish_actions"]}
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                console.log("Login failed with error: " + result.error);
                            } else if (result.isCancelled) {
                                console.log("Login was cancelled");
                            } else {
                                this.setState({ loggedIn: true });
                                console.log("Login was successful with permissions: " + result.permissions);
                            }
                        }
                    }
                    onLogoutFinished={() =>
                        this.setState({ loggedIn: false })
                    }
                />
                <Text>Logged in: {this.state.loggedIn ? 'yes' : 'no'}</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
