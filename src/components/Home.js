
import React, { Component } from "react";
import {TextInput,FlatList,ImageBackground,Button,ScrollView,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity} from 'react-native'
import { List, ListItem, SearchBar } from "react-native-elements";
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import axios from 'axios'
import FastImage from 'react-native-fast-image'

class Home extends Component{
  constructor() {
    super();

    this.state = {
      userId:null,
      gender:null,
      city:null,
      myCategories:null,
      loadmyData:false,
      loading: false,
      data: [],
      request: 0,
      seed:0,
      error: null,
      refreshing: false,
      myStores:[null],
      productSeens:[null],
      lastKeyword:null,
      chooseCategory:'all',
      search:null,
      suggestions:null,
      results:null,
      keyword:null,


    };
    console.disableYellowBox = true;

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
          this.fetchAll()

        }else{
        Actions.info()
        }
    })
  }
  }catch{

  }
  }

  componentDidMount() {
this._retrieveData()
  }


  fetchAll = () => {
    const { refreshing,seed,request,myCategories,userId,lastKeyword,gender,chooseCategory } = this.state;

    if(chooseCategory==='all'){
      const url = 'http://192.168.16.109:8163/showAll/'+request+'/'+userId+'/'+lastKeyword+'/'+gender+'/'+myCategories[16].value+'/'+myCategories[15].value+'/'+myCategories[14].value+'/'+myCategories[13].value+'/'+myCategories[12].value+'/'+myCategories[11].value+'/'+myCategories[10].value+'/'
      +myCategories[9].value+'/'+myCategories[8].value+'/'+myCategories[7].value+'/'+myCategories[6].value+'/'+myCategories[5].value+'/'+myCategories[4].value+'/'+myCategories[3].value+'/'+myCategories[2].value+'/'+myCategories[1].value;
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

        }

      )

        .catch(error => {
          this.setState({ error, loading: false });
        });
    }else{
      let keywords0
      let keywords1
      let keywords2
      let keywords3
      let store0Id
      let store1Id
      let store2Id
      let store3Id
      let store4Id
      let store5Id
      let store6Id
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
      if(chooseCategory.stores&&chooseCategory.stores[0]){
        store0Id=chooseCategory.stores[0].id
      }
      if(chooseCategory.stores&&chooseCategory.stores[1]){
        store1Id=chooseCategory.stores[1].id
      }
      if(chooseCategory.stores&&chooseCategory.stores[2]){
        store2Id=chooseCategory.stores[2].id
      }
      if(chooseCategory.stores&&chooseCategory.stores[3]){
        store3Id=chooseCategory.stores[3].id
      }
      if(chooseCategory.stores&&chooseCategory.stores[4]){
        store4Id=chooseCategory.stores[4].id
      }

      if(chooseCategory.stores&&chooseCategory.stores[5]){
        store5Id=chooseCategory.stores[5].id
      }
      if(chooseCategory.stores&&chooseCategory.stores[6]){
        store6Id=chooseCategory.stores[6].id
      }

      const url='http://192.168.16.109:8163/category/'+request+'/'+chooseCategory.value+'/'+keywords0+'/'+keywords1+'/'+keywords2+'/'+keywords3+'/'+store0Id+'/'+store1Id+'/'+store2Id+'/'+store3Id+'/'+store4Id+'/'+store5Id+'/'+store6Id
      this.setState({ loading: true});
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



  };

  searchData=search=>{
    if(search!==""){

        fetch('http://192.168.16.109:8163/search/'+search)
        .then((response) => response.json())
        .then(( data ) => {
          this.setState({suggestions:data})
        })
        .catch(error => {
          return Promise.reject('تکایە دوبارە بکەوە', error);
        });
      }else{
        this.setState({suggestions:null})
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
        this.fetchAll();
      }
    );

  };

  handleLoadMore = () => {
    this.setState(
      {
        request: this.state.request + 1
            },
      () => {
        this.fetchAll();
      }
    );
  };

  handleLoadMoreSearch = () => {
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
    return  <TextInput
        style={{textAlign:'center'}}
        placeholder="search"
         onChangeText={search=>{
             this.setState({search:search,results:null})
             this.searchData(search)
  }}
         />;
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
    if(category.value==item.mainCategory&&this.state.myCategories[key+1].value!=='all'&&category.value!=='online'){
                var m= this.state.myCategories[key].points+1
                var n= this.state.myCategories[key+1].points-1
                myCategories[key] = {...myCategories[key], points: m};
                myCategories[key+1] = {...myCategories[key+1], points: n};
                this.setState({ myCategories:myCategories});
                firebase.database().ref('/users/'+this.state.userId)
                .update({
                      myCategories:myCategories
                })
    }


  })

Actions.showProduct({product:item,myCategories:myCategories,userId:this.state.userId})
}

selectCategory=category=>{
this.setState({chooseCategory:category,request:0,refreshing:true
},
()=>{
  this.fetchAll()
}
)

}
  render() {

     return (
       <View style={{flex:1}}>
       <View style={{flex:19}}>
       <FlatList
         data={this.state.suggestions}
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
         onEndReached={this.handleLoadMoreSearch}
         onEndReachedThreshold={0.5}
         onViewableItemsChanged={this.onViewableItemsChanged }
         viewabilityConfig={{itemVisiblePercentThreshold: 50}}
       />

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
       <ScrollView
       style={{flex:1,flexDirection: 'row'}}
       ref={ref => this.scrollView = ref}
    onContentSizeChange={(contentWidth, contentHeight)=>{
        this.scrollView.scrollToEnd({animated: true});
    }}


         horizontal={true}>
       {this.state.loadmyData&&this.state.myCategories.map((category)=>{
         return(
          <TouchableOpacity
           onPress={()=>this.selectCategory(category)}
          ><Text style={{padding:10}}>{category.labelKurdish}</Text></TouchableOpacity>
         )
       })}
       </ScrollView>
       </View>
     );
   }
}

export default Home
