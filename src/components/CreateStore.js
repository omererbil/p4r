import React,{Component} from 'react'
import {ScrollView,Dimensions,StyleSheet,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,NativeModules,TouchableOpacity,TextInput } from 'react-native'
import  MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import firebase from 'firebase'
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
import CheckBox from 'react-native-check-box'
import {Actions} from 'react-native-router-flux'
import axios from 'axios';

var categories=[]

class CreateStore extends Component{
  constructor(){
  super()
  this.state={
    userId:null,
    currScreen:'name',
    storeName:'',
    phone:'',
    region:{
      latitude: 36.2063,
      longitude: 44.0089,
      latitudeDelta: 0.025,
      longitudeDelta: 0.0221,
    },
    x:{
      latitude: 36.2063,
      longitude: 44.0089,
    },
    mapLoad:false,
    isChecked0:false,
    isChecked1:false,
    isChecked2:false,
    isChecked3:false,
    isChecked4:false,
    isChecked5:false,
    isChecked6:false,
    isChecked7:false,
    isChecked8:false,
    isChecked9:false,
    isChecked10:false,
    isChecked11:false,
    isChecked12:false,
    isChecked13:false,
    isChecked14:false,
    isChecked15:false,
    isChecked16:false,
    openTime:null,
  }
  categories=[]
  console.disableYellowBox = true;

}

componentDidMount= async () => {
      this._isMounted = true;
      try{
          const data=await AsyncStorage.getItem('userData7')
          if(data){
          const userId=JSON.parse(data).id.uid
          this.setState({userId:userId})
        }
      }
        catch {
console.log('There has been a problem with your fetch operation: ' + error.message);
throw error;
}
}

finishName=()=>{
  this.setState({currScreen:'categories'})
}
finishCategories=()=>{
  this.setState({currScreen:'location'})
}


onMapLayout=()=>{
this.setState({mapLoad:true})

}


fetchData=()=>{
  const body = {
  userId:this.state.userId,
  storeName: this.state.storeName,
  phone: this.state.phone,
  location: this.state.x,
  openTime:this.state.openTime,
  categories:categories

};
const headers = {
  'Content-Type': 'application/json',
};
return axios
  .post('http://192.168.16.105:8163/createStore', body, { headers })
  .then(({ data }) => {
    firebase.database().ref('/users/'+this.state.userId)
      .once('value',(snapshot)=>{
        if(typeof (snapshot.val().myStores)==='undefined'){
          var myStores=[]
          myStores.push({id:data._id,adminKey:data.adminKey,name:this.state.storeName})
          firebase.database().ref('/users/'+this.state.userId)
          .update({myStores:myStores})
          Actions.createStore()
        }else{
          var myStores=snapshot.val().myStores
          myStores.push({id:data._id,adminKey:data.adminKey,name:this.state.storeName})
          firebase.database().ref('/users/'+this.state.userId)
          .update({myStores:myStores})
          Actions.createStore()
        }

  })
  })
  .catch(error => {
    return Promise.reject('تکایە دوبارە بکەوە', error);
  })

}
renderName(){
  return(
    <View style={{flex:1}}>
    <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
    <Text >تۆمار کردنی کۆگاکەت</Text>
    </View>

    <View>
    <TextInput
    style={{textAlign:'center'}}
     placeholder="ناوی کۆگا"
     onChangeText={storeName=>this.setState({storeName})}
     />
     <TextInput
     keyboardType = 'numeric'
     style={{textAlign:'center'}}
      placeholder="ژمارەی مۆبایل"
      onChangeText={phone=>this.setState({phone})}
      />
    </View>
    <View style={{marginTop:50,alignItems:'center'}}>
          <TouchableOpacity
           style={styles.btnRefresh}
          onPress={this.finishName}>

          <Text style={styles.textRefresh}>دواتر</Text>
          </TouchableOpacity>
    </View>

    </View>

  )

}



renderCategories(){
  return(
    <View>
    <ScrollView>
    <Text>لە چ بوارێک کاڵا دەفرۆشی</Text>
    <Text>دەتوانی زیاتر لە بوارێک دیاری بکەی</Text>
    <CheckBox
 style={{ padding: 10}}
 onClick={()=>{
   this.setState({
       isChecked0:!this.state.isChecked0,
   })
   if (categories.some(e => e.value === 'womenClothes')) {
     categories = categories.filter(category => category.value != 'womenClothes');
}else{
     categories.push({labelKurdish:'جلوبەرگی ئافرەتان',value:'womenClothes'})
   }
 }}
 isChecked={this.state.isChecked0}
 leftText={'جلوبەرگی ئافرەتان'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked1:!this.state.isChecked1,
})
if (categories.some(e => e.value === 'menClothes')) {
  categories = categories.filter(category => category.value != 'menClothes');
}else{
  categories.push({labelKurdish:'جلوبەرگی پیاوان',value:'menClothes'})
}
}}
isChecked={this.state.isChecked1}
leftText={'جلوبەرگی پیاوان'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked2:!this.state.isChecked2,
})
if (categories.some(e => e.value === 'babies')) {
  categories = categories.filter(category => category.value != 'babies');
}else{
  categories.push({labelKurdish:'منداڵان',value:'babies'})
}
}}
isChecked={this.state.isChecked2}
leftText={'منداڵان'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked3:!this.state.isChecked3,
})
if (categories.some(e => e.value === 'beautyAndHealth')) {
  categories = categories.filter(category => category.value != 'beautyAndHealth');
}else{
  categories.push({labelKurdish:'جوانکاری وتەندروستی',value:'beautyAndHealth'})
}
}}
isChecked={this.state.isChecked3}
leftText={'جوانکاری وتەندروستی'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked4:!this.state.isChecked4,
})
if (categories.some(e => e.value === 'bagsAndShoes')) {
  categories = categories.filter(category => category.value != 'bagsAndShoes');
}else{
  categories.push({labelKurdish:'جانتاو پێڵاو',value:'bagsAndShoes'})
}
}}
isChecked={this.state.isChecked4}
leftText={'جانتاو پێڵاو'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked5:!this.state.isChecked5,
})
if (categories.some(e => e.value === 'watchesAndJewellery')) {
  categories = categories.filter(category => category.value != 'watchesAndJewellery');
}else{
  categories.push({labelKurdish:'کاتژمێرومجوهرات',value:'watchesAndJewellery'})
}
}}
isChecked={this.state.isChecked5}
leftText={'کاتژمێرومجوهرات'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked16:!this.state.isChecked16,
})
if (categories.some(e => e.value === 'mobile')) {
  categories = categories.filter(category => category.value != 'mobile');
}else{
  categories.push({labelKurdish:'مۆبایل',value:'mobile'})
}
}}
isChecked={this.state.isChecked16}
leftText={'مۆبایل'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked6:!this.state.isChecked6,
})
if (categories.some(e => e.value === 'electronics')) {
  categories = categories.filter(category => category.value != 'electronics');
}else{
  categories.push({labelKurdish:'ئەلکتڕۆنیات',value:'electronics'})
}
}}
isChecked={this.state.isChecked6}
leftText={'ئەلکتڕۆنیات'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked7:!this.state.isChecked7,
})
if (categories.some(e => e.value === 'sports')) {
  categories = categories.filter(category => category.value != 'sports');
}else{
  categories.push({labelKurdish:'وەرزشی',value:'sports'})
}
}}
isChecked={this.state.isChecked7}
leftText={'وەرزشی'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked8:!this.state.isChecked8,
})
if (categories.some(e => e.value === 'homeAndGarden')) {
  categories = categories.filter(category => category.value != 'homeAndGarden');
}else{
  categories.push({labelKurdish:'ناوماڵ و باخچە',value:'homeAndGarden'})
}
}}
isChecked={this.state.isChecked8}
leftText={'ناوماڵ و باخچە'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked9:!this.state.isChecked9,
})
if (categories.some(e => e.value === 'comuputerAndOffice')) {
  categories = categories.filter(category => category.value != 'comuputerAndOffice');
}else{
  categories.push({labelKurdish:'کۆمپیوتەروئۆفیس',value:'comuputerAndOffice'})
}
}}
isChecked={this.state.isChecked9}
leftText={'کۆمپیوتەروئۆفیس'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked10:!this.state.isChecked10,
})
if (categories.some(e => e.value === 'books')) {
  categories = categories.filter(category => category.value != 'books');
}else{
  categories.push({labelKurdish:'کتێب',value:'books'})
}
}}
isChecked={this.state.isChecked10}
leftText={'کتێب'}
/>

