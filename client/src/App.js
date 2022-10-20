import { useState, useEffect } from "react";
import React from 'react';
import './App.css';
import { Routes, Route, Navigate, Switch } from 'react-router-dom';
import Login from './pages/login/login.component';
import Main from './pages/main/main.component';
import { connect } from 'react-redux';
import {AppContext, stompClient} from './context/appContext'


class App extends React.Component {
    
  componentDidMount() {
    console.log('test')
    console.log(this.props.currentUser)
  }
  render() {
   
    return (
      <div>
        <Routes>
          <Route
            exact
            path='/'  
            element={
              this.props.currentUser ? (
                <Main />
              ) : (
                <Login />
              )
            }
              />
        </Routes>
      </div>

    );
  }
}

const mapStateToProps = ({user}) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(App);
