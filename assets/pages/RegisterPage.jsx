import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    }

    const handleSubmit = async event => {
        event.preventDefault();
        const apiErrors = {};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Votre confirmation mots de passe n'est pas conforme avec le mot de passe originale"
            setErrors(apiErrors)
            return;
        }

        try {
            const response  = await axios.post("http://localhost:8000/api/users", user)
            console.log(response);
            setErrors({});
            //todo : flash seccess
            history.replace('/login');
        } catch (error) {
            console.log(error.response);
            const {violations} = error.response.data;

            if(violations){
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                });
                setErrors(apiErrors);
            }
        }
    }

    return ( 
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstName" 
                    label="Prénom" 
                    placeholder="Votre prénom" 
                    error={errors.firstName} 
                    value={user.firstName}
                    onChange={handleChange} 
                />
                <Field 
                    name="lastName" 
                    label="nom" 
                    placeholder="Votre nom" 
                    error={errors.lastName} 
                    value={user.lastName}
                    onChange={handleChange} 
                />
                <Field 
                    name="email" 
                    label="email" 
                    type="email"
                    placeholder="Votre email" 
                    error={errors.email} 
                    value={user.email}
                    onChange={handleChange} 
                />
                <Field 
                    name="password" 
                    label="password" 
                    type="password"
                    placeholder="Votre password" 
                    error={errors.password} 
                    value={user.password}
                    onChange={handleChange} 
                />
                <Field 
                    name="passwordConfirm" 
                    label="passwordConfirm" 
                    type="password"
                    placeholder="Votre passwordConfirm" 
                    error={errors.passwordConfirm} 
                    value={user.passwordConfirm}
                    onChange={handleChange} 
                />
                <div className="form-group mt-5">
                    <button type="submit" className='btn btn-success'>Confirmation</button>
                    <Link to="/login" className='btn btn-link'>J'ai déja un compte</Link>
                </div>
            </form>
        </>
     );
}
 
export default RegisterPage;