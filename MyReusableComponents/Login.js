import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  ScrollView,
  StyleSheet,
} from "react-native";

import Input from "../../components/MyReusableComponents/TextInput";
import { Header } from "../../components/MyReusableComponents/Header";
import Icon from "react-native-vector-icons/FontAwesome5Pro";

// actions import
import {
  changeEmail,
  changePassword,
} from "../../components/ReduxComponents/actions";
import { connect } from "react-redux";
import Card from "../../components/MyReusableComponents/Card";
import Button from "../../components/MyReusableComponents/Button";

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //   alert(this.props.email)
  }

  onChangeEmail = (email) => {
    this.props.changeEmail(email);
  };

  onChangePassword = (password) => {
    this.props.changePassword(password);
  };

  LoginButton = () => {
    this.props.navigation.navigate("Dashboard");
  };

  register = () => {
    this.props.navigation.navigate("SignupIndividual");
  };

  render() {
    return (
      <>
        <StatusBar backgroundColor="#354576" />

        <Header title="Login" />
        <View
          style={{ height: "100%", width: "100%", backgroundColor: "#354576" }}
        >
          <ScrollView>
            <Card>
              <View style={{ marginTop: 20 }}>
                <Input
                  value={this.props.email}
                  onChangeText={this.onChangeEmail.bind(this)}
                  placeholder="Enter Email"
                  iconName="mail"
                  inputLabel="Email or Mobile Number"
                />
              </View>

              <Input
                value={this.props.password}
                onChangeText={this.onChangePassword.bind(this)}
                placeholder="Enter Password"
                iconName="lock-closed-outline"
                inputLabel="Password"
                secureTextEntery={true}
                passwordEyeIcon="eye"
              />

              {/* forgot password button */}
              <View style={styles.forgetPasswordConrtainer}>
                <TouchableOpacity>
                  <Text style={styles.forgetPasswordText}>Forgot Password</Text>
                </TouchableOpacity>
              </View>

              <Button
                buttonTitle="LOGIN"
                onPress={this.LoginButton.bind(this)}
              />

              {/* Don't have an Accout section */}

              <View style={styles.makeAccountContainer}>
                <Text style={styles.textAccountStyle}>
                  Don't have an account ?{" "}
                </Text>
                <TouchableOpacity onPress={() => this.register()}>
                  <Text style={styles.buttonTextStyle}>Register</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <View style={styles.loginWithContainer}>
              <View style={styles.lineLoginWith}></View>
              <View style={styles.loginWith}>
                <Text style={styles.loginWithText}>Or Login with</Text>
              </View>
              <View style={styles.lineLoginWith}></View>
            </View>

            <View style={styles.socialMediaContainer}>
              <TouchableOpacity style={styles.socialMediaIcon}>
                <Icon name="facebook-f" color="#3c65d1" size={25} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.socialMediaIcon,
                  { marginLeft: 20, marginRight: 20 },
                ]}
              >
                {/* <Icon name="google" color="#3c65d1" size={25} style={styles.googleIcon} /> */}
                <Image
                  source={require("../../assets/google_icon.png")}
                  style={{ width: 35, height: 35 }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialMediaIcon}>
                <Icon name="twitter" color="#3c65d1" size={25} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.auth.email,
    password: state.auth.password,
  };
};

const styles = StyleSheet.create({
  forgetPasswordConrtainer: {
    width: "90%",
    margin: "5%",
    marginTop: -5,
    alignItems: "flex-end",
  },
  forgetPasswordText: {
    fontSize: 15,
    color: "#aaaaaa",
    // fontFamily: "Foundation",
  },
  makeAccountContainer: {
    flexDirection: "row",
    width: "90%",
    margin: "5%",
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:"red",
    padding: 5,
  },
  textAccountStyle: {
    color: "#aaaaaa",
    fontSize: 18,
    fontFamily: "Foundation",
  },
  buttonTextStyle: {
    color: "#374576",
    fontSize: 20,
    // fontFamily: "AntDesign",
  },
  loginWithContainer: {
    width: "90%",
    margin: "5%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  lineLoginWith: {
    width: "30%",
    height: 2,
    backgroundColor: "#eff4f8",
  },
  loginWith: {
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginWithText: {
    color: "#fffeff",
    fontSize: 15,
  },
  socialMediaContainer: {
    width: "90%",
    margin: "5%",
    marginBottom: 75,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  socialMediaIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default connect(mapStateToProps, { changeEmail, changePassword })(Login);
