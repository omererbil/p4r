
import React, { Component } from "react";
import {Picker,Linking,FlatList,ImageBackground,Button,ScrollView,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity} from 'react-native'
import { List, ListItem, SearchBar } from "react-native-elements";
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import axios from 'axios'
import FastImage from 'react-native-fast-image'
import Share from 'react-native-share';


class Home extends Component{
  constructor(props) {
    super(props);

    this.state = {
      userId:this.props.userId,
      gender:this.props.gender,
      myCategories:this.props.myCategories,
      storeId:this.props.storeId,
      storeImage:null,
      categories:[null],
      phone:null,
      loadmyData:false,
      loading: false,
      data: [],
      request: 0,
      seed:0,
      error: null,
      refreshing: false,
      productSeens:[null],
      lastKeyword:null,
      chooseCategory:null,
      note:null

    };
    console.disableYellowBox = true;

  }



  componentDidMount() {
      this.fetchShowStore()
  }



fetchShowStore=()=>{
    fetch('http://192.168.16.109:8163/store/'+this.state.storeId)
    .then((response) => response.json())
    .then(( store ) => {
    this.setState({storeImage:store.profileImage,categories:store.categories,storeName:store.storeName,phone:store.phone,latitude:store.location.latitude,longitude:store.location.longitude,openTime:store.openTime,adminKey:store.adminKey,admines:store.admines,chooseCategory:store.categories[0],note:store.note})
    this.chooseCategory()
    })
    .catch(error => {
      return Promise.reject('تکایە دوبارە بکەوە', error);
    });
 }


chooseCategory=()=>{
  if(this.state.categories.length>1){
    this.state.myCategories.map((myCategory,k)=>{
     this.state.categories.map((category,j)=>{
       if(category.value===myCategory.value){
         this.setState({chooseCategory:category})
       }
     })
    })
  }

  this.fetchData()

}

 fetchData=()=>{
   const { refreshing,seed,request,categories,userId,lastKeyword,gender ,storeId,chooseCategory} = this.state;
         let keywords0
         let keywords1
         let keywords2
         let keywords3
         let keywords4

         if(chooseCategory.keywords&&chooseCategory.keywords[0]){
          keywords0=chooseCategory.keywords[0]
         }
         if(chooseCategory.keywords&&chooseCategory.keywords[1]){
          keywords1=chooseCategory.keywords[1]
         }
         if(chooseCategory.keywords&&chooseCategory.keywords[2]){
          keywords2=chooseCategory.keywords[2]
         }
         if(chooseCategory.keywords&&chooseCategory.keywords[3]){
          keywords3=chooseCategory.keywords[3]
         }
         if(chooseCategory.keywords&&chooseCategory.keywords[4]){
          keywords4=chooseCategory.keywords[4]
         }
         const url='http://192.168.16.109:8163/store/'+storeId+'/'+request+'/'+chooseCategory.value+'/'+keywords0+'/'+keywords1+'/'+keywords2+'/'+keywords3+'/'+keywords4
         this.setState({ loading: true });
         fetch(url)
           .then(res => res.json())
           .then(res => {
             this.setState({
               data: request === 0||refreshing? res : [...this.state.data, ...res],
               error: res.error || null,
               loading: false,
               refreshing: false,
               lastKeyword:null
             });
           })
           .catch(error => {
             this.setState({ error, loading: false });
           });


 }





  showStoreAdmins=storeId=>{
    Actions.showStoreAdmins({storeId:storeId})
  }

  createStore=()=>{
    Actions.createStore()
  }

  onViewableItemsChanged = ({ changed }) => {
  changed.map((product)=>{
    if(product.isViewable){
      var body={
             productId:product.item._id,
             userId:this.state.userId
      }
     this.state.productSeens.push(body)
   }
  })
  }

  handleRefresh = () => {
    this.setState(
      {
        request: this.state.request + 1,
        refreshing:true

      },
      () => {
        this.fetchData();
      }
    );

  };

