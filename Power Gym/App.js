import React from 'react';
import {
  StyleSheet,
  StatusBar,
  Image,
  View,
  Text,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './src/reducers';
import {createStackNavigator} from 'react-navigation-stack';
import {
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  DrawerItems,
} from 'react-navigation';
import LoginForm from './src/components/loginForm';
import HomePage from './src/components/HomePage';
import Loading from './src/components/Loading';
import SearchParticipeints from './src/components/SearchParticipients';
import AddParticipent from './src/components/AddMember';
import {Icon, Container, Body, Header} from 'native-base';
import NavigationService from './src/components/NavigationService';
import DailySubscription from './src/components/DailySubscription';
import MemberDetails from './src/components/MemberDetails';
import UpdateMember from './src/components/UpdateMember';


const AuthPages = createStackNavigator(
  {
    Login: LoginForm,
  },
  {
    headerHomePagesMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

// declare content in drawer to show
const CustomDrawerContent = props => (
  <Container>
    <Header style={{height: 200, backgroundColor: 'white'}}>
      <Body style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('./src/images/drawerImage.jpg')}
          style={{width: 150, height: 150, borderRadius: 75}}
        />
      </Body>
    </Header>
    <ScrollView>
      <DrawerItems {...props} style={{width: '100%'}} />
      <TouchableOpacity 
        onPress={() => {
          LogOut();
        }}>
        <View
          style={{
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name="ios-log-out"
            size={25}
            style={{
              color: 'blue',
              marginRight: 15,
            }}
          />
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>Log Out</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  </Container>
);

//class for hide search item in drawer
class Hidden extends React.Component {
  render() {
    return null;
  }
}


const InitialPage = createStackNavigator(
  {
    initial: Loading,
  },
  {
    headerHomePagesMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

// here the stack of the full app
const HomePages = createStackNavigator(
  {
    Home: HomePage,
    AddMember:AddParticipent,
    Search:SearchParticipeints,
    MemberDetails:MemberDetails,
    UpdateMember:UpdateMember
  },
  {
    headerHomePagesMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      App: InitialPage,
      Auth: AuthPages,
      Home:HomePages
    },
    {
      initialRouteName: 'App',
    },
  ),
);

async function LogOut() {
  await AsyncStorage.removeItem('user_id');
  NavigationService.navigate('Auth');
}

class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <StatusBar backgroundColor="black" />
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