<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked12:!this.state.isChecked12,
})
if (categories.some(e => e.value === 'homeNeeds')) {
  categories = categories.filter(category => category.value != 'homeNeeds');
}else{
  categories.push({labelKurdish:'پێداویستی خانوو',value:'homeNeeds'})
}
}}
isChecked={this.state.isChecked12}
leftText={'پێداویستی خانوو'}
/>
<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked13:!this.state.isChecked13,
})
if (categories.some(e => e.value === 'automotive')) {
  categories = categories.filter(category => category.value != 'automotive');
}else{
  categories.push({labelKurdish:'ئۆتۆمبێل',value:'automotive'})
}
}}
isChecked={this.state.isChecked13}
leftText={'ئۆتۆمبێل'}
/>

<CheckBox
style={{ padding: 10}}
onClick={()=>{
this.setState({
isChecked14:!this.state.isChecked14,
})
if (categories.some(e => e.value === 'supermarket')) {
  categories = categories.filter(category => category.value != 'supermarket');
}else{
  categories.push({labelKurdish:'سوپەرمارکێت',value:'supermarket'})
}
}}
isChecked={this.state.isChecked14}
leftText={'سوپەرمارکێت'}
/>

<View style={{marginTop:50,alignItems:'center'}}>
   <TouchableOpacity
    style={styles.btnRefresh}
   onPress={this.finishCategories}>

   <Text style={styles.textRefresh}>دواتر</Text>
   </TouchableOpacity>
