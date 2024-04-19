import React from 'react';
import './Model.css';

const Modal = ({ show, children }) => {
    // Si la modal n'est pas affichée, ne rien rendre
    if (!show) {
        return null;
    }

    return (
        <div className="modal" >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title">Create New Team</h4>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                
            </div>
        </div>
    );
};

export default Modal;
