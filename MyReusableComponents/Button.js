import * as React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { buttonTitle, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <Text style={styles.buttonTitle}>{buttonTitle}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "90%",
    height: 60,
    borderRadius: 15,
    margin: "5%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#68d1e4",
  },
  buttonTitle: {
    fontSize: 18,
    color: "#FFF",
    fontFamily:"Foundation"

  },
});

export default Button;
