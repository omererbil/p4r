import React,{Component} from 'react'
import {TextInput,ScrollView,Keyboard,Picker,Image,Dimensions,YellowBox,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,Platform,NativeModules,TouchableOpacity,AppState} from 'react-native'
import firebase from 'firebase'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
var maleCategories=[{labelKurdish:'هەموو',points:100,value:'all'},{labelKurdish:'مۆبایل',points:20,value:'mobile'},{labelKurdish:'ئۆتۆمبێل',points:21,value:'automotive'},{labelKurdish:'ناوماڵ و باخچە',points:12,value:'homeAndGarden'},{labelKurdish:'جلوبەرگی پیاوان',points:19,value:'menClothes'},{labelKurdish:'جلوبەرگی ئافرەتان',points:8,value:'womenClothes'},{labelKurdish:'منداڵان',points:9,value:'babies'},{labelKurdish:'کتێب',points:14,value:'books'},{labelKurdish:'کۆمپیوتەروئۆفیس',points:15,value:'comuputerAndOffice'},{labelKurdish:'ئەلکتڕۆنیات',points:17,value:'electronics'},{labelKurdish:'پێڵاوی پیاوان',points:11,value:'menShoes'},{labelKurdish:'کاتژمێرومجوهرات',points:10,value:'watchesAndJewellery'},{labelKurdish:'وەرزشی',points:18,value:'sports'},{labelKurdish:'جوانکاری وتەندروستی',points:16,value:'beautyAndHealth'},{labelKurdish:'پێداویستی خانوو',points:13,value:'homeNeeds'},{labelKurdish:'ئۆنڵاین',points:6,value:'online'},{labelKurdish:'سوپەرمارکێت',points:5,value:'supermarket'},{labelKurdish:'جانتاو پێڵاوی ئافرەتان',points:7,value:'bagsAndShoesWomen'}]

var femaleCategories=[{labelKurdish:'هەموو',points:100,value:'all'},{labelKurdish:'مۆبایل',points:15,value:'mobile'},{labelKurdish:'ئۆتۆمبێل',points:9,value:'automotive'},{labelKurdish:'ناوماڵ و باخچە',points:17,value:'homeAndGarden'},{labelKurdish:'جلوبەرگی پیاوان',points:8,value:'menClothes'},{labelKurdish:'جلوبەرگی ئافرەتان',points:21,value:'womenClothes'},{labelKurdish:'منداڵان',points:19,value:'babies'},{labelKurdish:'کتێب',points:14,value:'books'},{labelKurdish:'کۆمپیوتەروئۆفیس',points:12,value:'comuputerAndOffice'},{labelKurdish:'ئەلکتڕۆنیات',points:13,value:'electronics'},{labelKurdish:'پێڵاوی پیاوان',points:7,value:'MenShoes'},{labelKurdish:'کاتژمێرومجوهرات',points:16,value:'watchesAndJewellery'},{labelKurdish:'وەرزشی',points:11,value:'sports'},{labelKurdish:'جوانکاری وتەندروستی',points:20,value:'beautyAndHealth'},{labelKurdish:'پێداویستی خانوو',points:10,value:'homeNeeds'},{labelKurdish:'ئۆنڵاین',points:6,value:'online'},{labelKurdish:'سوپەرمارکێت',points:5,value:'supermarket'},{labelKurdish:'جانتاو پێڵاوی ئافرەتان',points:18,value:'bagsAndShoesWomen'}]


Keyboard.dismiss()

class Info extends Component {
constructor(){
  super()
  this.state={
    gender:null,
    genderArray:[{value:'male',labelKurdish:'نێر',categories:maleCategories},{value:'female',labelKurdish:'مێ',categories:femaleCategories}],
    categories:null,
    checked:null
    }
  console.disableYellowBox = true;

}

finish=()=>{
  Keyboard.dismiss()
  if(this.state.gender==null){
    alert('please select a gender')
  }else{
    if(this.state.gender=='male'){
      this.setState({categories:maleCategories})
    }else{
      this.setState({categories:femaleCategories})
    }
const {currentUser}=firebase.auth();
firebase.database().ref(`/users/${currentUser.uid}`)
.set({
    gender:this.state.gender,
    city:'erbil',
    myCategories:this.state.categories,
})
.then(()=>{
Actions.products()
})
.catch((error)=>{
  alert(error)
})
}
}



//render info-------------------------------------------------------------------------------------------
  render(){
    return(
      <KeyboardAvoidingView  behavior="position" >
     <View>
     <View style={{marginTop:100,marginBottom:40}}>
     <Text style={styles.st1}>  ڕەگەز :</Text>
<View style={styles.st2} >
{this.state.genderArray.map((data,key)=>{
return(
  <View style={{right:20}} key={key}>
{this.state.checked==key?
      <TouchableOpacity style={styles.btn}>
      <View style={{flexDirection:'row', flexWrap:'wrap'}} >
      <Text style={styles.options}>{data.labelKurdish}</Text>
      <Image style={styles.img} source={{uri:'https://cdn4.iconfinder.com/data/icons/proglyphs-editor/512/Radio_Button_-_Checked-512.png'}} />
      </View>
      </TouchableOpacity>
      :
      <TouchableOpacity onPress={()=>{
      this.setState({gender:data.value,checked:key,categories:data.categories})}} style={styles.btn}>
      <View style={{flexDirection:'row', flexWrap:'wrap'}} >
      <Text style={styles.options}>{data.labelKurdish}</Text>
      <Image style={styles.img} source={{uri:'https://cdn3.iconfinder.com/data/icons/materia-interface-vol-2/24/008_083_radio_button_unchecked_control-512.png'}} />
      </View>
      </TouchableOpacity>

}
</View>

)

})}
</View>

     <View style={{marginTop:50,alignItems:'center'}}>
           <TouchableOpacity
            style={styles.btnRefresh}
           onPress={this.finish}>

           <Text style={styles.textRefresh}>دواتر</Text>
           </TouchableOpacity>
     </View>
     </View>
     </View>
     </KeyboardAvoidingView>
    )
  }





}


const styles = {
  container:{
    flex:1
  },
  img:{
      width:25,
      height:25,
      marginLeft:10
    },
    btn:{
      flexDirection:'row',
      alignItems:'center',
      marginLeft:30
    },
    profile:{
       width:100,
      height:100,
      marginRight:40
    },
    options:{
      fontSize:18,
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
        st1:{
          right:10,
          fontSize:25,
          color:'#135fd8',
          fontWeight:'bold',
          marginBottom:5
        },
        st2:{
          flexDirection:'row',
           flexWrap:'wrap',
           marginBottom:10,
           right:100,
           position:'absolute'

        }


}
export default Info
