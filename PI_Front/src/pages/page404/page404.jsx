import React from "react";
import img from '../../assets/images/404.jpg'
import './page404.css'
const PageNotFound = () => {
    return (
        <div className="container1234">
            <div className="error-container">
                <h1><spam className="error-title">404 Error</spam></h1>
                <h2 className="error-subtitle">Page Not Found</h2>
                <div className="error-img">
                    <img src={img} alt="Error" />
                </div>
            </div>
        </div>
    );
};
 
export default PageNotFound;
