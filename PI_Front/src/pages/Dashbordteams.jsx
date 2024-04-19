import React ,  { useState, useEffect }from 'react';

import PostCard from './postcard';
import { fetchChallenges } from '../services/challenges/challenges';
import './Dashbordteam.css'

const ChallengesDashboard = () => {
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchChallenges();
                setChallenges(data);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {/* <Navbar/> */}
            <div className="logoIP"></div>
            {challenges.map((challenge) => (
                <PostCard
                    key={challenge._id}
                    author={{
                        name: challenge.organizer_email, // Utilisez l'organisateur email comme nom d'auteur
                        profilePic: '', // Vous pouvez ajouter une image de profil ici si vous en avez une
                    }}
                    date={new Date(challenge.deadline).toLocaleDateString()} // Formattez la date comme vous le souhaitez
                    content={challenge.description}
                    fileUrl={challenge.fileUrl}
                />
            ))}
        </div>
    );
};

export default ChallengesDashboard;