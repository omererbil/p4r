import React,{Component} from 'react'
import {ScrollView,Dimensions,StyleSheet,ActivityIndicator,AsyncStorage,KeyboardAvoidingView,View,Text,NativeModules,TouchableOpacity,TextInput } from 'react-native'
import  MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import firebase from 'firebase'
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
import {Actions} from 'react-native-router-flux'


class StoreLocation extends Component{
  constructor(props){
  super(props)

  this.state={
    region:{
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.0221,
    },
    x:{
      latitude: this.props.latitude,
      longitude: this.props.longitude,
    },
    openTime:this.props.openTime,
    mapLoad:false

  }
}
render(){
  return (
    <View>
    <View  style={styles.location}>

    <MapView
       provider={PROVIDER_GOOGLE}
       style={styles.map}
       region={this.state.region}
       onLayout={this.onMapLayout}
     >

       <Marker
       coordinate={this.state.x}
       />
     </MapView>
</View>
<Text>{this.state.openTime}</Text>
</View>
  )
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
}
}

export default StoreLocation
