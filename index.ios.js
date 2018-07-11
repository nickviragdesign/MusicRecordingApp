import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    TouchableHighlight,
    StyleSheet,
    View,
    AppRegistry,
    TabBarIOS } from 'react-native';
import Record from './Recorder';
import Login from './Login';
import Trends from './Trends';

class MainTabBar extends Component {

    constructor(props) {
        super(props);
        this.state = {selectedTab: 'Record'};
    }

    setTab(tabId) {
        this.setState({selectedTab: tabId});
    }

    render() {
        return (
            <TabBarIOS>
                <TabBarIOS.Item
                    systemIcon="favorites"
                    selected={this.state.selectedTab === 'Record'}
                    onPress={() => this.setTab('Record')}>
                    <Record/>
                </TabBarIOS.Item>

                <TabBarIOS.Item
                    systemIcon="downloads"
                    selected={this.state.selectedTab === 'Trends'}
                    onPress={() => this.setTab('Trends')}>
                    <Trends/>
                </TabBarIOS.Item>

                <TabBarIOS.Item
                    systemIcon="downloads"
                    selected={this.state.selectedTab === 'Login'}
                    onPress={() => this.setTab('Login')}>
                    <Login/>
                </TabBarIOS.Item>
            </TabBarIOS>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    tabContent: {
      flex: 1,
      alignItems: 'center'
    },
    tabText: {
      margin: 50,
      fontSize: 40
    }
});

AppRegistry.registerComponent('Surroundings', () => MainTabBar);
