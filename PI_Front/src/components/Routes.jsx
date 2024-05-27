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
import Challenges from '../pages/Challenges/Challenges';
import Participer_challenge from '../pages/Particuper_au_challenges/particuper_au_challenge';
import Teams from '../pages/Teams/Teams';
import Jery from '../pages/Jery/Jery';
import EquipesLayout from './layout/EquipesLayout';
import TravonDevoir from '../pages/Travon_Devoir/devoir';
import ListeMembres from '../pages/ListeMembresEquipe/listemembreEquipe';
import Evaluations from '../pages/Evaluations/evaluations';
import PageNotFound from '../pages/page404/page404';

const Routes = () => {
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
  
                <ProtectedRoute path='/Home' isadmin={false} exact component={HomePage} layout={AcceuilLayout}/>
                <ProtectedRoute path='/dashboard' isadmin={false} exact component={Dashboard} layout={AdminLayout} />
                <ProtectedRoute path='/jery' isadmin={false} component={Jery} layout={AdminLayout} />
                <ProtectedRoute path='/challenges' isadmin={false} component={Challenges} layout={AdminLayout} />
                <ProtectedRoute path='/equipes' isadmin={false} component={Teams} layout={AdminLayout} />
                <ProtectedRoute path='/evaluation' isadmin={false} component={Evaluations} layout={AdminLayout} />
                <ProtectedRoute path='/persone' isadmin={false} component={ListeMembres} layout={AdminLayout} />
                <ProtectedRoute path='/travon' component={TravonDevoir} layout={AdminLayout} />
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
