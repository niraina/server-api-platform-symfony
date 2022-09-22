/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */
import React, { useContext, useState } from 'react';
import ReactDOM from "react-dom";

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
import './bootstrap';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import CustomerPage from './pages/CustomerPage';
import CustomerPageWithPagination from './pages/CustomerPageWithPagination';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/authAPI';
import AuthContext from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

AuthAPI.setup();

const App = () => {

    //todo : il faudrait par défaut qu'on demande à notre API si on est connect ou pas
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());
    
    const NavBarWithRouter = withRouter(Navbar);

    // const contextValue = {
    //     isAuthenticated,
    //     setIsAuthenticated
    // }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavBarWithRouter />
                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage}/>
                        <PrivateRoute path="/customers" component={CustomerPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    )


}

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement)