import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import StatusCard from '../components/status-card/StatusCard'
import './dashboard.css'

// API endpoints
const API_ENDPOINTS = {
    etudiants: 'http://127.0.0.1:8000/etudiants/',
    orientations: 'http://127.0.0.1:8000/orientations/',
    choixFiliere: 'http://127.0.0.1:8000/choixfiliere/'
}

const Dashboard = () => {
    const [statusData, setStatusData] = useState({
        etudiants: 0,
        orientations: 0,
        choixFiliere: 0,
        utilisateurs: 0 // Assuming you have an endpoint for utilisateurs as well
    });

    const themeReducer = useSelector(state => state.ThemeReducer.mode)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const etudiantsResponse = await axios.get(API_ENDPOINTS.etudiants);
                const orientationsResponse = await axios.get(API_ENDPOINTS.orientations);
                const choixFiliereResponse = await axios.get(API_ENDPOINTS.choixFiliere);

                setStatusData({
                    etudiants: etudiantsResponse.data.length,
                    orientations: orientationsResponse.data.length,
                    choixFiliere: choixFiliereResponse.data.length,
                    utilisateurs: 1 // Replace this with the actual API call if available
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const statusCards = [
        {
            "icon": "bx bx-group",
            "count": statusData.etudiants,
            "title": "les étudiants"
        },
        {
            "icon": "bx bx-calendar-event",
            "count": statusData.orientations,
            "title": "campagne d orientation"
        },
        {
            "icon": "bx bx-select-multiple",
            "count": statusData.choixFiliere,
            "title": "choix filière"
        },
        {
            "icon": "bx bx-envelope-open",
            "count": statusData.utilisateurs,
            "title": "Gride d evluation "
        }
    ];

    return (
        <div>
            <h2 className="bdh">Dashboard</h2>
            <div className="sch">
                <div className="slo">
                    <div className="sch">
                        {
                            statusCards.map((item, index) => (
                                <div className="slo" key={index}>
                                    <StatusCard
                                        icon={item.icon}
                                        count={item.count}
                                        title={item.title}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
