import React,{Component} from 'react'
import {Picker,ScrollView,TextInput,ImageBackground,Dimensions,PixelRatio,Button,Image,StyleSheet,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,TouchableOpacity} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {Actions} from 'react-native-router-flux'
const dimensions = Dimensions.get('window');
const imageWidth = dimensions.width;
var  productImages=[]

export default class AddProduct extends Component {

constructor(props) {
  super(props);
  this.state={
    storeId:this.props.storeId,
    productImages:[null],
    NameKurdish:null,
    NameArabic:null,
    NameEnglish:null,
    price:null,
    currency:null,
    gender:null,
    mainCategory:null,
    details:null,
    currency:'$',
    categories:this.props.categories,
    spesifications:null,
    direct:false
  }
  productImages=[]

}


 updateCurrency=(currency)=>{
   this.setState({currency:currency})
 }

 updateCategory=(mainCategory)=>{
   this.setState({mainCategory:mainCategory})
 }


addProductImage() {
  const options = {
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
    skipBackup: true,
    },
  };

  ImagePicker.launchImageLibrary(options, (response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
    } else if (response.error) {
    } else if (response.customButton) {
    } else {
      if(response.type==null){
        alert('try again')
      }else{
      let source = { uri: response.uri };
      productImages.push(response)
      this.setState({productImages:productImages})
      }
      }
  });
}

fetchUploadProducts=()=>{
  const body = new FormData();
   this.state.productImages.map((response)=>{
     var images={
       uri : response.uri,
       type: response.type,
       name: response.fileName,
     }
     body.append('fileUploaded', images);
   })
   body.append('nameKurdish',this.state.nameKurdish)
   body.append('nameArabic',this.state.nameArabic)
   body.append('nameEnglish',this.state.nameEnglish)
   body.append('price',this.state.price)
   body.append('currency',this.state.currency)
   body.append('mainCategory',this.state.mainCategory)
   body.append('spesification',this.state.spesification)
const headers= {
'Accept': 'application/json',
'Content-Type': 'multipart/form-data',
}
return axios
  .post('http://192.168.16.105:8163/uploadProduct/'+this.state.storeId, body, { headers })
  .then(({data}) => {
    Actions.showStoreAdmins({storeId:this.state.storeId})
  })
  .catch(error => {
    return Promise.reject('تکایە دوبارە بکەوە', error);
  });
}




render(){
  return(
    <KeyboardAvoidingView>
    <ScrollView contentContainerStyle={{flexGrow: 1}}
  keyboardShouldPersistTaps='handled'>
    <Text>وێنە زیاد بکە</Text>

    {this.state.productImages.map((imageUri,key)=>{
      return(
        <Image key={key} style={{width:100,height:100}} source={imageUri} />
      )
    })}
    <View style={{width:50}}>
    <Button
    onPress={this.addProductImage.bind(this)}
    title='+'
    />
    </View>
    <View>
     <Text>ناوی کاڵا بە کوردی</Text>
     <TextInput
     style={{textAlign:'center'}}
      onChangeText={nameKurdish=>this.setState({nameKurdish})}
      />
    </View>
    <View>
     <Text>ناوی کاڵا بە عەرەبی</Text>
     <TextInput
     style={{textAlign:'center'}}
      onChangeText={nameArabic=>this.setState({nameArabic})}
      />
    </View>
    <View>
     <Text>ناوی کاڵا بە ئینگلیزی</Text>
     <TextInput
     style={{textAlign:'center'}}
      onChangeText={nameEnglish=>this.setState({nameEnglish})}
      />
      <Text>نرخ</Text>
      <View style={{flexDirection:'row'}}>
      <View style={{width:100}}>
      <TextInput
      keyboardType = 'numeric'
      style={{textAlign:'center'}}
       onChangeText={price=>this.setState({price})}
       />
      </View>
      <View style={{width:100}}>
      <Picker  selectedValue={this.state.currency} onValueChange={this.updateCurrency}>
        <Picker.Item label="$" value="$" />
        <Picker.Item label="IQD" value="IQD" />
      </Picker>
      </View>
      </View>

      {this.props.categories.length>1?
        <View>
        <Text>بەش</Text>
        <View style={{width:300}}>
        <Picker  selectedValue={this.state.mainCategory} onValueChange={this.updateCategory}>
        {this.props.categories.map((category,key)=>{
           return(
             <Picker.Item key={key} label={category.labelKurdish} value={category.value} />
           )
        })}
        </Picker>
        </View>
        </View>
       :
       <Text>not</Text>

      }

      <View style={{marginTop:10,alignItems:'center'}}>
      <Text>تایبەتمەندیەکان</Text>
      <TextInput
      style={{textAlign:'center'}}
       placeholder="لێرە بینوسە"
       multiline = {true}
       numberOfLines = {5}
       onChangeText={spesifications=>this.setState({spesifications})}
       />

      </View>

    </View>
    <Button
    onPress={this.fetchUploadProducts}
    title="upload"
    />
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

}

const styles = {
avatar: {
  height: 100,
  width: imageWidth
},
}
