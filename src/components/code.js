import React,{Component} from 'react'
import {Picker,ScrollView,TextInput,ImageBackground,Dimensions,PixelRatio,Button,Image,StyleSheet,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,TouchableOpacity} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import {Actions} from 'react-native-router-flux'
import axios from 'axios';
const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
const productImages=[]

class ShowStoreAdmins extends Component {

constructor(props) {
  super(props);
  this.state={
    profileImage: null,
    storeId:this.props.storeId,
    storeName:null,
    phone:null,
    categories:null,
    latitude:null,
    longitude:null,
    openTime:null,
    products:null,
    load:false,
    storeName:null,
    adminKey:null,
    admines:[null],


  }

  this.selectProfileImage = this.selectProfileImage.bind(this);
}

componentDidMount(){
  this.fetchShowStore()
  this.fetchProducts()
}

fetchShowStore(){
    fetch('http://192.168.16.105:8163/store/'+this.state.storeId)
    .then((response) => response.json())
    .then(( store ) => {
    this.setState({profileImage:store.profileImage,categories:store.categories,storeName:store.storeName,phone:store.phone,latitude:store.location.latitude,longitude:store.location.longitude,openTime:store.openTime,adminKey:store.adminKey,admines:store.admines})
    })
    .catch(error => {
      return Promise.reject('تکایە دوبارە بکەوە', error);
    });
 }

fetchProducts(){
  fetch('http://192.168.16.105:8163/storeProducts/'+this.state.storeId)
  .then((response) => response.json())
  .then(( products ) => {
    this.setState({products:products,load:true})
  })
  .catch(error => {
    return Promise.reject('تکایە دوبارە بکەوە', error);
  });
}
 updateCurrency=(currency)=>{
   this.setState({currency:currency})
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
      .post('http://192.168.16.105:8163/uploadProfile/'+this.state.storeId, body, { headers })
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
Actions.addNote({storeId:this.state.storeId,categories:this.state.categories})
}

editStore=()=>{
Actions.editStore({storeId:this.state.storeId,categories:this.state.categories,storeName:this.state.storeName,phone:this.state.phone,latitude:this.state.latitude,longitude:this.state.longitude,openTime:this.state.openTime})
}

createDiscount=()=>{
  Actions.discounts({products:this.state.products})
}


render(){
  return (

    <View>
    {this.state.load?


    <ScrollView>
    <View style={{flexDirection:'row',alignSelf:'flex-end',alignItems:'center'}}>
    <Text>Lc wakiki</Text>
    <View >
      <TouchableOpacity onPress={this.selectProfileImage.bind(this)}>
        <View
          style={[
            styles.avatar,
            { marginBottom: 20 },
          ]}
        >
          {this.state.profileImage === null ? (
            <View>
            <Text> وێنەی پرۆفایل زیادبکە +</Text>
            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <Text style={{fontSize:20,fontWeight:'bold'}}>{this.state.storeName}</Text>
            </View>
               </View>

          ) : (
            <ImageBackground source={{uri:'http://192.168.16.105:8163/uploads/'+this.state.profileImage}} style={{width: '100%', height: 100}}>
             <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
               <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>{this.state.storeName}</Text>
             </View>
              </ImageBackground>
          )}
        </View>
      </TouchableOpacity>
    </View>
    </View>
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
    <Button
    onPress={this.addNote}
      title="add note"
    />

    <View>
    {this.state.products.map((product,key)=>{
      return(
        <View key={key}>
        <ImageBackground source={{uri:'http://192.168.16.105:8163/uploads/'+product.images[0]}} style={{width: 100, height: 100}} />
        <Text>{product.price}{product.currency}</Text>
        </View>
      )

    })}

    </View>
    </ScrollView>
    :
    <View>
    </View>
  }
    </View>
  );
}



}

const styles = {
avatar: {
  height: 100,
  width: imageWidth
},
}


export default ShowStoreAdmins



{

  "rules": {
    "users": {
      "$uid": {
        ".read": true,
        ".write": true
      },
      {}
    }
  }
}


import React,{Component} from 'react'
import {FlatList,ImageBackground,Button,ScrollView,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity} from 'react-native'
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import axios from 'axios'

