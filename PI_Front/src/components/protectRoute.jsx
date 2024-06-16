import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import axiosInstance from './axiosinstance/axiosinstance';
const ProtectedRoute = ({ component: Component,layout:Layout, ...rest }) => {
    const token = localStorage.getItem('token'); 

    return (
        <Route {...rest} render={
            props => token ?
                <Layout {...props}><Component  {...props}/></Layout> :
                <Redirect to="/" />
        } />
    );
};

export default ProtectedRoute;
