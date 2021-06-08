import firebase from 'firebase';
import {AsyncStorage} from 'react-native';

export const emailChanged = email => ({
  type: 'email_changed',
  payload: email.trim(),
});

export const passwordChanged = password => {
  return {
    type: 'password_changed',
    payload: password,
  };
};

export const loginUser = ({email, password}, navigation) => {
  return dispatch => {
    dispatch({type: 'login_user'});
    firebase
      .auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then(user => {
        dispatch({type: 'LOGIN_USER_SUCCESS', payload: user});
        // Here will save user id to auto authentication next time
        _bootAsyncUserId(user);
        // navigate user to home if success
        navigation.navigate('Home');
      })
      .catch(() => {
        dispatch({
          type: 'login_faild',
        });
      });
    console.log('hi from inside block');
  };
};

async function _bootAsyncUserId(user) {
  await AsyncStorage.setItem('user_id', user.user.uid);
}
