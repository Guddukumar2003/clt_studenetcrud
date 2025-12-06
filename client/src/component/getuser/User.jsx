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
    const [loading, setLoading] = useState(true);  // Added loading state for better UX

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/users`);  // Fixed URL
                console.log('Fetched users:', response.data);  // Added log for debugging
                setUsers(response.data);
            } catch (error) {
                console.error("Error while fetching data", error);  // Use error for better logging
                toast.error("Failed to fetch users", { position: "top-right" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const deleteUser = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return; // Optional: Add confirmation dialog
        }

        axios.delete(`${API_BASE_URL}/api/user/${userId}`) // Fixed URL
            .then((response) => {
                // Update state to remove the deleted user
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
                
                // Show success toast
                toast.success(response.data.message || "User deleted successfully", { position: "top-right" });
            })
            .catch((error) => {
                console.error(error);  // Use error for better logging
                toast.error("Failed to delete user", { position: "top-right" }); // Added error toast
            });
    };

    if (loading) {
        return <div className="userTable">Loading users...</div>;  // Simple loading indicator
    }

    return (
        <div className="userTable">
            <Link to="/add" className="btn btn-info">
                Add User
                <i className="fa-solid fa-user-plus"></i>
            </Link>

            {users.length === 0 ? (
                <div className="noData">
                    <h3>No Data to display</h3>
                    <p>Please add users</p>  {/* Minor fix: Added "users" for clarity */}
                </div>
            ) : (
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th scope="col">S.No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">State</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
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
            )}
        </div>
    );
};

export default User;