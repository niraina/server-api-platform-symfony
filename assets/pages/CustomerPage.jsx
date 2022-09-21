import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/customersAPI';

const CustomerPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    //permet de recuperer les customers
    const fecthCustomers = async () => {

        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data)
        } catch (error) {
            console.log(error.response)
        }
    }
    //Au chargement du composant, on va cherchers les customers
    useEffect(() => { 
        fecthCustomers();
    }, [])

    // Autr efaçon d'afficher
    // useEffect(() => {
    //     CustomersAPI.findAll()
    //     .then(data => setCustomers(data))
    //     .catch(error => console.log(error.response));
        
    // }, []);

    //gestion du suppression d'un customer
    const handleDelete = async (id) => {

        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));

        try {
            await  CustomersAPI.delete(id)
        }catch(error) {
            setCustomers(originalCustomers);
            console.log(error.response)
        }
        // Autre façon de supprimer (supprimer le async sur le handleDtelete)
        // CustomersAPI.delete(id)
        //     .then(response => console.log("ok"))
        //     .catch(error => {
        //         setCustomers(originalCustomers);
        //         console.log(error.response)
        //     });
        
    }

    //gestion du changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    const itemsPerPage = 10;

    //filtrage des customers en fonction de la rechrche
    const filteredCustomers = customers.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase())) 
        )

    //pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers, 
        currentPage, 
        itemsPerPage
        );
    
    return ( 
    <>
        <h1>Liste des clients</h1>
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
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedCustomers.map(customer => 
                <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                        <a href="#">{customer.firstName} {customer.lastName}</a>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">
                        <span className="badge bg-primary">
                            {customer.invoices.length}
                        </span>
                    </td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                    <td>
                        <button 
                        onClick={() => handleDelete(customer.id)}
                        disabled={ customer.invoices.length > 0 } 
                        className="btn btn-sm btn-danger"
                        >
                            Supprimer
                        </button>
                    </td>
                </tr>
                )}
            </tbody>
        </table>
        {itemsPerPage < filteredCustomers.length && <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            length={filteredCustomers.length} 
            onPageChanged={handlePageChange}
        />}
    </>
    );
}
 
export default CustomerPage;