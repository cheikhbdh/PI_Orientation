import React from "react";
import img from '../../assets/images/404.jpg'
import './page4041.css'
const PageNotFound1 = () => {
    return (
        <div className="container12345">
            <div className="error-container5">
                <h1><spam className="error-title5">404 Error</spam></h1>
                <h2 className="error-subtitle5">L'orientation que vous avez demandée n'existe pas actuellement. Veuillez réessayer.</h2>
                <div className="error-img5">
                    <img src={img} alt="Error5" />
                </div>
            </div>
        </div>
    );
};
 
export default PageNotFound1;
