import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './topnav.css';
import { Link } from 'react-router-dom';
import Dropdown from '../dropdown/Dropdown';
import ThemeMenu from '../thememenu/ThemeMenu';
import user_image from '../../assets/images/im11.png';
import user_menu from '../../assets/JsonData/user_menus.json';

const Topnav = () => {
    const [currUser, setCurrUser] = useState({
        display_name: '',
        image: user_image
    });
    const axiosInstance = axios.create({
        withCredentials: true,
    });
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                try {
                    const userResponse = await  axiosInstance.get('http://127.0.0.1:8000/user/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('User data:', userResponse.data); // Debug log to see the response
                    setCurrUser(prevState => ({
                        ...prevState,
                        display_name: userResponse.data.login // Ensure the API response has a "login" field
                    }));
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const renderUserToggle = (user) => (
        <div className="topnav__right-user">
            <div className="topnav__right-user__image">
                <img src={user.image} alt="" />
            </div>
            <div className="topnav__right-user__name">
                {user.display_name}
            </div>
        </div>
    );

    const renderUserMenu = (item, index) => (
        <Link to='/' key={index}>
            <div className="notification-item">
                <i className={item.icon}></i>
                <span>{item.content}</span>
            </div>
        </Link>
    );

    return (
        <div className='topnav'>
            <div className="topnav__search">
                <input type="text" placeholder='Search here...' />
                <i className='bx bx-search'></i>
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    {/* dropdown here */}
                    <Dropdown
                        customToggle={() => renderUserToggle(currUser)}
                        contentData={user_menu}
                        renderItems={(item, index) => renderUserMenu(item, index)}
                    />
                </div>
                <div className="topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>
        </div>
    );
}

export default Topnav;
