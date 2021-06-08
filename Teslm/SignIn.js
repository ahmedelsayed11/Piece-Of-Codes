import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  AsyncStorage,
  Animated,
  Modal,
  Dimensions,
  BackHandler,
} from 'react-native';
import {Container, Spinner} from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {Hoshi} from 'react-native-textinput-effects';
import * as domainData from '../domain';
const {width, height} = Dimensions.get('window');
var domain = domainData.domain;
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import {ActivityIndicator} from 'react-native';

export default class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailerr: '',
      pass: '',
      passerr: '',
      loading: false,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: '',
      checkout: '',
      model_erorrs: false,
      worning_text: '',
      openitem: -1,
      fbModalLoading: false,
      userToken: '',
    };

    this.backHandler = null;
  }

  async componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonAction,
    );

    let token = await AsyncStorage.getItem('userToken');
    this.setState({
      userToken: token,
    });

    NetInfo.addEventListener(state => {
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });

        // console.log("hi5444")

        Animated.spring(this.state.bottomConnectionMsg, {
          toValue: -100,
        }).start();
      } else {
        this.setState({
          connection_Status: 'Offline',
        });

        // console.log("hi")
        Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
      }
    });
    this.getuserdata();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonAction(),
    );
    // this.backHandler.remove();
  }

  handleBackButtonAction = () => {
    if (!this.props.navigation.isFocused()) {
      return false;
    } else {
      this.props.navigation.navigate('HomePages');
      return true;
    }
  };

  async getuserdata() {
    let checkout = await AsyncStorage.getItem('checkout');
    this.setState({checkout: checkout});
  }
  async successLogin(user_data) {
    await AsyncStorage.setItem('userData', JSON.stringify(user_data));
    await AsyncStorage.setItem('UserStatus', 'Authenticated_user');
    if (this.state.checkout == 'go_CheckOut') {
      this.props.navigation.navigate('CheckOutPage');
    } else {
      this.props.navigation.navigate('HomePages');
    }
  }

  async successLoginKitchen(data) {
    await AsyncStorage.setItem('userData', JSON.stringify(data.user_data));
    await AsyncStorage.setItem(
      'kitchenData',
      JSON.stringify(data.kitchen_data),
    );

    await AsyncStorage.setItem('UserStatus', 'Authenticated_kitchen');
    this.props.navigation.navigate('KitchenStack');
  }

  signin = () => {
    this.setState({loading: true});
    let data_to_send = {
      email: this.state.email,
      password: this.state.pass,
      tocken: '',
    };
    if (this.state.connection_Status == 'Online') {
      axios.post(domain + 'signin.php', data_to_send).then(res => {
        this.setState({loading: false});

        if (res.status == 200) {
          console.log(res.data);
          if (res.data == 'not_authorized') {
            this.setState({
              worning_text: 'عفوا... البريد الالكتروني او كلمة السر غير صحيحة',
              model_erorrs: true,
            });
          } else {
            if (res.data.type) {
              if (res.data.type == 'user') {
                this.successLogin(res.data.user_data);
              } else {
                this.setState({
                  worning_text: 'هدا المستخدم غير موجود',
                  model_erorrs: true,
                });
              }
            }
          }
        } else {
          // Alert.alert('Teslm', 'نأسف ..حدث خطأ ما');
          this.setState({
            worning_text: 'نأسف ..حدث خطأ ما',
            model_erorrs: true,
          });
        }
      });
    } else {
      this.setState({loading: false});
      // Alert.alert('Teslm', 'من فضلك تأكد من  صحة الانترنت لديك');
      this.setState({
        worning_text: 'من فضلك تأكد من  صحة الانترنت لديك',
        model_erorrs: true,
      });
    }
  };
  validate = text => {
    let arr = text.split('@');
    let init_text = arr[0] + '';
    init_text = init_text.replace(/\./g, '');
    text = init_text + '@' + arr[1];
    console.log(text);
    let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      // this.setState({email: text});
      return false;
    } else {
      // this.setState({email: text});
      return true;
    }
  };

  checkbutton() {
    let errors = 0;
    if (this.validate(this.state.email)) {
      this.setState({emailerr: ''});
    } else {
      this.setState({emailerr: 'اكتب الايميل'});
      errors++;
    }

    if (this.state.pass == '' || this.state.pass.length < 6) {
      this.setState({passerr: 'كلمة المرور يجب ان تكون 6 ارقام علي الاقل'});
      errors++;
    } else {
      this.setState({passerr: ''});
    }

    if (errors === 0) {
      this.signin();
    }
  }

  getInfoFromToken = token => {
    console.log('Data ' + token);
  };

  loginWithFacebook = () => {
    var _this = this;
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function(result) {
        console.log(JSON.stringify('Result ' + JSON.stringify(result)));

        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          // console.log('Request ' + JSON.stringify(req));
          AccessToken.getCurrentAccessToken().then(data => {
            const {accessToken} = data;
            _this.initUser(accessToken);
          });
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  initUser = token => {
    fetch(
      'https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' +
        token,
    )
      .then(response => response.json())
      .then(json => {
        // alert('Response ' + JSON.stringify(json));
        this.makeRequestToServer(json);
      })
      .catch(err => {
        console.log('ERROR GETTING DATA FROM FACEBOOK' + err);
      });
  };

  makeRequestToServer = fbData => {
    if (this.state.connection_Status == 'Online') {
      this.setState({
        fbModalLoading: true,
      });
      let data_to_send = {
        email: fbData.email,
        user_token: this.state.userToken,
      };
      axios.post(domain + 'check_facebook_data.php', data_to_send).then(res => {
        this.setState({
          fbModalLoading: false,
        });
        console.log(JSON.stringify(res.data));
        if (res.data.type == 'user_exists') {
          // this.successLogin(res.data.user_data);
          this.successLogin(res.data.user_data);
        } else if (res.data.type == 'user_not_exists') {
          this.props.navigation.navigate('CompleteInformation', {
            fbData: fbData,
          });
        } else {
          this.setState({
            worning_text: 'نأسف ..حدث خطأ ما',
            model_erorrs: true,
          });
        }
      });
    } else {
      // Alert.alert('Teslm', 'نأسف ..حدث خطأ ما');
      this.setState({
        worning_text: 'لا يوجداتصال بالانترنت حاليا',
        model_erorrs: true,
      });
    }
  };

  render() {
    const ViewConnectionMsg = props => {
      return (
        <Animated.View
          style={[
            styles.ConnectionView,
            {bottom: this.state.bottomConnectionMsg},
          ]}>
          <View>
            <Text style={{color: 'white'}}>{props.ConnectionType}</Text>
          </View>
        </Animated.View>
      );
    };
    return (
      <Container style={styles.containerstyle}>
        <StatusBar barStyle="dark-content" backgroundColor={'#F9F9F9'} />
        <ScrollView>
          <View style={{justifyContent: 'center', marginTop: 30}}>
            <Text style={styles.signuptxt}>تسجيل الدخول </Text>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                width: '90%',
                // height: 50,
                borderRadius: 4,
                backgroundColor: '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
                margin: 10,
              }}>
              <Hoshi
                label={'الايميل'}
                borderColor={'#FFFFFF'}
                inputPadding={10}
                backgroundColor={'#FFFFFF'}
                inputStyle={{
                  fontSize: 14,
                  alignSelf: 'center',
                  fontFamily: 'Janna LT Bold',
                  color: '#2D2D2D',
                }}
                labelStyle={{
                  fontSize: this.state.email == '' ? 15 : 12,
                  color: '#9B9B9B',
                  fontFamily: 'Janna LT Bold',
                  display: 'flex',
                }}
                style={{
                  width: '90%',
                  marginLeft: 10,
                  alignSelf: 'center',
                  borderBottomWidth: 0,
                }}
                value={this.state.email}
                onChangeText={value => {
                  this.setState({email: value.trim()});
                }}
              />
            </View>
            <Text
              style={{
                textAlign: 'center',
                color: 'red',
                fontSize: 13,
                fontWeight: '800',
                marginTop: 3,
                marginBottom: 3,
              }}>
              {this.state.emailerr}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                width: '90%',
                // height: 50,
                backgroundColor: '#FFFFFF',
                shadowColor: '#000',
                borderRadius: 4,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
              }}>
              <Hoshi
                label={'كلمه السر '}
                borderColor={'#FFFFFF'}
                inputPadding={10}
                backgroundColor={'#FFFFFF'}
                inputStyle={{
                  fontSize: 14,
                  fontWeight: '500',
                  display: 'flex',
                  alignSelf: 'center',
                  fontFamily: 'Metropolis',
                  color: '#2D2D2D',
                }}
                labelStyle={{
                  fontSize: this.state.pass == '' ? 15 : 12,
                  color: '#9B9B9B',
                  fontFamily: 'Janna LT Bold',
                  display: 'flex',
                }}
                style={{
                  width: '90%',
                  marginLeft: 10,
                  alignSelf: 'center',
                  borderBottomWidth: 0,
                }}
                value={this.state.pass}
                secureTextEntry={true}
                onChangeText={value => {
                  this.setState({pass: value});
                }}
              />
            </View>
            <Text
              style={{
                textAlign: 'center',
                color: 'red',
                fontSize: 13,
                fontWeight: '800',
                marginTop: 3,
                marginBottom: 3,
              }}>
              {this.state.passerr}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('EmailForResetPage');
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginRight: 10,
              marginTop: 10,
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                // fontWeight: '500',
                fontFamily: 'Janna LT Bold',
                marginLeft: 20,
                color: '#222222',
              }}>
              نسيت كلمه السر ؟
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => {
              this.checkbutton();
            }}>
            <View
              style={{
                width: '90%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#2fcc70',
                margin: 10,
                borderRadius: 5,
                alignSelf: 'center',
                borderRadius: 25,
              }}>
              {this.state.loading == false ? (
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    // fontWeight: 'bold',
                    fontFamily: 'Janna LT Bold',
                    // fontStyle: 'normal',
                  }}>
                  تسجيل الدخول
                </Text>
              ) : (
                <Spinner color={'#fff'} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            // disabled={this.state.loading}
            onPress={() => {
              this.props.navigation.navigate('TabsSignupPage');
            }}>
            <View
              style={{
                width: '90%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#FFF',
                margin: 10,
                borderRadius: 5,
                alignSelf: 'center',
                borderRadius: 25,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                  fontFamily: 'Janna LT Bold',
                }}>
                إنشاء حساب
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{width: '90%', margin: '5%', flexDirection: 'row'}}>
            <View
              style={{
                width: '30%',
                height: 8,
                backgroundColor: '#2fcc70',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 12,
              }}
            />
            <View
              style={{
                width: '40%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 18, fontFamily: 'Janna LT Bold'}}>
                او باستخدام
              </Text>
            </View>
            <View
              style={{
                width: '30%',
                height: 8,
                borderRadius: 50,
                backgroundColor: '#2fcc70',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 12,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              this.loginWithFacebook();
            }}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Icon name="facebook" size={40} />
          </TouchableOpacity>
        </ScrollView>
        <ViewConnectionMsg ConnectionType="NoConnection" />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.model_erorrs}
          onRequestClose={() => {
            this.setState({model_erorrs: false});
          }}>
          <View style={{flex: 1}}>
            <View
              style={{
                height: height,
                width: width,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  width: '80%',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  elevation: 5,
                  paddingVertical: 10,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: '#2fcc70',
                    // fontWeight: 'bold',
                    fontFamily: 'Janna LT Bold',
                    fontSize: 22,
                    textAlign: 'center',
                    marginBottom: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ddd',
                  }}>
                  Teslm
                </Text>
                <Text
                  style={{
                    padding: 15,
                    fontSize: 16,
                    marginBottom: 5,

                    fontFamily: 'Janna LT Bold',
                    textAlign: 'center',
                  }}>
                  {this.state.worning_text}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '90%',
                      margin: '5%',
                      alignSelf: 'center',
                      padding: 5,
                      backgroundColor: '#2fcc70',
                      borderRadius: 50,
                      elevation: 3,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      this.setState({model_erorrs: false});
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: 18,
                        fontFamily: 'Janna LT Bold',
                      }}>
                      حسناً
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={this.state.fbModalLoading} animationType="fade">
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator
              color="#2fcc70"
              size={35}
              style={{marginBottom: 15}}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Janna LT Bold',
                color: 'blue',
              }}>
              Authentication with Facebook
            </Text>
          </View>
        </Modal>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  containerstyle: {
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
  signuptxt: {
    fontSize: 30,

    marginLeft: 40,
    marginBottom: 50,
    fontFamily: 'Janna LT Bold',
  },
  icontxt: {
    marginVertical: 15,
    alignItems: 'flex-start',
    paddingLeft: '5%',
  },
  textinstyle: {
    width: '100%',
    height: '100%',
    flex: 1,
    textAlign: 'center',
  },
  ConnectionView: {
    width: '100%',
    height: 20,
    position: 'absolute',
    zIndex: 222,
    backgroundColor: '#492E41',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
