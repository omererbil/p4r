import React, { Component } from "react";
import {Linking,FlatList,ImageBackground,Button,ScrollView,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity} from 'react-native'
import { List, ListItem, SearchBar } from "react-native-elements";
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import axios from 'axios'
import FastImage from 'react-native-fast-image'
import Share from 'react-native-share';



class ShowProduct extends Component{
  constructor(props) {
    super(props);
    this.state={
      userId:this.props.userId,
      product:this.props.product,
      myCategories:this.props.myCategories,


    }
  }

componentDidMount(){
  this.fetchProduct()
}
fetchProduct=()=>{
  fetch('http://192.168.16.109:8163/productRank/'+this.state.product._id)
}




save=()=>{
  fetch('http://192.168.16.109:8163/productRankSave/'+this.state.product._id)
  var productSave={
    productImage:this.state.product.images[0],
    productId:this.state.product._id,
    productName:this.state.product.nameKurdish
  }
  firebase.database().ref(`/users/${this.state.userId}`)
  .once('value',(snapshot)=>{
    if(typeof (snapshot.val().saveProducts)==='undefined'){
    var saveProducts=[]
    saveProducts.push(productSave)
    firebase.database().ref(`/users/${this.state.userId}`)
    .update({saveProducts:saveProducts})
    }else{
      var saveProducts=snapshot.val().saveProducts
      saveProducts.push(productSave)
      firebase.database().ref(`/users/${this.state.userId}`)
      .update({saveProducts:saveProducts})
    }
  })
  let myCategories=[]
  const {product}=this.state
    firebase.database().ref('/users/'+this.state.userId)
    .on('value',(snapshot)=>{
      myCategories=snapshot.val().myCategories
    })
  myCategories.map((category,key)=>{
    if(category.value==product.mainCategory){
      if(typeof (myCategories[key].stores)==='undefined'){
        myCategories[key]={...myCategories[key], stores: [product.store]};
        this.setState({ myCategories:myCategories});
        firebase.database().ref('/users/'+this.state.userId)
        .update({
              myCategories:myCategories
        })

    }else{
      if(myCategories[key].stores.some(e => e.id === product.store.id)){
      }else{
          myCategories[key].stores.unshift(product.store)
        }

      this.setState({ myCategories:myCategories});
      firebase.database().ref('/users/'+this.state.userId)
      .update({
            myCategories:myCategories
      })
    }
  }
})


}

  render(){
    const {product}=this.state
    let shareOptions = {
         title: this.state.product.labelKurdish,
         message: "shopping",
         url: "http://192.168.8.100:8163/showProduct/"+this.state.product._id,
       };
    return(
      <View style={{flex:1}}>
      <FastImage
              style={{ width:'100%',height: 400}}
              source={{
                  uri: 'http://192.168.8.100:8163/uploads/'+product.images[0],
                  headers: { Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
          />
          <Text>{product.nameKurdish}</Text>
          <Text>{product.price}</Text>
          <Button
           onPress={this.save}
           title="save"
          />
          <Button
          title="call"
          onPress={()=>Linking.openURL(`tel:${this.state.product.store.phone}`)}
          />
          <Button
          title="shwen"
          onPress={()=>Actions.storeLocation({latitude:this.state.product.store.location.latitude,longitude:this.state.product.store.location.longitude,openTime:this.state.product.store.openTime})}
          />
          <Button onPress={()=>{
            Share.open(shareOptions)
            fetch('http://192.168.16.109:8163/productRankSave/'+this.state.product._id)
          }}
            title="share"
            />
                </View>
    )
  }
}

  export default ShowProduct
