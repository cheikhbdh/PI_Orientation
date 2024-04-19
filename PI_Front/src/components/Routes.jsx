import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
                <Route path='/Home' exact>
                    <LoginLayout>
                        <HomePage />
                    </LoginLayout>
                </Route>
                <Route path='/register' exact>
                    <LoginLayout>
                        <Signup />
                    </LoginLayout>
                </Route>
                <Route path='/travon' exact>
                    <EquipesLayout>
                        <TravonDevoir />
                    </EquipesLayout>
                </Route>
                <Route path='/personne' exact>
                    <EquipesLayout>
                        <ListeMembres />
                    </EquipesLayout>
                </Route>
                <Route path='/team' exact>
                    <EquipesLayout>
                        <Dashboardteam />
                    </EquipesLayout>
                </Route>
                <Route path='/dashboard' exact>
                    <AdminLayout>
                        <Dashboard />
                    </AdminLayout>
                </Route>
                <Route path='/jery'>
                    <AdminLayout>
                        <Jery />
                    </AdminLayout>
                </Route>
                <Route path='/challenges'>
                    <AdminLayout>
                        <Challenges />
                    </AdminLayout>
                </Route>
                <Route path='/equipes'>
                    <AdminLayout>
                        <Teams />
                    </AdminLayout>
                </Route>
                <Route path='/evaluation'>
                    <AdminLayout>
                        <Evaluations />
                    </AdminLayout>
                </Route>
            </Switch>
        </Router>
    );
};

export default Routes;
