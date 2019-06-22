import React,{Component} from 'react'
import {Picker,ScrollView,TextInput,ImageBackground,Dimensions,PixelRatio,Button,Image,StyleSheet,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,TouchableOpacity} from 'react-native'
import {Actions} from 'react-native-router-flux'
import axios from 'axios';

class Discounts extends Component {
  constructor(props){
    super(props)
    this.state={
      products:this.props.products,
      day:null,
      discountPrice:null,
      productId:null,
      edit:null,
    }
  }


  addDiscount=key=>{
    const newProducts = [...this.state.products];
      newProducts[key].discountPrice = this.state.discountPrice;
      this.setState({ products: newProducts,edit:null });
      var day=this.state.day
      var period=Date.now()+day*24*60*60*1000
      const body = {
      discountPeriod:period,
      discountPrice: this.state.discountPrice,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    return axios
      .post('http://192.168.16.105:8163/discountProduct/'+this.state.productId, body, { headers })
      .then(({ data }) => {

    })
    .catch(error => {
    return Promise.reject('تکایە دوبارە بکەوە', error);
    })
}



edit=key=>{
  this.setState({edit:key})
}

render(){
  return(
    <View>
     <View>
      <Text>ماوەی داشکادنەکە دیاری بکە</Text>
      <TextInput
      keyboardType = 'numeric'
      style={{textAlign:'center'}}
      placeholder='ماوە دیاری بکە'
       onChangeText={day=>this.setState({day})}
       />

     </View>
    {this.state.products.map((product,key)=>{
      return(
        <View key={key}>
        <ImageBackground source={{uri:'http://192.168.16.105:8163/uploads/'+product.images[0]}} style={{width: 100, height: 100}} />
        <Text>{product.price}{product.currency}</Text>
        {this.state.edit!==key?
      <View>
      {product.discountPrice!==0?
         <View style={{flexDirection:'row'}}>
         <View style={{width:50}}>
         <Button
         title="Edit"
         onPress={()=>this.edit(key)}
         />
         </View>
         <View style={{width:50}}>
         <Text style={{color:'red'}}>{product.discountPrice}{product.currency}</Text>
         </View>
         </View>
        :
        <View style={{flexDirection:'row'}}>
        <View style={{width:40}}>
        <Button
        onPress={()=>{
          this.setState({productId:product._id})

          setTimeout(() => this.addDiscount(key),20);
        }}
         title="+"
        />
        </View>
          <View style={{width:40}}>
          <TextInput
          keyboardType = 'numeric'
          style={{textAlign:'center'}}
          placeholder='نرخی داشکاندن'
           onChangeText={discountPrice=>this.setState({discountPrice})}
           />
          </View>
          <View style={{width:20}}>
          <Text>{product.currency}</Text>
          </View>
          </View>
        }
        </View>
        :
        <View style={{flexDirection:'row'}}>
        <View style={{width:40}}>
        <Button
        onPress={()=>{
          this.setState({productId:product._id})

          setTimeout(() => this.addDiscount(key),20);
        }}
         title="+"
        />
        </View>
          <View style={{width:40}}>
          <TextInput
          keyboardType = 'numeric'
          style={{textAlign:'center'}}
          placeholder='نرخی داشکاندن'
           onChangeText={discountPrice=>this.setState({discountPrice})}
           />
          </View>
          <View style={{width:20}}>
          <Text>{product.currency}</Text>
          </View>
          </View>
      }
        </View>
      )

    })}
    </View>
  )
}

}

export default Discounts
