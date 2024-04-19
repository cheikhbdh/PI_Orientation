/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import './postcard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import logo from "../assets/images/logo.png";

const PostCard = ({ author, date, content ,fileUrl}) => {
    const [comment, setComment] = useState('');

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const submitComment = () => {
        // Logique pour soumettre le commentaire
        console.log('Comment submitted:', comment);
        // Réinitialiser le commentaire après la soumission
        setComment('');
    };

    return (
        <div className="post-card">
          
            <div className="post-card-header">
      <img
        src={logo}
        alt="Logo"
        className="post-card-profile-pic sc"
         />
      <div className="post-card-author">
        <p className="s1">{author.name}</p>
        <p className="s2">{date}<b>SUPNUM</b>
        </p>
      </div>
    </div>
    <div className="post-card-content">
                <p>{content}</p>
    </div>
    <div className="post-card-footer">
    <input
        type="text"
        className="post-card-comment-input"
        placeholder="Ajouter un commentaire au cours..."
        value={comment}
        onChange={handleCommentChange}
    />
    <button onClick={submitComment} className="post-card-submit-comment">
        <FontAwesomeIcon icon={faArrowRight} />
    </button>
</div>

        </div>
    );
};

export default PostCard;
