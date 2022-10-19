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
    console.log(this.props.currentUser)
  }
  render() {
   
    return (
      <AppContext.Provider value={{stompClient}}>
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
      </AppContext.Provider>

    );
  }
}

const mapStateToProps = ({user}) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(App);


// function App( {currentUser} ) {
//   console.log(currentUser);
//   return (
//     <Routes>
      
//       <Route exact path='/' element={<Navigate replace to='/login' />} />
//       <Route
//         exact
//         path='/login'  
//         element={
//           currentUser ? (
//             <Main />
//           ) : (
//             <Login />
//           )
//         }
//           />
//       {/* <Route exact path='/'
//           element={ currentUser ? (
//             <Navigate replace to='/main' /> ) : (
//               <Navigate replace to='/login' />
//             )
//           } 

//       />
//       { !currentUser && (
//         <Route exact path="/login" element={ <Login /> } />
//       )}

//       { currentUser && (
//         <Route exact path='/main' element={ <Main /> } />
//       )} */}
      
//     </Routes>
    
//   );
// }
