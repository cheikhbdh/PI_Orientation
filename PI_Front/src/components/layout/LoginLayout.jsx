import React from 'react';

const LoginLayout = ({ children }) => {
    return (
        <div className="login-layout">
            <div className="content">
                {children}
            </div>
        </div>
    );
};
export default LoginLayout;