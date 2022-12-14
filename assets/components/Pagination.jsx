import React from 'react';

const Pagination = ({currentPage, itemsPerPage, length, onPageChanged}) => {
    
    const pagesCount = Math.ceil(length / itemsPerPage);
    const pages = [];

    for(let i = 1; i <= pagesCount; i++){
        pages.push(i);
    }

    return ( 
        <div>
            <ul className="pagination pagination-sm">
                <li className={"page-item " + (currentPage === 1 && "disabled")}>
                    <button 
                        onClick={() => onPageChanged(currentPage - 1)}
                        className="page-link"
                    >&laquo;</button>
                </li>
                {pages.map(page => 
                    <li key={page} className={"page-item " + (currentPage === page && "active")}>
                        <button 
                            onClick={ () => onPageChanged(page)}
                            className="page-link"
                        >
                            {page}
                        </button>
                    </li>
                )}
                <li className={"page-item " + (currentPage === pagesCount && "disabled")}>
                    <button 
                    onClick={() => onPageChanged(currentPage + 1)}
                    className="page-link">&raquo;</button>
                </li>
            </ul>
        </div>
     );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
    // d'ou on part pendant combien (itemsPerPage)
    const start = currentPage * itemsPerPage - itemsPerPage;
    //              4          * 10          - 10 = 30
    return items.slice(start, start + itemsPerPage);
}
 
export default Pagination;