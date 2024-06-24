
import { BrowserRouter as Router, Switch, Route , Redirect} from 'react-router-dom';
import React, { useEffect ,useState} from "react";
import axiosInstance from "../components/axiosinstance/axiosinstance";
import ProtectedRoute from './protectRoute';
import AdminLayout from './layout/AdminLayout';
import AcceuilLayout from './layout/AcceuilLayout';
import LoginLayout from './layout/LoginLayout';
import HomePage from '../pages/Acceil/acceil';
import Login from '../pages/Login/login';
import Signup from '../pages/Signup/signup';
import Dashboard from '../pages/Dashboard';
import Challenges from '../pages/Challenges/Challenges';
import Participer_challenge from '../pages/Particuper_au_challenges/particuper_au_challenge';
import Teams from '../pages/Teams/Teams';
import Detail from '../pages/Teams/detail';
import OrientationPV from '../pages/Teams/orientation_pv';
import Jery from '../pages/Jery/Jery';
import EquipesLayout from './layout/EquipesLayout';
import TravonDevoir from '../pages/Travon_Devoir/devoir';
import ListeMembres from '../pages/ListeMembresEquipe/listemembreEquipe';
import Evaluations from '../pages/Evaluations/evaluations';
import PageNotFound from '../pages/page404/page404';
import PageNotFound1 from '../pages/404/page4041';
import ChoixFiliere from '../pages/choix _filiere/index';
const Routes = () => {
    const [orientationOuverte, setOrientationOuverte] = useState(true);

    useEffect(() => {
        const fetchOrientationStatus = async () => {
            try {
                const response = await axiosInstance.get('check-orientation1/');
                console.log(response.data.orientation_ouverte);
                setOrientationOuverte(response.data.orientation_ouverte);
            } catch (error) {
                console.error('Error checking orientation status:', error);
            }
        };

        fetchOrientationStatus();
    }, []);
    return (
        <Router>
            <Switch>
                <Route path='/' exact>
                    <LoginLayout>
                    <Login />
                    </LoginLayout>
                </Route>
                <Route path='/register' exact>
                    <LoginLayout>
                        <Signup />
                    </LoginLayout>
                </Route>
                
                {orientationOuverte ? (
                    <ProtectedRoute path='/Home' isadmin={false} exact component={HomePage} layout={AcceuilLayout} />
                ) : (
                    <Redirect from='/Home' to='/404' />
                )}
                <ProtectedRoute path='/dashboard' isadmin={false} exact component={Dashboard} layout={AdminLayout} />
                <ProtectedRoute path='/jery' isadmin={false} component={Jery} layout={AdminLayout} />
                <ProtectedRoute path="/details/:id" isadmin={false} component={Detail} layout={AdminLayout}/>

                <ProtectedRoute path='/challenges' isadmin={false} component={Challenges} layout={AdminLayout} />
                <ProtectedRoute path='/equipes' isadmin={false} component={Teams} layout={AdminLayout} />
                <ProtectedRoute path='/evaluation' isadmin={false} component={Evaluations} layout={AdminLayout} />
                <ProtectedRoute path='/persone' isadmin={false} component={ListeMembres} layout={AdminLayout} />
                <ProtectedRoute path='/travon' component={TravonDevoir} layout={AdminLayout} />
                <ProtectedRoute path='/choix_filiere' component={ChoixFiliere} layout={AdminLayout} />
                <ProtectedRoute path="/orientation-pv/:id" component={OrientationPV} layout={LoginLayout}/>
                <Route path='/404' exact>
                    <LoginLayout>
                        <PageNotFound1 />
                    </LoginLayout>
                </Route>
                <Route path='*' exact>
                    <LoginLayout>
                        <PageNotFound />
                    </LoginLayout>
                </Route>

            </Switch>
        </Router>
    );
};

export default Routes;
