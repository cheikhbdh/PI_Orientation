import React, { useEffect ,useState} from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import "./acceil.css";

const scrollToId = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const Navbar = () => (
  <nav className="navbar">
    <div className="logo-container">
      <img
        src="https://z-p3-scontent.fnkc1-1.fna.fbcdn.net/v/t39.30808-6/272859844_106161358642329_679821423659054157_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHnJ1X4gnaKD_sQUt5pSvICl8jn3QeNjVCXyOfdB42NUHhnDylvLdv6f8c2076jANNDvtGd_1oHm91EDknehYIk&_nc_ohc=lV79L-EJD7oAb5ctBbn&_nc_pt=1&_nc_zt=23&_nc_ht=z-p3-scontent.fnkc1-1.fna&oh=00_AfBJJ2Hh9V3bd2RK5_c3JCXFAcs2iYNP9Z1MutCNrz1TzA&oe=66213A8F"
        alt="PRMT Logo"
        className="logo sc"
      />
      <div className="scc">
        <p className="s1">Orientation</p>
        <p className="s2">
          Plateforme développée par <b>SUPNUM</b>
        </p>
      </div>
    </div>
    <ul className="navbar-nav">
      <li className="nav-item">
        <a
          onClick={() => scrollToId("home")}
          className="nav-link home"
          href="#home"
        >
          <i className="fas fa-house"></i>Accueil
        </a>
      </li>
      

      <li className="nav-item">
        <Link to="/" className="nav-link home">
          <i className="fa-solid fa-right-to-bracket"></i>deconection
        </Link>
      </li>
    </ul>
  </nav>
);






const ImageSection = ({ userEmail, choice, readOnly = false  }) =>{
  const [choices, setChoices] = useState({
    choix1: choice ? choice.choix1 : '',
    choix2: choice ? choice.choix2 : '',
    choix3: choice ? choice.choix3 : '',
  });

 console.log(choices)
  const handleChoice = (event) => {
    if(!readOnly){
    const { name, value } = event.target;
    setChoices(prevChoices => {
      const updatedChoices = { ...prevChoices, [name]: value };
      console.log("Updated Choices:", updatedChoices); // Debugging
      return updatedChoices;
    });
  }
  };

  const isChoiceSelected = (value) => {
    return Object.values(choices).includes(value);
  };
  const matricule = userEmail?.substring(0, 5);
  const submitChoices = async (event) => {
    event.preventDefault();
    
    const dataWithMatricule = {
      matricule,
      ...choices
    };
    console.log(dataWithMatricule)
    const endpoint = 'http://127.0.0.1:8000/choice/';
    try {
      const response = await axios.post(endpoint, dataWithMatricule);
      console.log(response.data);
      // Handle response or redirect as needed
    } catch (error) {
      console.error('Failed to submit choices:', error);
      // Handle error (show error message to user)
    }
  };
 return(
  <>
  <form onSubmit={submitChoices} >
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
     
      <div className="container2">
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
        {!readOnly && <button type="submit" className="submit-btn">Envoyer</button>}
      </div>
      </form>
      </>
);
};
const AlreadyRespondedMessage = () => (
  <div className="already-responded-container">
    <div className="already-responded-header">
      Vous avez déjà répondu
    </div>
    <div className="already-responded-body">
      Vous ne pouvez remplir ce formulaire qu'une seule fois.
      <br />
      Si vous pensez qu'il s'agit d'une erreur, contactez le propriétaire du formulaire.
    </div>
    <button className="already-responded-btn">
      Afficher la note
    </button>
  </div>
);
const ChoixMessage = ({ onShowChoices }) => (
  <div className="container center-content landing-page">
    <div className="already-responded-container">
      <div className="already-responded-header">
        Merci d'avoir rempli le formulaire FORMULE CHOIX DE LA FILIÈRE DE SPÉCIALITÉ
      </div>
      <div className="already-responded-body">
        Voici ce que vous avez choisi: 
      </div>
      <button className="already-responded-btn" onClick={onShowChoices}>
        Afficher la note
      </button>
    </div>
  </div>
);



const LaodingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [choices, setChoices] = useState(null);
  const [showChoices, setShowChoices] = useState(false);
  const [status, setStatus] = useState(null);
  

  const [user, setUser] = useState(null);
  const axiosInstance = axios.create({
		withCredentials: true,
	  });

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      const token=localStorage.getItem('token')
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const userResponse = await axiosInstance.get('http://127.0.0.1:8000/user/',{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        const response = await axios.get(`http://127.0.0.1:8000/check-orientation/${userId}`); // Use user ID in the URL
        setStatus(response.data.statu);
        setChoices(response.data.choix);
      } catch (error) {
        console.error('Failed to fetch orientation status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (showChoices) {
    return (
      <div className="container center-content landing-page">
        <Navbar />
        <ImageSection userEmail={user?.email} choice={choices} readOnly={true} />
      </div>
    );
  }
  if (status === "1") {
    return (
      <div className="container center-content landing-page">
        <Navbar />
        <AlreadyRespondedMessage />
      </div>
    );
  } else if (status === "2") {
    return (
      <div className="container center-content landing-page">
        <Navbar />
        <ChoixMessage 
        onShowChoices={() => setShowChoices(true)} 
        choices={choices}
      />
      </div>
    );
  }

  return (
    <div className="container center-content landing-page">
      <Navbar />
      <ImageSection userEmail={user?.email} />
    </div>
  );
};

export default LaodingPage;