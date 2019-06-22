
import React, { Component } from "react";
import {TextInput,Picker,Linking,FlatList,ImageBackground,Button,ScrollView,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity} from 'react-native'
import { List, ListItem, SearchBar } from "react-native-elements";
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import axios from 'axios'
import FastImage from 'react-native-fast-image'

class Home extends Component{
  constructor(props) {
    super(props);

    this.state = {
      userId:this.props.userId,
      gender:this.props.gender,
      myCategories:this.props.myCategories,
      storeId:this.props.storeId,
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
      adminKey:null,
      admines:[null],
      addNote:false,
      note:null


    };
    this.selectProfileImage = this.selectProfileImage.bind(this);

    console.disableYellowBox = true;

  }



  componentDidMount() {
      this.fetchShowStore()
  }


fetchShowStore=()=>{
    fetch('http://192.168.8.100:8163/store/'+this.state.storeId)
    .then((response) => response.json())
    .then(( store ) => {
    this.setState({profileImage:store.profileImage,categories:store.categories,storeName:store.storeName,phone:store.phone,latitude:store.location.latitude,longitude:store.location.longitude,openTime:store.openTime,adminKey:store.adminKey,admines:store.admines,chooseCategory:store.categories[0],note:store.note})
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
         const url='http://192.168.8.100:8163/store/'+storeId+'/'+request+'/'+chooseCategory.value+'/'+keywords0+'/'+keywords1+'/'+keywords2+'/'+keywords3+'/'+keywords4
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



 selectProfileImage() {
   const options = {
     quality: 1.0,
     maxWidth: 500,
     maxHeight: 500,
     storageOptions: {
     skipBackup: true,
     },
   };

   ImagePicker.showImagePicker(options, (response) => {
     console.log('Response = ', response);

     if (response.didCancel) {
       console.log('User cancelled photo picker');
     } else if (response.error) {
       console.log('ImagePicker Error: ', response.error);
     } else if (response.customButton) {
       console.log('User tapped custom button: ', response.customButton);
     } else {
       let source = { uri: response.uri };
       this.setState({
         profileImage: source,
       });
       const body = new FormData();

        body.append('fileData', {
         uri : response.uri,
         type: response.type,
         name: response.fileName,
        });
     const headers= {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
   }
     return axios
       .post('http://192.168.8.100:8163/uploadProfile/'+this.state.storeId, body, { headers })
       .then(({ data }) => {
       })
       .catch(error => {
         return Promise.reject('تکایە دوبارە بکەوە', error);
       });
     }
   });
 }


 addProduct=()=>{
 Actions.addProduct({storeId:this.state.storeId,categories:this.state.categories})
 }

 addNote=()=>{
 this.setState({addNote:true})
 }

 editStore=()=>{
 Actions.editStore({storeId:this.state.storeId,categories:this.state.categories,storeName:this.state.storeName,phone:this.state.phone,latitude:this.state.latitude,longitude:this.state.longitude,openTime:this.state.openTime})
 }

 createDiscount=()=>{
   Actions.discounts({products:this.state.products})
 }

  showStoreAdmins=storeId=>{
    Actions.showStoreAdmins({storeId:storeId})
  }

  createStore=()=>{
    Actions.createStore()
  }

  submitNote=()=>{
    const body={
      note:this.state.note,
      storeId:this.state.storeId
    }
    const headers = {
      'Content-Type': 'application/json',
    };
    return axios
      .post('http://192.168.8.109:8163/addNote', body, { headers })
      .then(({ data }) => {
      })
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

  renderHeader = () => {
    return (
      <View>
        <Text>{this.state.storeName}</Text>
        <Button
         title='become admin'
         onPress={()=>Actions.admines({userId:this.state.userId,storeId:this.state.storeId,adminKey:this.state.adminKey,storeName:this.state.storeName,admines:this.state.admines})}
        />
        <Button
        onPress={this.addProduct}
          title="کاڵا زیاد بکە +"
        />
        <Button
        onPress={this.editStore}
          title="گۆرانکاری بکە"
        />
        <Button
        onPress={this.createDiscount}
          title="discount"
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
     {this.state.note?
       <Text>{this.state.note}</Text>
     :
     <View>
     <Button
     onPress={this.addNote}
       title="add note"
     />
     {this.state.addNote&&
       <View>
       <TextInput
       style={{textAlign:'center'}}
        placeholder="لێرە بە کورتی بینوسە"
        multiline = {true}
        numberOfLines = {4}
        onChangeText={note=>this.setState({note})}
        />
        <Button
         onPress={this.submitNote}
          title="add note"
        />
        </View>
     }
     </View>
   }

        </View>
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
Actions.showProduct({product:item,myCategories:myCategories,userId:this.state.userId})
}

deleteProduct=item=>{
  const body={
    productId:item._id
  }
  const headers = {
    'Content-Type': 'application/json',
  };
  return axios
    .post('http://192.168.8.100:8163/deleteProduct', body, { headers })
    .then(({ data }) => {
      Actions.showStoreAdmins({storeId:this.state.storeId,userId:this.state.userId,gender:this.state.gender,myCategories:this.state.myCategories})
    })
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
           <Button
           title="delete"
           onPress={()=>this.deleteProduct(item)}
           />
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
