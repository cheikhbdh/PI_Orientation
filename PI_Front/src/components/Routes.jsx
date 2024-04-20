import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProtectedRoute from './protectRoute';
import AdminLayout from './layout/AdminLayout';
import AcceuilLayout from './layout/AcceuilLayout';
import LoginLayout from './layout/LoginLayout';
import HomePage from '../pages/Acceil/acceil';
import Login from '../pages/Login/login';
import Signup from '../pages/Signup/signup';
import Dashboard from '../pages/Dashboard';
import Dashboardteam from '../pages/Dashbordteams'
import Etudiant from '../pages/Jery/Jery';
import Challenges from '../pages/Challenges/Challenges';
import Participer_challenge from '../pages/Particuper_au_challenges/particuper_au_challenge';
import Teams from '../pages/Teams/Teams';
import Jery from '../pages/Jery/Jery';
import EquipesLayout from './layout/EquipesLayout';
import TravonDevoir from '../pages/Travon_Devoir/devoir';
import ListeMembres from '../pages/ListeMembresEquipe/listemembreEquipe';
import Evaluations from '../pages/Evaluations/evaluations';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path='/' exact>
                    <AcceuilLayout>
                    <Login />
                    </AcceuilLayout>
                </Route>
                <Route path='/register' exact>
                    <LoginLayout>
                        <Signup />
                    </LoginLayout>
                </Route>
  
                <ProtectedRoute path='/Home' exact component={HomePage} layout={AcceuilLayout}/>
                <ProtectedRoute path='/dashboard' exact component={Dashboard} layout={AdminLayout} />
                <ProtectedRoute path='/jery' component={Jery} layout={AdminLayout} />
                <ProtectedRoute path='/challenges' component={Challenges} layout={AdminLayout} />
                <ProtectedRoute path='/equipes' component={Teams} layout={AdminLayout} />
                <ProtectedRoute path='/evaluation' component={Evaluations} layout={AdminLayout} />
                <ProtectedRoute path='/persone' component={ListeMembres} layout={AdminLayout} />
                <ProtectedRoute path='/travon' component={TravonDevoir} layout={AdminLayout} />
            </Switch>
        </Router>
    );
};

export default Routes;
