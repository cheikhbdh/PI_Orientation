import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component,layout:Layout, ...rest }) => {
    const token = localStorage.getItem('token');  // Adjust 'token' as per your local storage key

    return (
        <Route {...rest} render={
            props => token ?
                <Layout {...props}><Component  {...props}/></Layout> :
                <Redirect to="/" />
        } />
    );
};

export default ProtectedRoute;
