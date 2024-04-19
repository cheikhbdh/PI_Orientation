import React, { useState, useEffect } from "react";
import PostCard from "../postcard";
import { fetchChallenges } from "../../services/challenges/challenges";

function TravauxDevoir() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChallenges();
        // Filter to keep only challenges whose deadline has not passed
        const activeChallenges = data.filter(
          (challenge) => new Date(challenge.deadline) > new Date()
        );
        setChallenges(activeChallenges);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchData();
  }, []);

  if (challenges.length === 0) {
    return <div>Oops, no devoirs à faire.</div>;
  }

  return (
    <div>
      {challenges.map((challenge) => (
        <PostCard
          key={challenge._id}
          author={{
            name: challenge.organizer_email, // Using organizer's email as author's name
            profilePic: "", // Add a profile picture if available
          }}
          date={new Date(challenge.deadline).toLocaleDateString()} // Format the date as needed
          content={challenge.description}
          fileUrl={challenge.fileUrl}
        />
      ))}
    </div>
  );
}

export default TravauxDevoir;
