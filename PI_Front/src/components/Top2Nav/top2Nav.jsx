import { Link } from 'react-router-dom';
import React from "react";
import '../../pages/Dashbordteam.css'

const NavbarTop2 = () => (
    <nav className="navbar-container">
        <div className="navbar-top">
            <div className="logo-container">
            <img src='https://z-p3-scontent.fnkc1-1.fna.fbcdn.net/v/t39.30808-6/272859844_106161358642329_679821423659054157_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHnJ1X4gnaKD_sQUt5pSvICl8jn3QeNjVCXyOfdB42NUHhnDylvLdv6f8c2076jANNDvtGd_1oHm91EDknehYIk&_nc_ohc=lV79L-EJD7oAb5ctBbn&_nc_pt=1&_nc_zt=23&_nc_ht=z-p3-scontent.fnkc1-1.fna&oh=00_AfBJJ2Hh9V3bd2RK5_c3JCXFAcs2iYNP9Z1MutCNrz1TzA&oe=66213A8F' alt="PRMT Logo" className="logo sc" />
            <div className="scc">
                <p className='s1'>SC3'2024</p>
                <p className='s2'>Plateforme développée par <b>SUPNUM</b></p>
            </div>
        </div>
        <div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/team" className="nav-link home"><i className="fas fa-house"></i>Accueil</Link>
                </li>
                <li className="nav-item">
                    <Link to="/travon" className="nav-link home"><i className="fas fa-pencil-alt"></i>traveaux et devoirs</Link>
                </li>
                <li className="nav-item">
                    <Link to="/personne" className="nav-link home"><i className="fas fa-trophy"></i>personne</Link>
                </li>
            </ul>
        </div>
        
        </div>
    </nav>
);
export default NavbarTop2