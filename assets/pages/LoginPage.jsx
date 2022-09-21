import React, { useState } from 'react';
import AuthAPI from '../services/authAPI';

const LoginPage = (props) => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState('');

    // gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value});
    }

    // gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("")
        } catch (error) {
            setError("Aucun compte trouver sur cette adresse ou bien l'information n'est pas correct")
        }
    }

    return ( 
        <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="_username">Adresse email</label>
                    <input 
                        value={credentials.username}
                        onChange={handleChange}
                        type="email" 
                        id="username" 
                        name="username" 
                        placeholder='Adresse e-mail' 
                        className={"form-control" + (error && " is-invalid")} 
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="_password">Mots de passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        type="password" 
                        id="password" 
                        className="form-control" 
                        placeholder='Mots de passe' 
                        name="password" />
                </div>
                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-success">Se connecter !</button>
                </div>
            </form>
        </>
     );
}
 
export default LoginPage;