</View>
</ScrollView>

</View>
  )
}

renderLocation(){
  return(
    <KeyboardAvoidingView  behavior="position" >
    <ScrollView>
    <View>
    <Text>تکایە شوێنی کۆگاکەت دیاری بکە </Text>
    <Text>بۆ ماوەیەک پەنجە لە سەر نیشانە سورەکە دابنێ و رایکێشە</Text>
    </View>
    <View  style={styles.location}>
 <MapView
   provider={PROVIDER_GOOGLE} // remove if not using Google Maps
   style={styles.map}
   region={this.state.region}
   onLayout={this.onMapLayout}
 >
 {this.state.mapLoad &&
   <Marker draggable
   coordinate={this.state.x}
   onDragEnd={(e) =>{
     const region = {
           latitude: e.nativeEvent.coordinate.latitude,
           longitude: e.nativeEvent.coordinate.longitude,
           latitudeDelta: 0.02,
           longitudeDelta: 0.02,
         };
      this.setState({ x: e.nativeEvent.coordinate,region:region })}}
   />
 }

 </MapView>
 </View>
 <View style={{marginTop:10,alignItems:'center'}}>
 <Text>چ کاتێک کۆگاکەت کراوایە </Text>
 <TextInput
 style={{textAlign:'center'}}
  placeholder="لێرە بە کورتی بینوسە"
  multiline = {true}
  numberOfLines = {4}
  onChangeText={openTime=>this.setState({openTime})}
  />

 </View>
 <View style={{marginTop:50,alignItems:'center'}}>
       <TouchableOpacity
        style={styles.btnRefresh}
       onPress={this.fetchData}>

       <Text style={styles.textRefresh}>دواتر</Text>
       </TouchableOpacity>
 </View>

</ScrollView>
</KeyboardAvoidingView>
  )
}

  render(){
switch (this.state.currScreen) {
  case 'name':
  return this.renderName();
  break;
  case 'location':
  return this.renderLocation();
  break;
  case 'categories':
  return this.renderCategories();
  break;

  default:

}

  }
}
const styles={
  location: {
     height: 400,
     width: 400,
     justifyContent: 'flex-end',
     alignItems: 'center',
   },
   map: {
     flex:1,
     height: height,
     width: width
},
btnRefresh:{
   alignSelf:'stretch',
   backgroundColor:'#2b5dad',
   borderRadius:5,
   marginLeft:5,
   marginRight:5,
 },

 textRefresh:{
   alignSelf:'center',
   color:'#ffffff',
   fontSize:22,
   padding:10,
   paddingLeft:20,
   paddingRight:20,
   fontWeight:'bold',
 },
}
export default CreateStore
