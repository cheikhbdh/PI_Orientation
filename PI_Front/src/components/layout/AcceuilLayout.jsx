import React from 'react';
import TopNavvvv from '../Topnav1/top';

const AcceuilLayout = ({ children }) => {
    return (

        <div className="layout__content1">
        <TopNavvvv />
        <div className="layout__content-main1">
        {children}
        </div>
    </div>

    );
};

export default AcceuilLayout;
