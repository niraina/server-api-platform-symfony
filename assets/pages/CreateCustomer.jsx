import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import CustomersAPI from '../services/customersAPI';


const CreateCustomer = ({match, history}) => {
    const { id } = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    // recuperation du customer apr id
    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await CustomersAPI.find(id);
            
            setCustomer({firstName, lastName, email, company});
        } catch (error) {
            console.log(error.response);
            // TODO : Notifiaction d'une erreur

            history.replace('/customers');
        }
    }

    //chargement du customer en fonction des composent
    useEffect( () => {
        if(id !=="new") {
            setEditing(true)
            fetchCustomer(id)
        }
    }, [id])


    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value});
    }
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if(editing) {
                await CustomersAPI.update(id, customer)
                // TODO : flash de notification
            }else {
                await CustomersAPI.create(customer);
                // console.log(response.data);

                // TODO : flash de notification
                history.replace("/customers");
            }
            setErrors({});
        } catch ({response}) {
            const {violations} = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                })
                setErrors(apiErrors);

                // TODO : flash de notification d'erreurs
            }
        }

    }

    return ( 
        <>
            {!editing && (<h1>Cr??ation d'un client</h1>) || (<h1>Modification d'un client</h1>)}
            <form onSubmit={handleSubmit}>
                    <Field 
                        name="lastName"
                        label="Nom de famille"
                        placeholder="Nom de famille du client"
                        value={customer.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                    />
                    <Field 
                        name="firstName"
                        label="Pr??nom"
                        placeholder="Pr??nom du client"
                        value={customer.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                    />
                    <Field 
                        name="email"
                        label="E-mail"
                        placeholder="E-mail du client"
                        type="email"
                        value={customer.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <Field 
                        name="company"
                        label="Entreprise"
                        placeholder="Entreprise du client"
                        value={customer.company}
                        onChange={handleChange}
                        error={errors.company}
                    />
                    <div className="form-group mt-3 mb-3">
                        <button type="submit" className="btn btn-success">Enregistrer</button>
                        <Link to="/customers" className='btn btn-link'>Retour</Link>
                    </div>
            </form>
        </>
     );
}
 
export default CreateCustomer;