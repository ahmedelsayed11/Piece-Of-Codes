import * as React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eyeIcon: "eye-off",
      secureTextEntery: true,
    };
  }

  changeEyeIcon = () => {
    if (this.state.eyeIcon == "eye-off")
      this.setState({
        eyeIcon: "eye",
        secureTextEntery: false,
      });
    else
      this.setState({
        eyeIcon: "eye-off",
        secureTextEntery: true,
      });
  };

  render() {
    const {
      plainValue,
      onChangeText,
      placeholder,
      iconName,
      passwordEyeIcon,
      secureTextEntery,
      inputLabel,
    } = this.props;

    return (
      <>
        <View style={styles.textInputLabelContainer}>
          <Text style={styles.textInputLabel}>{inputLabel}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={25} color="#67d2e2" />
          </View>

          <View
            style={[
              styles.textInputContainer,
              { width: secureTextEntery ? "60%" : "80%" },
            ]}
          >
            {secureTextEntery ? (
              <TextInput
                style={styles.textInput}
                value={plainValue}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={this.state.secureTextEntery}
              />
            ) : (
              <TextInput
                style={styles.textInput}
                value={plainValue}
                onChangeText={onChangeText}
                placeholder={placeholder}
              />
            )}
          </View>
          <View style={styles.passwordEyeStyle}>
            {passwordEyeIcon ? (
              <TouchableOpacity
                onPress={() => {
                  this.changeEyeIcon();
                }}
              >
                <Icon name={this.state.eyeIcon} size={25} color="#aaaaaa" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "90%",
    margin: "5%",
    borderWidth: 1.5,
    borderColor: "#e6e9ee",
    borderRadius: 15,
    padding: 5,
    // overflow:"hidden"
  },
  textInputLabelContainer: {
    width: "90%",
    margin: "5%",
    marginBottom: -10,
  },
  textInputLabel: {
    fontSize: 16,
    // fontWeight: "100",
    fontFamily: "Foundation",
  },

  iconContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContainer: {
    width: "60%",
    justifyContent: "center",
  },
  textInput: {
    fontSize: 15,
    color: "#a9a9a9",
    fontFamily:"Foundation"
  },
  passwordEyeStyle: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
});
