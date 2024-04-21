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






const ImageSection = () => (
  <>
  <div className="container2">
        <div className="top-bar"></div>
        <div className="header">
          <b>
            <h2>Formulaire choix de la filière de spécialité</h2>
          </b>
        </div>
        <div className="form-group">
          <div className="message">
            Votre adresse e-mail (22003@supnum.mr) a été enregistrée lorsque
            vous avez envoyé ce formulaire.
          </div>
        </div>
      </div>
      <div className="container2">
        <div className="form-group2">
          <b>
            <label className="matricule-label">Matricule:</label>
          </b>
          <p>22003</p>
          <div className="line"></div>
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
          <div className="rows">
            <div className="cell">Choix 1</div>
            <div className="cell">
              <input
                className="priority-input"
                type="radio"
                name="choice1"
                value="CNM"
              />
            </div>
            <div className="cell">
              <input
                className="priority-input"
                type="radio"
                name="choice1"
                value="DSI"
              />
            </div>
            <div className="cell">
              <input
                className="priority-input"
                type="radio"
                name="choice1"
                value="RSS"
              />
            </div>
          </div>
          <div className="rows">
            <div className="cell">Choix 2</div>
            <div className="cell">
              <input
                className="priority-input"
                type="radio"
                name="choice2"
                value="CNM"
              />
            </div>
            <div className="cell">
              <input
                className="priority-input"
                type="radio"
                name="choice2"
                value="DSI"
              />
            </div>
            <div className="cell">
              <input
                className="priority-input"
                type="radio"
                name="choice2"
                value="RSS"
              />
            </div>
          </div>
          <div className="rows">
            <div className="cell">Choix 3</div>
            <div className="cell">
              <input
                className="priority-input"
                type="radio"
                name="choice3"
                value="CNM"
              />
            </div>
            <div className="cell">
              <input
                className="priority-input"
                type="radio"
                name="choice3"
                value="DSI"
              />
            </div>
            <div className="cell">
              <input
                className="priority-input"
                type="radio"
                name="choice3"
                value="RSS"
              />
            </div>
          </div>
        </div>
        <button type="submit" className="submit-btn">
          Envoyer
        </button>
      </div>
      </>
);
const LaodingPage = () => {
  const [isOriented, setIsOriented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

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
        if(response.data.statu==='orienter'){
          setIsOriented(true)
        }else{
          console.log("ch")
        };
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

  if (isOriented) {
    return (
      <div className="container center-content landing-page">
        <Navbar />
        <div className="centered-message">
          <h1>Vous avez déjà été orienté.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container center-content landing-page">
      <Navbar />
      <ImageSection />
    </div>
  );
};

export default LaodingPage;