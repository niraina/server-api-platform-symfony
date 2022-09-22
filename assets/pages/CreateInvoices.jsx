import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import CustomersAPI from '../services/customersAPI';
import axios from "axios";

const CreateInvoices = (props) => {

    const [invoice, setInvoice] = useState({
        amout: "",
        customer: "",
        status: ""
    });

    const [customers, setCustomers] = useState([]);
    const [errors, setErrors] = useState({
        amout: "",
        customer: "",
        status: ""
    });


    const fetchCustomers = async () => {
        try {
           const data = await CustomersAPI.findAll();
           setCustomers(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, [])

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value});
    }
    
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/api/invoices", invoice)
            console.log(response);
        } catch (error) {
            console.log(error.response);
        }
    }

    return ( 
    <>
        <h1>Création d'une facture</h1>
        <form onSubmit={handleSubmit}>
            <Field 
                name="amout" 
                type="number" 
                placeholder="Montant du facture" 
                label="Montant" 
                onChange={handleChange} 
                value={invoice.amout}
            />

            <Select 
                name="customer"
                label="Client"
                value={invoice.customer}
                error={errors.customer}
                onChange={handleChange}
            >
                {customers.map(customer => (
                    (<option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)
                ))}
            </Select>

            <Select 
                name="status"
                label="Status"
                value={invoice.status}
                error={errors.status}
                onChange={handleChange}
            >
                <option value="SEND">Envoyée</option>
                <option value="PAID">Payée</option>  
                <option value="CANCELLED">Annulée</option>
            </Select>

            <div className="form-group mt-3 mb-3">
                <button type="submit" className="btn btn-success">Enregistrer !</button>
                <Link to="/invoices" className='btn btn-link'>Retour</Link>
            </div>

        </form>
    </> );
}
 
export default CreateInvoices;