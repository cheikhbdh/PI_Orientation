import React, { useEffect ,useState} from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import "./acceil.css";
import SuccessAlert from "../../components/Alert/succesalert";
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosInstance from "../../components/axiosinstance/axiosinstance";
const scrollToId = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};








const ImageSection = ({ userEmail,campagne ,isCampagneOuverte, choice, readOnly = false ,onModifyChoices ,modifyChoices}) =>{
  const [choices, setChoices] = useState({
    choix1: choice ? choice.choix1 : '',
    choix2: choice ? choice.choix2 : '',
    choix3: choice ? choice.choix3 : '',
  });

  const Campagne =campagne? campagne :0;
  console.log("idcampagne:",Campagne);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const matricule = userEmail?.substring(0, 5);
  const submitModifiedChoices = async () => {
    const dataWithMatricule = {
      matricule,
      idc:Campagne,
      ...choices
    };
    const endpoint = `choice/${matricule}/`; // L'URL de l'API pour la modification
    try {
      const response = await axiosInstance.put(endpoint, dataWithMatricule);
      // console.log(response.data);
      setShowSuccessAlert(true); 
    } catch (error) {
      console.error('Failed to submit modified choices:', error);
      // Gérer l'erreur (afficher un message d'erreur à l'utilisateur)
    }
  };
  

 console.log(choices)
  const handleChoice = (event) => {
    if(!readOnly){
    const { name, value } = event.target;
    setChoices(prevChoices => {
      const updatedChoices = { ...prevChoices, [name]: value };
      // console.log("Updated Choices:", updatedChoices); // Debugging
      return updatedChoices;
    });
  }
  };

  const isChoiceSelected = (value) => {
    return Object.values(choices).includes(value);
  };

  const isAllChoicesSelected = () => {
    return Object.values(choices).every(choice => choice !== '');
  };

  const headerStyle = {
    color: 'red'
  };
  const resetChoices = () => {
    setChoices({
      choix1: '',
      choix2: '',
      choix3: '',
    });
  };
  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        window.location.reload(); 
      }, 3000);
  
      return () => clearTimeout(timer); 
    }
  }, [showSuccessAlert]);

  
  const submitChoices = async (event) => {
    event.preventDefault();
    
    const dataWithMatricule = {
      matricule,
      idc:Campagne,
      ...choices
    };
    console.log(dataWithMatricule)
    const endpoint = 'choice/';
    try {
      const response = await axiosInstance.post(endpoint, dataWithMatricule);
      console.log(response.data);
      setShowSuccessAlert(true);
      // Handle response or redirect as needed
    } catch (error) {
      console.error('Failed to submit choices:', error);
      // Handle error (show error message to user)
    }
   
  };
 return(
  <>
  <form onSubmit={submitChoices} >
  {!readOnly &&!showSuccessAlert&&!modifyChoices &&
  <div className="container2">
 
        <div className="top-bar"></div>
        <div className="header">
          <b>
            <h2>Formulaire choix de la filière de spécialité</h2>
          </b>
        </div>
        <div className="form-group">
          <div className="message">
            on prend Votre matricule  {matricule} a l'aide de votre email supnum 
          </div>
        </div>
      </div>
}
      <div className="container2">
      {showSuccessAlert&&!modifyChoices && <SuccessAlert message="Les choix ont été envoyés avec succès !" />}
      {showSuccessAlert &&modifyChoices&& <SuccessAlert message="Les choix ont été modifier avec succès !" />}
        <div className="priority">
          <label>
            <b>Prière faire trois choix par ordre de priorité *</b>
          </label>
          <div className="row">
            <div className="cell"></div>
            <div className="cell">Multimedia (CNM)</div>
            <div className="cell">Developpement (DSI)</div>
            <div className="cell">Réseaux (RSS)</div>
          </div>
          {['choix1', 'choix2', 'choix3'].map(choix => (
                <div className="rows" key={choix}>
                  <div className="cell">{`Choix ${choix[5]}`}</div>
                  {['CNM', 'DSI', 'RSS'].map(filiere => (
                    <div className="cell" key={`${choix}-${filiere}`}>
                      <input
                        className="priority-input"
                        type="radio"
                        name={choix}
                        value={filiere}
                        checked={choices[choix] === filiere}
                        onChange={handleChoice}
                        disabled={(isChoiceSelected(filiere) && choices[choix] !== filiere) || readOnly}
                      />
                    </div>
                  ))}
                </div>
              ))}
        </div>
        {!readOnly &&!showSuccessAlert&&!modifyChoices && <button type="submit" className="submit-btn">Envoyer</button>}
        {modifyChoices && (
  <button type="button" className="submit-btn" onClick={submitModifiedChoices}>
    Soumettre les modifications
  </button>
)}
        {!readOnly &&!showSuccessAlert && isAllChoicesSelected() && (
          <button type="button" className="reset-btn" onClick={resetChoices}>
             <FontAwesomeIcon icon={faSyncAlt} />
          </button>
        )}
      </div>
      </form>
      {readOnly &&isCampagneOuverte&&<div className="contineur2"><div className="header">vous vouler modifier votre choix?{" "} <button className="already-responded-btn" onClick={onModifyChoices}>
        modifier les choix
      </button></div></div>}
      {readOnly &&!isCampagneOuverte&&<div className="contineur2"><div className="header"  style={headerStyle}>vous ne peut pas modifier votre choix a cause de date limite termine ou l'dministrateur fermer cette fonctionaliter{" "} 
  </div></div>}
     
      </>
);
};
const AlreadyRespondedMessage = ({ choices }) => {
  const [showChoices, setShowChoices] = useState(false);

  const toggleShowChoices = () => {
    setShowChoices(!showChoices);
  };

  return (
    <div className="already-responded-container">
      <div className="already-responded-header">
        Vous avez déjà répondu
      </div>
      <div className="already-responded-body">
      
       
    </div>
    </div>
  );
};