  handleLoadMore = () => {
    this.setState(
      {
        request: this.state.request + 1
            },
      () => {
        this.fetchData();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  updateCategory=category=>{
    this.setState(
      {
        request:0,
        refreshing:true,
        chooseCategory:category
            },
      () => {
        this.fetchData();
      }
    );
  };

  saveStore=()=>{
    fetch('http://192.168.16.109:8163/storeRankSave/'+this.state.storeId)

    var store={
      storeImage:this.state.storeImage||'null',
      storeId:this.state.storeId,
      storeName:this.state.storeName
    }
    firebase.database().ref(`/users/${this.state.userId}`)
    .once('value',(snapshot)=>{
      if(typeof (snapshot.val().saveStores)==='undefined'){
      var saveStores=[]
      saveStores.push(store)
      firebase.database().ref(`/users/${this.state.userId}`)
      .update({saveStores:saveStores})
      }else{
        var saveStores=snapshot.val().saveStores
        saveStores.push(store)
        firebase.database().ref(`/users/${this.state.userId}`)
        .update({saveStores:saveStores})
      }
    })

  }

  renderHeader = () => {
    let shareOptions = {
         title: this.state.storeName,
         message: "shopping",
         url: "http://192.168.8.100:8163/showStore/"+this.state.storeId,
       };
    return (
      <View>
        <Text>{this.state.storeName}</Text>
        <Button
        title="shwen"
        onPress={()=>Actions.storeLocation({latitude:this.state.latitude,longitude:this.state.longitude,openTime:this.state.openTime})}
        />
        <Button
        title="call"
        onPress={()=>Linking.openURL(`tel:${this.state.phone}`)}
        />

        <Button
        title="save"
        onPress={this.saveStore}
        />
        <Button onPress={()=>{
          fetch('http://192.168.16.109:8163/storeRankSave/'+this.state.storeId)
          Share.open(shareOptions);
        }}
          title="share"
          />
        <View>
        {this.state.categories.length>1&&
        <Picker  selectedValue={this.state.chooseCategory} onValueChange={this.updateCategory}>
        {this.state.categories.map((category,key)=>{
           return(
             <Picker.Item key={key} label={category.labelKurdish} value={category} />
           )
        })}
        </Picker>
      }
        </View>
        <Text>{this.state.note}</Text>
      </View>
    )
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };




productSeens=()=>{
  fetch('http://192.168.8.100:8163/productSeen', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body:JSON.stringify({
  products:this.state.productSeens
  }),
  })
  this.setState({
    productSeens:[null]
  })
}



productDisplay=item=>{
  let myCategories= [ ...this.state.myCategories ];
  this.setState({lastKeyword:item.nameKurdish})
  this.state.myCategories.map((category,key)=>{
    if(category.value==item.mainCategory){
      if(typeof (myCategories[key].keywords)==='undefined'){
        myCategories[key]={...myCategories[key], keywords: [item.nameKurdish]};
        this.setState({ myCategories:myCategories});
        firebase.database().ref('/users/'+this.state.userId)
        .update({
              myCategories:myCategories
        })

    }else{
      myCategories[key].keywords.unshift(item.nameKurdish)
      if(myCategories[key].keywords[5]){
        var index = myCategories[key].keywords.indexOf(myCategories[key].keywords[5]);
        if (index > -1) {
              myCategories[key].keywords.splice(index, 1);
           }
      }
      this.setState({ myCategories:myCategories});
      firebase.database().ref('/users/'+this.state.userId)
      .update({
            myCategories:myCategories
      })
    }

  }
  })

Actions.showProduct({product:item,myCategories:myCategories,userId:this.state.userId})
}



  render() {


     return (
       <View style={{flex:1}}>
       <View style={{flex:19}}>
         <FlatList

           data={this.state.data}
           renderItem={({item}) =>
           <View style={{width: '50%'}}>
           <TouchableOpacity
            onPress={()=>this.productDisplay(item)}
           >
           <FastImage
                   style={{ width:'90%',height: 200}}
                   source={{
                       uri: 'http://192.168.8.100:8163/uploads/'+item.images[0],
                       headers: { Authorization: 'someAuthToken' },
                       priority: FastImage.priority.normal,
                   }}
                   resizeMode={FastImage.resizeMode.contain}
               />
           <Text>{item.price}{item.currency}</Text>
           <Text>{item.nameKurdish}</Text>
           <Text>{item.views}</Text>
           </TouchableOpacity>
           </View>
         }
           numColumns={2}
           keyExtractor={item => item._id}
           ListHeaderComponent={this.renderHeader}
           ListFooterComponent={this.renderFooter}
           onRefresh={this.handleRefresh}
           refreshing={this.state.refreshing}
           onEndReached={this.handleLoadMore}
           onEndReachedThreshold={0.5}
           onViewableItemsChanged={this.onViewableItemsChanged }
           viewabilityConfig={{itemVisiblePercentThreshold: 50}}
         />

       </View>
       </View>
     );
   }
}

export default Home
