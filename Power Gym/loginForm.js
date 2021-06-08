import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  AsyncStorage
} from 'react-native';
import {TapGestureHandler, State, TextInput} from 'react-native-gesture-handler';
import Animated, {Easing} from 'react-native-reanimated';
import {connect} from 'react-redux';
import * as actions from '../actions';

const {
  Value,
  event,
  block,
  cond,
  eq, 
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning, 
  interpolate, 
  Extrapolate,
  concat
}  = Animated;

const {width, height} = Dimensions.get("window");

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}



class LoginForm extends React.Component {

  static navigationOptions = {
    header:null
  }

  constructor(){
    super();
    this.buttonOpacity = new Value(1);
    
    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            )
          ])
      }
    ]);

    this.stateClosed = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
            )
          ])
      }
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0,1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[-height / 2 , 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.textInputZindex = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[1,-1],
      extrapolate: Extrapolate.CLAMP
    });

    this.textInputY = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[0,100],
      extrapolate: Extrapolate.CLAMP
    });

    this.textInputOpacity = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[1,0],
      extrapolate: Extrapolate.CLAMP
    });

    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange:[0,1],
      outputRange:[180,360],
      extrapolate: Extrapolate.CLAMP
    });
  }
  
  renderErrorMessage() {
    if (this.props.error) {
      return (
        <View 
          style={{
            backgroundColor:"#ddd",
            padding:10,
            width:"90%",
            margin:"5%",
            justifyContent:"center",
            alignItems:"center",
            opacity:0.7,
            borderRadius:35,
          }}
        > 
          <Text
            style={{
              color: 'red',
              textAlign: 'center',
              fontSize: 15,
              marginTop:-10
            }}>
            {this.props.error}
          </Text>
        </View>
      );
    }
  }
  renderButtonContentLogin() {
    return (
      <View style={styles.buttonView}>
        
        {this.props.loading == false ? (
          <Text style={{color:"blue"}}> Sign IN </Text>
        ) : (
          <ActivityIndicator size="large" color="blue" /> 
        )}
      </View> 
    );
  }
  
  render() {

    const {
      emailChanged,
      passwordChanged,
      loginUser,
      email,
      password,
    } = this.props;

    return (
      <View style={{
         flex:1,
         backgroundColor:"white",
         justifyContent:"flex-end"
        }}>
        <Animated.View style={{
          ...StyleSheet.absoluteFill,
          transform:[{translateY:this.bgY}],
        }}>
          <Image
            source={require("../images/bg.jpg")}
            style={{
              flex:1,
              height:null,
              width:null, 
              }}
          />
        </Animated.View>

        {/* Here the text will be on the image */} 
        {/* <View style={{flex:1, justifyContent: 'center', 
           alignItems:"center", height:height, margin:20}}>
          <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>No Pain! No Gain</Text> 
          <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>  
            I will do what you won't today but i will   
          </Text> 
          <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>   
              make what you can't tommorow 
          </Text>  
        </View> */} 
       
        <View style={{height: height / 2, justifyContent: 'center', }}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}> 
             <Animated.View 
                style={{ 
                  ...styles.button,
                   opacity: this.buttonOpacity,
                   transform:[{translateY:this.buttonY}]  
                   
                   }}>  
                  <Text style={{fontSize:20, fontWeight:"bold", color:"blue"}}> 
                    Sign IN
                  </Text>
              </Animated.View>
          </TapGestureHandler>   
          <Animated.View 
                  style={{
                    zIndex:this.textInputZindex,
                    opacity:this.textInputOpacity,
                    transform:[{translateY: this.textInputY}],
                    height: height/2,
                    ...StyleSheet.absoluteFill,
                    top:null,
                    justifyContent: 'center',
                     }}>
                <TapGestureHandler onHandlerStateChange={this.stateClosed}>
                  <Animated.View style={styles.closeButton}> 
                    <Animated.Text style={{fontSize:15,
                       transform:[{rotate: concat(this.rotateCross,"deg")}]}}>
                     X
                    </Animated.Text>
                  </Animated.View>
                </TapGestureHandler>

                {this.renderErrorMessage()}

                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="blue"
                  onChangeText={text => emailChanged(text)}
                  value={this.props.email.trim()}
                />
                <TextInput
                  secureTextEntry
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="blue"
                  onChangeText={password => {
                      passwordChanged(password);
                          }}
                  value={this.props.password}
                />   
                <TouchableOpacity
                  onPress={() => loginUser({email, password}, this.props.navigation)}
                  disabled={this.props.disabled}
                >
                  <Animated.View style={styles.button}>
                    {this.renderButtonContentLogin()}
                  </Animated.View>  
                </TouchableOpacity>           
          </Animated.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  button:{
    backgroundColor:"white",
    height:70,
    marginHorizontal:20,
    borderRadius:35,
    alignItems:"center",
    justifyContent: 'center',
    shadowOffset:{width:2,height:2},
    shadowColor:"black", 
    shadowOpacity:0.2,
    elevation:1
  }, 
  textInput:{
    height:50,
    borderRadius:25, 
    borderWidth:0.5,
    marginHorizontal:20,
    paddingLeft:10,
    marginVertical:5,
    borderColor:"rgba(0,0,0,0.2)"
  },
  closeButton:{
    height:40,
    width:40,
    backgroundColor:"white",
    borderRadius:20,
    alignItems:"center",
    justifyContent: 'center',
    position:"absolute",
    top:-20,
    left:width / 2 - 20, 
    shadowOffset:{width:2,height:2},
    shadowColor:"black", 
    shadowOpacity:0.2, 
    elevation:1
  },
});

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    loading: state.auth.loading,
    disabled: state.auth.disabled,
  };
};

export default connect(
  mapStateToProps,
  actions,
)(LoginForm);
