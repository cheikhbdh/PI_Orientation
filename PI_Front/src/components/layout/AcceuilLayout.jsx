import React from 'react';
import TopNav from '../topnav/TopNav';
import NavbarTop2 from '../Top2Nav/top2Nav';

const AcceuilLayout = ({ children }) => {
    return (

            <div className="content">
                {children}
            </div>

    );
};

export default AcceuilLayout;