const ChoixMessage = ({campagne}) => (
  <div className="container center-content landing-page">

    
    <div className="space-between"></div>
    <div className="title" >
    
      <h1 >Merci d'avoir rempli le formulaire <span className="colored-title">{campagne.titre}</span></h1>
    </div>
    <div className="already-responded-container">
    <div className="space-between"></div>
      <div className="already-responded-body" >
        Voici ce que vous avez choisi: 
      </div>
      <div className="arrow-down"></div>

  </div>
</div>


);



const LaodingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [choices, setChoices] = useState(null);
  const [campagne, setcampagne] = useState(null);
  const [date, setdate] = useState(null);
  const [idc, setidc] = useState(null);
  const [showChoices, setShowChoices] = useState(false);
  const [status, setStatus] = useState(null);
  const [modifyChoices, setModifyChoices] = useState(false);
  const token = localStorage.getItem('token');
console.log(token)
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const userResponse = await axiosInstance.get('user/',{
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'  
        }
        });
        setUser(userResponse.data);
        console.log(userResponse.data)
        // Now fetch orientation status with user ID
        checkOrientation(userResponse.data.id_u);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    // Fetch orientation status
    const checkOrientation = async (userId) => {
      try {
        const response = await axiosInstance.get(`/check-orientation/${userId}`); 
        setStatus(response.data.statu);
        if(response.data.choix){
        setChoices(response.data.choix);

        setcampagne(response.data.campagne);
        setShowChoices(true);
        }
        setcampagne(response.data.campagne);

      } catch (error) {
        console.error('Failed to fetch orientation status:', error);
      } 
    };

    fetchUserDetails();
  }, []);
  
  if (status==="4") {
    return <div className="container center-content landing-page">
      <div className="already-responded-header">L'orientation que vous avez demandée n'existe pas actuellement. Veuillez réessayer.</div></div>;
  }
  if (showChoices) {
    return (
      <div className="container center-content landing-page">
         <div className="date-container"><h4><i>Date limite</i> : <span className="colored-date">{campagne?.date_fin}</span></h4></div>
        <ChoixMessage campagne={campagne} choices={choices} />
        <ImageSection
        onModifyChoices={() => setModifyChoices(true)}
          userEmail={user?.email}
          choice={choices}
          readOnly={!modifyChoices} 
          campagne={campagne.idO}
          isCampagneOuverte={campagne.status === "ouvert"}
          modifyChoices={modifyChoices}
          
        />
      </div>
    );
  }
  if (status === "1") {
    return (
      <div className="container center-content landing-page">
        <AlreadyRespondedMessage />
      </div>
    );
  } 

  return (
    <div className="container center-content landing-page">
      <div className="date-container"><h4><i>Date limite</i> : <span className="colored-date">{campagne?.date_fin}</span></h4></div>
      <ImageSection userEmail={user?.email} campagne={campagne?.idO}/>
    </div>
  );
};

export default LaodingPage;