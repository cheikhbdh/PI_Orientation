import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Model';
import './Model.css';

const Challenges = () => {
  const [showModal, setShowModal] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [formData, setFormData] = useState({
    challengeName: '',
    description: '',
    deadline: '',
    file: null,
    evaluationGrid: ''
  });

  // Fetch challenges from the API on component mount
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // Replace 'http://your-api-url.com/api/challenges' with your actual API URL
        const response = await axios.get('http://localhost:3000/challenge');
        setChallenges(response.data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nom du Challenge</label>
        <input
          type="text"
          className="form-control"
          name="challengeName"
          value={formData.challengeName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Date Limite</label>
        <input
          type="date"
          className="form-control"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Fichier</label>
        <input
          type="file"
          className="form-control"
          name="file"
          onChange={handleFileChange}
        />
      </div>
      <div className="form-group">
        <label>Grille d'Évaluation</label>
        <input
          type="text"
          className="form-control"
          name="evaluationGrid"
          value={formData.evaluationGrid}
          onChange={handleChange}
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={handleCloseModal}>
          Close
        </button>
        <button type="submit" className="btn btn-success">
          Enregistrer
        </button>
      </div>
    </form>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10">
          <h2>Challenges</h2>
        </div>
        <div className="col-md-2 d-flex justify-content-end">
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Ajouter
          </button>
        </div>
        <Modal show={showModal} onClose={handleCloseModal}>
          {formContent}
        </Modal>
        {challenges.map((challenge) => (
          <div className="col-md-4 mb-3" key={challenge.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{challenge.challengeName}</h5>
                <p className="card-text">{challenge.description}</p>
                <small className="text-muted">Deadline: {challenge.deadline}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;
