import React, {Component} from 'react';
import {
    Button,
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
    AppRegistry,
    Slider } from 'react-native';
import { Recorder, MediaStates } from 'react-native-audio-toolkit';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Record extends Component {
    constructor() {
        super();
        this.state = {
            disabled: false,
            duration: 12,
            playerState: 17,
            recorderState: 1217,
            audioFileName: "",
            fullAudioFileName: "",
            currentTime: 0
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._readCurrentTime = this._readCurrentTime.bind(this);
    }

    componentWillMount() {
        this.rec = null;
        this.player = null;
        Sound.setCategory('MultiRoute');
    }

    // Must press record button twice for now.
    // Once to start, and once to end.
    _onPressRecord() {
        if (this.state.recorderState !== 4) {
            // Disable button while recording and playing back
            this.setState({disabled: false});

            if (this.player !== null) {
                this.player.release();
                this.player = null;
            }
            let date = new Date();
            let time = date.getTime();
            let audioFileName = "recorded-audio" + time + ".m4a";
            this.rec = new Recorder(audioFileName);
            this.setState({recorderState: this.rec.state});
            this.setState({audioFileName: audioFileName});

            // Start recording
            this.rec.record(() => {
                this.setState({recorderState: this.rec.state});
                var fullFilePath = this.rec.fsPath;
                var relativeFilePath = fullFilePath.substring(fullFilePath.lastIndexOf("/") + 1, fullFilePath.length);
                this.setState({fullAudioFileName: fullFilePath, audioFileName: relativeFilePath});
            });
        } else {
            // Stop recording
            this.rec.stop((err) => {
                this.setState({disabled: false, recorderState: this.rec.state});
                this.rec.destroy();
                this.setState({recorderState: this.rec.state});
            });
        }
    }

    // Must press play button twice for now.
    // Once to clear the existing song object,
    // and a second time to play the audio file.
    _onPressPlayback() {
        this.setState({disabled: false});
        // Play the file after recording has stopped
        console.log(this.player);
        if (this.player == null) {

            this.player = new Sound(this.state.fullAudioFileName, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                } else {
                    console.log(this.player.getDuration());
                    // loaded successfully
                    console.log('duration in seconds: ' + this.player.getDuration() + ' it is ' + this.player.isLoaded() + ' that ' + Sound.MAIN_BUNDLE + this.state.audioFileName + ' is loaded');
                }
            });
        } else if (this.player !== null && this.player.isLoaded()) {

            console.log(this.player);
            this._readCurrentTime();
            this.setState({duration: this.player.getDuration()});
            this.player.play((onEnd) => {

                console.log("is this loaded? " + this.player.isLoaded());
                console.log(this.state.audioFileName);

                if (onEnd) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
    }

    _handleSubmit(event) {
        var submitData = new FormData();
        submitData.append('songFile',{uri:this.state.fullAudioFileName, type:'audio/x-m4a', name:this.state.audioFileName});
        fetch('http://127.0.0.1:3000/api/artist-submit',
            {
                method: 'POST',
                body: submitData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    _readCurrentTime() {
        let timeCount = setInterval(() => {
            this.player.getCurrentTime((seconds, isPlaying) => {
                this.setState({currentTime: seconds});
                console.log(this.state.currentTime);
                console.log("is playing?: " + isPlaying);
                if (isPlaying == false) {
                    clearInterval(timeCount);
                }
            });
        }, 10 );
    }

    render() {
        const myButton = (
          <Icon name="microphone" size={40} color="#3b5998"/>
        );
        return (
            <View style={styles.container}>
                <TouchableHighlight disabled={this.state.disabled} onPress={() => this._onPressRecord()}>
                    {myButton}
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this._onPressPlayback()}>
                    <Text style={styles.play}>
                        Play!
                    </Text>
                </TouchableHighlight>
                <Slider
                    style={{ width: 300 }}
                    step={.01}
                    minimumValue={0}
                    maximumValue={this.state.duration}
                    value={this.state.currentTime}
                    onValueChange={val => this.player.setCurrentTime(val)}
                    // onSlidingComplete={ val => this.getVal(val)}
                />
                <TouchableHighlight onPress={() => this._handleSubmit()}>
                    <Text style={styles.submit}>
                        Submit!
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    play: {
        color: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        fontSize: 40
    },
    submit: {
        color: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    movies: {
        paddingTop: 10,
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
