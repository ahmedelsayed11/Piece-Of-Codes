import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <View style={styles.cardContainer}>
          <View>{this.props.children}</View>
        </View>
        <View style={styles.bottomCardStyle}></View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "90%",
    margin: "5%",
    marginTop: 50,
    // height: 500,
    backgroundColor: "#ffffff",
    zIndex: 22,
    borderRadius: 10,
  },
  bottomCardStyle: {
    width: "80%",
    margin: "10%",
    marginTop:-50,
    // position: "absolute",
    // bottom: -30,
    zIndex: 1,
    height: 50,
    backgroundColor: "#9aa2b9",
    borderRadius: 15,
  },
});
