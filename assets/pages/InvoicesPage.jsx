import moment from "moment";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/invoicesAPI';


const STATUS_CLASSES = {
    PAID: "success",
    SENT: "warning",
    CANCELLED: "danger"
}
const STATUS_TEXT = {
    PAID: "Payé",
    SENT: "Envoyé",
    CANCELLED: "Supprimé"
}

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 10;

    // recuperation des invoices par l'api
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll()
            setInvoices(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    // charger les invoices au chargement du composent
    useEffect(() => {
        fetchInvoices();
    }, []);

    
    // gestion du changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }
    
    // gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    const handleDelete = async id => {
        // copier le tableau originale
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id);
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices)
        }
    }
    
    //gestion format date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    //filtrage des customers en fonction de la rechrche
    const filteredInvoices = invoices.filter(
        i => 
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amout.toString().startsWith(search.toLowerCase()) || 
            STATUS_TEXT[i.status].toLowerCase().includes(search.toLowerCase()) 
        )

    //pagination des données
    const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage, 
        itemsPerPage
    );
    
    return ( 
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link className="btn btn-primary" to="invoices/new">Créer une facture</Link>
            </div>
            <div className="form-group">
                <input 
                        onChange={handleSearch}
                        value={search}
                        type="text" 
                        className="form-control" 
                        placeholder="Rechercher..." 
                    />
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className='text-center'>Date</th>
                        <th className='text-center'>Status</th>
                        <th className='text-center'>Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td>
                                <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                            </td>
                            <td className='text-center'>{formatDate(invoice.sentAt)}</td>
                            <td className='text-center'>
                                <span className={"badge bg-" + STATUS_CLASSES[invoice.status]}>{STATUS_TEXT[invoice.status]}</span>
                            </td>
                            <td className='text-center'>{invoice.amout.toLocaleString()} €</td>
                            <td>
                                <button className="btn btn-sm btn-warning">Editer</button>
                                <button onClick={() => handleDelete(invoice.id)} className="btn btn-sm btn-danger">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChanged={handlePageChange}
                length={filteredInvoices.length}
            />
        </>
     );
}
 
export default InvoicesPage;