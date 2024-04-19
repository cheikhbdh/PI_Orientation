import React, { useState, useEffect } from 'react';
import Table from '../../components/table/Table';
import { fetchUsers, deleteUser } from '../../services/userServices/userservices';
import './jery.css'
const customerTableHead = [
    '',
    'username',
    'email',
    'Actions'
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index , handleDelete) => (
    <tr key={index}>
        <td></td>
        <td>{item.username}</td>
        <td>{item.email}</td>
        <td>
            <button className='delete-jery' onClick={() => handleDelete(item._id)}>Delete</button>
        </td>
    </tr>
);

const Jery = () => {
    const [customerList, setCustomerList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchUsers(); 
                setCustomerList(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            const updatedUsers = customerList.filter(user => user._id !== userId);
            setCustomerList(updatedUsers);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <h2 className="page-header">Jery</h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='3'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={customerList}
                                renderBody={(item, index) => renderBody(item, index , handleDelete)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jery;
