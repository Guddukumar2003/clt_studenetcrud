import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "./user.css";
import axios from "axios";
import toast from 'react-hot-toast';

// Dynamic API URL: Production uses Render, local uses localhost:7000
const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://clt-studenetcrud-1.onrender.com'  // Live backend
    : 'http://localhost:7000';  // Local dev (fixed port)

const User = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [loading, setLoading] = useState(true);  // Added loading state for better UX

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/users`);  // Fixed URL
                console.log('Fetched users:', response.data);  // Added log for debugging
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error("Error while fetching data", error);  // Use error for better logging
                toast.error("Failed to fetch users", { position: "top-right" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Search functionality
    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.state.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    // Sort functionality
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sorted = [...filteredUsers].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredUsers(sorted);
    };

    const deleteUser = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return; // Optional: Add confirmation dialog
        }

        axios.delete(`${API_BASE_URL}/api/user/${userId}`) // Fixed URL
            .then((response) => {
                // Update state to remove the deleted user
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                setFilteredUsers((prevFiltered) => prevFiltered.filter((user) => user._id !== userId));
                
                // Show success toast
                toast.success(response.data.message || "User deleted successfully", { position: "top-right" });
            })
            .catch((error) => {
                console.error(error);  // Use error for better logging
                toast.error("Failed to delete user", { position: "top-right" }); // Added error toast
            });
    };

    if (loading) {
        return (
            <div className="userTable">
                <h3>User List</h3>
                <div className="loading">
                    <i className="fa-solid fa-spinner"></i>
                    <div>Loading users...</div>
                </div>
            </div>
        );  // Centered loading indicator
    }

    return (
        <div className="userTable">
            <h3>User List</h3>
            <Link to="/add" className="add-btn">
                <i className="fa-solid fa-user-plus"></i>
                Add User
            </Link>

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by Name, Email, or State..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredUsers.length === 0 ? (
                <div className="noData">
                    <i className="fa-solid fa-users-slash"></i>
                    <h3>No Data to Display</h3>
                    <p>{searchTerm ? 'No users match your search.' : 'Please add users to get started'}</p>
                </div>
            ) : (
                <div className="table-container">
                    <div className="table-responsive">
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th scope="col" onClick={() => handleSort('name')} className={sortConfig.key === 'name' ? 'sortable' : ''}>Name</th>
                                    <th scope="col" onClick={() => handleSort('email')} className={sortConfig.key === 'email' ? 'sortable' : ''}>Email</th>
                                    <th scope="col" onClick={() => handleSort('phone')} className={sortConfig.key === 'phone' ? 'sortable' : ''}>Phone</th>
                                    <th scope="col" onClick={() => handleSort('state')} className={sortConfig.key === 'state' ? 'sortable' : ''}>State</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => {
                                    return (
                                        <tr key={user._id}>
                                            <td>{index + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.state}</td>
                                            <td className='actionButton'>
                                                <Link 
                                                    to={`/update/${user._id}`} 
                                                    className="btn btn-warning"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </Link>

                                                <button 
                                                    onClick={() => deleteUser(user._id)}
                                                    type="button"
                                                    className="btn btn-danger"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;