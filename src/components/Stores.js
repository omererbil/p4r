import React, { Component } from "react";
import {FlatList,ImageBackground,Button,ScrollView,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity} from 'react-native'
import { List, ListItem, SearchBar } from "react-native-elements";
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import axios from 'axios'
import FastImage from 'react-native-fast-image'

class Stores extends Component{
  constructor() {
    super();
    this.state={
    userId:null,
    myStores:[null],
    gender:null,
    myCategories:[null],
    stores:[],
    loadStores:false

  }
}
  _retrieveData=async () => {
  try{
      const data=await AsyncStorage.getItem('userData7')
      if(data){
      const userId=JSON.parse(data).id.uid
       logoutCheck=JSON.parse(data).login
      firebase.database().ref(`/users/${userId}`)
      .on('value',(snapshot)=>{
        if(snapshot.val()){
        gender=snapshot.val().gender
        myCategories=snapshot.val().myCategories
        city=snapshot.val().city
        myStores=snapshot.val().myStores
        myCategories.sort((a, b) => parseFloat(a.points) - parseFloat(b.points));
        this.setState({userId:userId,city:city,myCategories:myCategories,gender:gender,myStores:myStores,loadmyData:true})
              this.fetchData()
      }else{
      Actions.info()
      }
  })
}
}catch{

}
}


componentDidMount() {
  this._retrieveData();

}

fetchData=()=>{
  fetch('http://192.168.16.109:8163/stores')
    .then(res => res.json())
    .then(res => {
      this.setState({
        stores: res,
        loadStores:true
      });
})
}

render(){
  return(
    <View>
    {this.state.loadStores&&this.state.stores.map((store)=>{
      return(
        <View>
        <TouchableOpacity
        onPress={()=>Actions.showStore({storeId:store._id,userId:this.state.userId,gender:this.state.gender,myCategories:this.state.myCategories})}
        ><Text>{store.storeName}</Text></TouchableOpacity>
        </View>
      )
    })
  }
  <Button
   title="create store"
   onPress={()=>Actions.createStore({userId:this.state.userId})}
  />

  </View>
  )
}
}

export default Stores
