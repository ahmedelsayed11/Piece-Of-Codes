import React from 'react';
import {
  Container,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Right,
  Title,
  Tabs,
  Tab,
  TabHeading,
} from 'native-base';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {
  UpdateData,
  SaveDailyMembers,
  ReturnAllDailyMembers,
} from '../actions/index';
import Spinner from 'react-native-loading-spinner-overlay';
import ListMembers from './ListMembers';

class DailySubscription extends React.Component {
  static navigationOptions = {
    drawerIcon: <Icon name="ios-people" size={25} style={{color: 'blue'}} />,
  };
  constructor() {
    super();
    this.state = {
      fullNamestyle: {},
      ageStyle: {},
      paymentStyle: {},
    };
  }

  onFocusFullName = () => {
    const state = {...this.state};
    state.fullNamestyle = {
      borderColor: 'blue',
      shadowOffset: {width: 2, height: 2},
      shadowColor: 'black',
      backgroundColor: 'white',
      opacity: 0.8,
      elevation: 1,
    };
    this.setState(state);
  };
  onBlurFullName = () => {
    const fullNamestyle = {};
    this.setState({fullNamestyle});
  };

  onFocusAge = () => {
    const state = {...this.state};
    state.ageStyle = {
      borderColor: 'blue',
      shadowOffset: {width: 2, height: 2},
      shadowColor: 'black',
      backgroundColor: 'white',
      opacity: 0.8,
      elevation: 1,
    };
    this.setState(state);
  };
  onBlurAge = () => {
    const ageStyle = {};
    this.setState({ageStyle});
  };

  onFocusPayment = () => {
    const state = {...this.state};
    state.paymentStyle = {
      borderColor: 'blue',
      shadowOffset: {width: 2, height: 2},
      shadowColor: 'black',
      backgroundColor: 'white',
      opacity: 0.8,
      elevation: 1,
    };
    this.setState(state);
  };
  onBlurPayment = () => {
    const paymentStyle = {};
    this.setState({paymentStyle});
  };

  componentDidMount() {
    this.props.ReturnAllDailyMembers();
  }

  saveMember() {
    const {full_name, age, payment_amount} = this.props;

    const MemberData = {
      full_name: this.props.full_name,
      age: this.props.age,
      payment_amount: this.props.payment_amount,
    };

    if (full_name == null || age == null || payment_amount == null) {
      ToastAndroid.showWithGravityAndOffset(
        "Please fill all fields, it's required",
        1000 * 5,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else {
      this.props.SaveDailyMembers(MemberData, this.props.navigation);
    }
    this.props.ReturnAllDailyMembers();
  }

  _renderItem = ({item}) => {
    // alert("hello");
    return <ListMembers item={item} />;
  };

  render() {
    const {
      full_name,
      age,
      payment_amount,
      UpdateData,
      spinnerLoading,
    } = this.props;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Daily Members</Title>
          </Body>
          <Right />
        </Header>

        <Tabs tabBarUnderlineStyle={{backgroundColor: 'blue'}}>
          <Tab
            heading="All Daily Members"
            tabStyle={{backgroundColor: 'white'}}
            textStyle={{color: '#ddd', fontWeight: 'bold', opacity: 0.8}}
            activeTabStyle={{backgroundColor: 'white'}}
            activeTextStyle={{color: 'blue', fontWeight: 'bold'}}>
            {this.props.DailyMembersData == '' ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'blue'}}>No Members added yet</Text>
              </View>
            ) : (
              <FlatList
                data={this.props.DailyMembersData}
                renderItem={this._renderItem}
                keyExtractor={item => item.id.toString()}
              />
            )}
          </Tab>
          <Tab
            heading="Add Daily Member"
            tabStyle={{backgroundColor: 'white'}}
            textStyle={{color: '#ddd', fontWeight: 'bold', opacity: 0.8}}
            activeTabStyle={{backgroundColor: 'white'}}
            activeTextStyle={{color: 'blue', fontWeight: 'bold'}}>
            <ScrollView>
              <Spinner visible={spinnerLoading} />

              {/* for full name  */}
              <View style={{width: '90%', height: 70, margin: '5%'}}>
                <Text
                  style={{
                    marginBottom: 10,
                    opacity: 0.8,
                    fontWeight: 'bold',
                  }}>
                  Full Name
                </Text>
                <TextInput
                  onFocus={() => this.onFocusFullName()}
                  onBlur={() => this.onBlurFullName()}
                  style={[styles.textInputStyle, this.state.fullNamestyle]}
                  value={full_name}
                  onChangeText={full_name =>
                    UpdateData({
                      prop: 'full_name',
                      value: full_name,
                    })
                  }
                />
              </View>
              {/* for age  */}
              <View style={{width: '90%', height: 70, margin: '5%'}}>
                <Text
                  style={{
                    marginBottom: 10,
                    opacity: 0.8,
                    fontWeight: 'bold',
                  }}>
                  Age
                </Text>
                <TextInput
                  onFocus={() => this.onFocusAge()}
                  onBlur={() => this.onBlurAge()}
                  keyboardType="numeric"
                  style={[styles.textInputStyle, this.state.ageStyle]}
                  value={age}
                  onChangeText={age =>
                    UpdateData({
                      prop: 'age',
                      value: age,
                    })
                  }
                />
              </View>

              {/* for Payment Amount  */}
              <View style={{width: '90%', height: 70, margin: '5%'}}>
                <Text
                  style={{
                    marginBottom: 10,
                    opacity: 0.8,
                    fontWeight: 'bold',
                  }}>
                  Payment Amount
                </Text>
                <TextInput
                  onFocus={() => this.onFocusPayment()}
                  onBlur={() => this.onBlurPayment()}
                  style={[styles.textInputStyle, this.state.paymentStyle]}
                  keyboardType="numeric"
                  value={payment_amount}
                  onChangeText={payment_amount =>
                    UpdateData({
                      prop: 'payment_amount',
                      value: payment_amount,
                    })
                  }
                />
              </View>

              <View style={styles.blockButton}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.saveMember();
                  }}>
                  <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  textInputStyle: {
    width: '100%',
    paddingRight: 5,
    paddingLeft: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 40,
  },
  blockButton: {
    width: '90%',
    margin: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 4, height: 4},
    shadowColor: 'black',
    shadowOpacity: 0.8,
    elevation: 1,
  },
  button: {
    width: '100%',
    backgroundColor: 'blue',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
});

const mapStateToProps = state => {
  return {
    full_name: state.dailyMembers.full_name,
    age: state.dailyMembers.age,
    payment_amount: state.dailyMembers.payment_amount,
    spinnerLoading: state.dailyMembers.spinnerLoading,
    DailyMembersData: state.dailyMembers.DailyMembersData,
  };
};

export default connect(
  mapStateToProps,
  {UpdateData, SaveDailyMembers, ReturnAllDailyMembers},
)(DailySubscription);
