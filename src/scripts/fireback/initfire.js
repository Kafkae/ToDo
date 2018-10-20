
import firebase from 'firebase';


function initfire() {
  const config = {
    apiKey: 'AIzaSyCWjCoyQoaUUhntJq7U4hoQ8KC2OPiYTHY',
    authDomain: 'todotest-a7dd7.firebaseapp.com',
    databaseURL: 'https://todotest-a7dd7.firebaseio.com',
    projectId: 'todotest-a7dd7',
    storageBucket: 'todotest-a7dd7.appspot.com',
    messagingSenderId: '697874912471',
  };
  firebase.initializeApp(config);
}

export default initfire;
