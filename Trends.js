import React, {Component} from 'react';
import {
    Button,
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
    ListView,
    TextInput,
    ActivityIndicator,
    FlatList } from 'react-native';

export default class Trends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            topics: [],
            location: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({topics: [], isLoading: true});
        fetch(`https://busk-anywhere.herokuapp.com/api/trends?location=${this.state.location.replace(/\s/g,'')}` ,
            {
                method: 'GET'
            }).then(res => {
                return res.json()
            }).then(topics => {
                this.setState({topics: topics, isLoading: false})
                console.log(this.state)
            }).catch(e => {
                this.setState({isLoading: false})
                console.log(e)
            })

    }

    render() {
        if (!this.state.isLoading && (this.state.topics.length < 1)) {
            return (
                <View style={styles.containerPreRender}>
                    <TextInput
                        style={{marginLeft: 30, flex: 1, height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(location) => this.setState({location})}
                        value={this.state.location}
                    />
                    <Button
                      onPress={this.handleSubmit}
                      title="Go!"
                    />
                </View>
            );
        } else if (this.state.isLoading) {
            return (
                <View style={styles.containerPreRender}>
                    <TextInput
                        style={{marginLeft: 30, flex: 1, height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(location) => this.setState({location})}
                        value={this.state.location}
                    />
                    <Button
                      onPress={this.handleSubmit}
                      title="Go!"
                    />
                    <ActivityIndicator />
                </View>
            );
        } else {
            return (
                <View style={styles.containerPostRender}>
                    <View style={{flexDirection: 'row'}}>
                        <TextInput
                            style={{marginLeft: 30, flex: 1, height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(location) => this.setState({location})}
                            value={this.state.location}
                        />
                        <Button
                          onPress={this.handleSubmit}
                          title="Go!"
                        />
                    </View>
                    <View style={styles.trends}>
                        <FlatList
                            data={this.state.topics}
                            renderItem={({item}) => <Text key={item.name}>{item.name}</Text>}
                        />
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    containerPreRender: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 20
    },
    containerPostRender: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: 80,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20        
    },
    trends: {
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
