//import axios

import axios from 'axios'



//import js cookie

import Cookies from 'js-cookie';

//import react
import React from 'react';

//import react dom
import ReactDOM from 'react-dom';

//import component App
import App from './App';

//import BrowserRouter dari react router
import { BrowserRouter } from 'react-router-dom';

//import CSS Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

//mapbox gl CSS
import 'mapbox-gl/dist/mapbox-gl.css';

//mapbox gl directions CSS
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'

//mapbox gl geocoder CSS
import 'mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

//import custom CSS
import './assets/css/styles.css';


const Api = axios.create({

    

    //set endpoint API

    baseURL: process.env.REACT_APP_BASEURL,



    //set header axios

    headers: {

        "Accept": "application/json",

        "Content-Type": "application/json",

    }

});



//handle unathenticated

Api.interceptors.response.use(function (response) {



    //return response

    return response;

}, ((error) => {



    //check if response unauthenticated

    if (401 === error.response.status) {



        //remove token

        Cookies.remove('token');



        //redirect "/admin/login"

        window.location = '/admin/login';

    } else {



        //reject promise error

        return Promise.reject(error);

    }

}));

export default Api



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);