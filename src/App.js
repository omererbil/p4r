import React,{Component} from 'react'
import {View,AppState} from 'react-native'
import firebase from 'firebase'
import Router from './Router'



class App extends Component{


componentWillMount(){
    if (!firebase.apps.length) {


    firebase.initializeApp({
      apiKey: "AIzaSyAZkryVnFnpFBwU7k8gQYrL_ozU0DjtmeE",
      authDomain: "awezashopping.firebaseapp.com",
      databaseURL: "https://awezashopping.firebaseio.com",
      projectId: "awezashopping",
      storageBucket: "awezashopping.appspot.com",
      messagingSenderId: "340466835208",
      appId: "1:340466835208:web:00f21d49eeffb864"
  })

}
}

  render(){
    return(
<Router />
    )
  }
}
export default App
