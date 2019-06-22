import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import Test from './components/Test';
import LoginForm from './components/LoginForm';
import Info from './components/Info';
import Home from './components/Home';
import CreateStore from './components/CreateStore';
import EditStore from './components/EditStore';
import ShowStoreAdmins from './components/ShowStoreAdmins';
import ShowStore from './components/ShowStore';
import StoreLocation from './components/StoreLocation';
import AddProduct from './components/AddProduct';
import Discounts from './components/Discounts';
import ShowProduct from './components/ShowProduct';
import Stores from './components/Stores';
import Admines from './components/Admines';


const RouterComponent = () => {
  return (
    <Router>
    <Scene hideNavBar key="root">
    <Scene  key="home" component={Home} title="" />
    <Scene  key="stores" component={Stores} title="" initial/>
    <Scene  key="admines" component={Admines} title="" />
    <Scene  key="showProduct" component={ShowProduct} title="" />
    <Scene  key="login" component={LoginForm} title="" />
    <Scene  key="info" component={Info} title="" />
    <Scene  key="test" component={Test} title="" />
    <Scene  key="createStore" component={CreateStore} title="" />
    <Scene  key="editStore" component={EditStore} title="" />
    <Scene  key="showStoreAdmins" component={ShowStoreAdmins} title="" />
    <Scene  key="showStore" component={ShowStore} title="" />
    <Scene  key="storeLocation" component={StoreLocation} title="" />
    <Scene  key="addProduct" component={AddProduct} title="" />
    <Scene  key="discounts" component={Discounts} title="" />

      </Scene>
    </Router>
  );
};

export default RouterComponent;
