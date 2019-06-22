import React,{Component} from 'react'
import {Picker,ScrollView,TextInput,ImageBackground,Dimensions,PixelRatio,Button,Image,StyleSheet,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,TouchableOpacity} from 'react-native'
import {Actions} from 'react-native-router-flux'
import firebase from 'firebase'
import axios from 'axios';

export default class Admines extends Component {
  constructor(props) {
    super(props);
    this.state={
      userId:this.props.userId,
      currScreen:'addAdmin',
      phone:null,
      name:null,
      myPhone:null,
      user:null,
      loadUser:false,
      storeId:this.props.storeId,
      storeName:this.props.storeName,
      adminKey:this.props.adminKey,
      admines:this.props.admines,
    }
  }





  fetchAdmin=()=>{
    var ref = firebase.database().ref("users");
   ref.orderByChild("myPhone").equalTo(this.state.phone).on("child_added", (snapshot)=> {
    if(snapshot.val()){
      var user=snapshot.val()
      this.setState({user:user,loadUser:true})
    }else{
      alert('user no found')
    }
  })
}

fetchBecomeAdmin=()=>{
  firebase.database().ref('/users/'+this.state.userId)
  .update({myPhone:this.state.myPhone,name:this.state.name,admin:true})

}

fetchMakeAdmin=()=>{
  var ref = firebase.database().ref("users");
 ref.orderByChild("myPhone").equalTo(this.state.phone).once("child_added", (snapshot)=> {
   if(typeof (snapshot.val().myStores)==='undefined'){
     var myStores=[]
     myStores.push({id:this.state.storeId,adminKey:this.state.adminKey,name:this.state.storeName})
     snapshot.ref.update({myStores:myStores})
     const body = {
     storeId:this.state.storeId,
     name:snapshot.val().name,
    myPhone:snapshot.val().myPhone
   };
   const headers = {
     'Content-Type': 'application/json',
   };
   return axios
     .post('http://192.168.16.105:8163/addAdmin', body, { headers })
     .then(({ data }) => {
       alert('success')
     })
     .catch(error => {
       return Promise.reject('تکایە دوبارە بکەوە', error);
     })
   }else{
     var myStores=snapshot.val().myStores
     myStores.push({id:this.state.storeId,adminKey:this.state.adminKey,name:this.state.storeName})
     snapshot.ref.update({myStores:myStores})
     const body = {
     storeId:this.state.storeId,
     name:snapshot.val().name,
    myPhone:snapshot.val().myPhone
   };
   const headers = {
     'Content-Type': 'application/json',
   };
   return axios
     .post('http://192.168.16.105:8163/addAdmin', body, { headers })
     .then(({ data }) => {
       alert('success')
     })
     .catch(error => {
       return Promise.reject('تکایە دوبارە بکەوە', error);
     })
   }


 })

}

removeAdmin=myPhone=>{
  var ref = firebase.database().ref("users");
 ref.orderByChild("myPhone").equalTo(myPhone).once("child_added", (snapshot)=> {
   var myStores=snapshot.val().myStores
     myStores = myStores.filter(store => store.id !=this.state.storeId);
     snapshot.ref.update({myStores:myStores})
 })
 fetch('http://192.168.16.105:8163/showStoreAdmins/'+this.state.storeId)
 .then((response) => response.json())
 .then(( store ) => {
   var admines=store.admines
   admines = admines.filter(admin => admin.myPhone !=myPhone);
   const body = {
     admines:admines,
     storeId:this.state.storeId
 };
 const headers = {
   'Content-Type': 'application/json',
 };
 return axios
   .post('http://192.168.16.105:8163/removeAdmin', body, { headers })
   .then(({ data }) => {
   alert('success')
 })
 })
}


    renderAddAdmin(){
      return(
        <View>
        <Text> بۆ کرنی کەسێک بە ئەدمین دەبێت ئەو کەسە ئەپەکە داونلۆد بکات و بچێتە بەشی بوون بە ئەدمین،لەوێ ژمارە مۆبایلی زیاد بکات </Text>
         <Text>تکایە ژمارە مۆبایلی بنوسە</Text>
         <TextInput
           keyboardType = 'numeric'
           style={{textAlign:'center'}}
           onChangeText={phone=>this.setState({phone})}
            />
          <Button
          title='بگەرێ'
          onPress={this.fetchAdmin}
          />
          {this.state.loadUser&&
            <View>
          <Text>{this.state.user.name}</Text>
          <Text>{this.state.user.myPhone}</Text>
          <Button
            title="بیکە ئەدمین"
            onPress={this.fetchMakeAdmin}
          />
          </View>
        }
        {this.state.admines&&this.state.admines.map((admin,key)=>{
          return(
            <View key={key}>
            <Text>{admin.name}</Text>
            <Text>{admin.myPhone}</Text>
            <Button
             title="remove"
             onPress={()=>this.removeAdmin(admin.myPhone)}
            />
            </View>
          )
        })}
        </View>
      )
    }


  renderBecomeAdmin(){
   return(
     <View>
     <TextInput
     style={{textAlign:'center'}}
      placeholder="ناو"
      onChangeText={name=>this.setState({name})}
      />
      <TextInput
      keyboardType = 'numeric'
      style={{textAlign:'center'}}
       placeholder="ژمارەی مۆبایل"
       onChangeText={myPhone=>this.setState({myPhone})}
       />

       <Button
       title="ناردن"
       onPress={this.fetchBecomeAdmin}
       />

     </View>
   )
  }
  render() {
    switch (this.state.currScreen) {
        case 'addAdmin' :
        return this.renderAddAdmin();
        break;
        case 'becomeAdmin' :
        return this.renderBecomeAdmin();
        break;
      default:

    }


}
}
