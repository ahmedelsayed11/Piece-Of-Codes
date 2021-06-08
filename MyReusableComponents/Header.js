import * as React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export const Header = ({ title, buttonFunctionLeft, iconButtonLeft }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {iconButtonLeft ? (
          <TouchableOpacity>
            <Icon name={iconButtonLeft} size={30} color="#68d1e4" />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.center}>
        <Text style={styles.titleStyle}>{title}</Text>
      </View>
      <View style={styles.right}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 58,
    width: "100%",
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#354576",
    borderBottomWidth: 0.3,
    borderBottomColor: "#FFF",
  },
  titleStyle: {
    fontSize: 22,
    // fontWeight:"100",
    color: "#68d1e4",
  },
  left: {
    width: "30%",
    height: "100%",
    // alignItems: "center",
    justifyContent: "center",
  },
  center: {
    width: "40%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  right: {
    width: "30%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