class Home extends Component {
  constructor(){
  super()
  this.state={
    userId:null,
   gender:null,
   city:null,
   categories:null,
   loadmyData:false,
   loadProductsData:false,
   myStores:[null],
   products:[null],
   page:0


  }

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
        categories=snapshot.val().categories
        city=snapshot.val().city
        myStores=snapshot.val().myStores
        categories.sort((a, b) => parseFloat(a.points) - parseFloat(b.points));
        this.setState({userId:userId,city:city,categories:categories,gender:gender,myStores:myStores,loadmyData:true})
        this.fetchAll()
      }else{
      Actions.info()
      }

})
}
}catch{
throw error;

}
}

componentDidMount(){
  this._retrieveData();
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
    const body = {
      productId:product.item._id,
      userId:this.state.userId
}
  const headers = {
    'Content-Type': 'application/json',
  };
  return axios
    .post('https://stores-govan.c9users.io/productSeen/', body, { headers })
    .then(({ data }) => {
  }).catch(error => {
  return Promise.reject('تکایە دوبارە بکەوە', error);
})
 }
})
}

fetchAll=()=>{
  const {page}=this.state
  fetch('https://stores-govan.c9users.io/showAll/'+page+'/'+this.state.userId+'/'+this.state.categories[15].value+'/'+this.state.categories[14].value+'/'+this.state.categories[13].value+'/'+this.state.categories[12].value+'/'+this.state.categories[11].value+'/'+this.state.categories[10].value+'/'+this.state.categories[9].value+'/'
  +this.state.categories[8].value+'/'+this.state.categories[7].value+'/'+this.state.categories[6].value+'/'+this.state.categories[5].value+'/'+this.state.categories[4].value+'/'+this.state.categories[3].value+'/'+this.state.categories[2].value+'/'+this.state.categories[1].value+'/'+this.state.categories[0].value)
  .then((response) => response.json())
  .then(( products ) => {
    this.setState({products:page === 0 ? products : [...this.state.products, ...products],
      loadProductsData:true})

  })
  .catch(error => {
    return Promise.reject('تکایە دوبارە بکەوە', error);
  });
}

handleLoadMore = () => {
    this.setState({page: this.state.page + 1},
      () => {
        this.fetchAll();
      }
    );
  };

render(){
  if(!this.state.loadProductsData){
    return(
      <ActivityIndicator />
    )
  }else{
  return(
    <View style={{flex:1}}>
    <View style={{flex: 1,flexDirection: 'row',flexWrap: 'wrap',alignItems: 'center',alignSelf:'center'}}>
    {this.state.loadProductsData&&<FlatList
     data={this.state.products}
     numColumns={2}
     onViewableItemsChanged={this.onViewableItemsChanged }
     viewabilityConfig={{itemVisiblePercentThreshold: 50}}
     onEndReached={this.handleLoadMore}
      onEndReachedThreshold={0.1}
     renderItem={({item}) =>
     <View style={{width: '50%'}}>
     <ImageBackground source={{uri:'https://stores-govan.c9users.io/uploads/'+item.images[0]}} style={{ width:'90%',height: 200}} />
     <Text>{item.price}{item.currency}</Text>
     <Text>{item.nameKurdish}</Text>
     <Text>{item.views}</Text>
     </View>
   }
/>}

    </View>

    <View >
    <View style={{flexDirection:'row',justifyContent: 'flex-end'}} >
    <TouchableOpacity onPress={this.all}><Text style={{fontSize:16,fontWeight:'bold',padding:4}}>{this.state.categories[14].labelKurdish}</Text></TouchableOpacity>
    <TouchableOpacity  ><Text style={{fontSize:16,fontWeight:'bold',padding:4}}>{this.state.categories[13].labelKurdish}</Text></TouchableOpacity>
    </View>
   </View>
   </View>
)
}
}
}

export default Home


<View style={{flex:1}}>
<FastImage
        style={{ width:'100%',height: 400}}
        source={{
            uri: 'https://stores-govan.c9users.io/uploads/'+this.props.images[0],
            headers: { Authorization: 'someAuthToken' },
            priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
    />
          </View>
