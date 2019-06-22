import React, { Component } from 'react';
import {FlatList,TextInput, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image'
import { List, ListItem, SearchBar } from "react-native-elements";


export default class App extends Component {
 constructor(props) {
    super(props);
    this.state = {
      userId:this.props.userId,
      search:null,
      data:null,
      loadData:false,
      results:null,
      request: 0,
      error: null,
      loading:false,
      productSeens:[],
      keyword:null,
      lastKeyword:null,
      myCategories:this.props.myCategories
    }
  }

componentDidMount(){
}



  searchData=search=>{
    if(search!==""){

        fetch('http://192.168.16.109:8163/search/'+search)
        .then((response) => response.json())
        .then(( data ) => {
          this.setState({data:data,loadData:true})
        })
        .catch(error => {
          return Promise.reject('تکایە دوبارە بکەوە', error);
        });
      }else{
        this.setState({data:null})
      }
  }

  searchResults=item=>{
    fetch('http://192.168.16.109:8163/'+this.state.request+'/searchResults/'+item)
    .then((response) => response.json())
    .then(( data ) => {
      this.setState({
        results: this.state.request === 0? data : [...this.state.results, ...data],
        error: data.error || null,
        loading: false,
        data: [],
      });
    })
    .catch(error => {
      return Promise.reject('تکایە دوبارە بکەوە', error);
    });
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

  handleLoadMore = () => {
    this.setState(
      {
        request: this.state.request + 1
            },
      () => {
        this.searchResults(this.state.keyword);
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

  renderHeader = () => {
    return     <TextInput
        style={{textAlign:'center'}}
        placeholder="search"
         onChangeText={search=>{
             this.setState({search:search,results:null})
             this.searchData(search)
  }}
         />
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
  let myCategories = [ ...this.state.myCategories ];
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


  render(){
    return(
      <View>


       <FlatList

         data={this.state.data}
         renderItem={({item}) =>
         <View style={{width: '50%'}}>
         <TouchableOpacity
          onPress={()=>{
          this.setState({request:0,keyword:item},()=>
        this.searchResults(item))}}
         >
         <Text>{item}</Text>
         </TouchableOpacity>
         </View>
       }
         keyExtractor={item=>item}

       />

       <FlatList

         data={this.state.results}
         renderItem={({item}) =>
         <View style={{width: '50%'}}>
         {item.storeName?
           <TouchableOpacity
            onPress={()=>Actions.showStore(item._id)}
           >
           <FastImage
                   style={{ width:'90%',height: 200}}
                   source={{
                       uri: 'http://192.168.16.109:8163/uploads/'+item.profileImage,
                       headers: { Authorization: 'someAuthToken' },
                       priority: FastImage.priority.normal,
                   }}
                   resizeMode={FastImage.resizeMode.contain}
               />
           <Text>{item.storeName}</Text>
           </TouchableOpacity>
         :
         <TouchableOpacity
          onPress={()=>this.productDisplay(item)}
         >
         <FastImage
                 style={{ width:'90%',height: 200}}
                 source={{
                     uri: 'http://192.168.8.111:8163/uploads/'+item.images[0],
                     headers: { Authorization: 'someAuthToken' },
                     priority: FastImage.priority.normal,
                 }}
                 resizeMode={FastImage.resizeMode.contain}
             />
         <Text>{item.price}{item.currency}</Text>
         <Text>{item.nameKurdish}</Text>
         <Text>{item.views}</Text>
         </TouchableOpacity>
         }
         </View>
       }
         keyExtractor={item => item._id}
         ListHeaderComponent={this.renderHeader}
         ListFooterComponent={this.renderFooter}
         onEndReached={this.handleLoadMore}
         onEndReachedThreshold={0.5}
         onViewableItemsChanged={this.onViewableItemsChanged }
         viewabilityConfig={{itemVisiblePercentThreshold: 50}}
       />



       </View>
    )
  }
}
