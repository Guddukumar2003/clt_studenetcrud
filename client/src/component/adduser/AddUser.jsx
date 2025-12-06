import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./adduser.css";
import toast from "react-hot-toast";

// Dynamic API URL: Production uses Render, local uses localhost:7000 (fixed port from 8000)
const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://clt-studenetcrud-1.onrender.com'  // Your live Render backend
    : 'http://localhost:7000';  // Local dev URL

const AddUser = () => {
    const initialUser = {
        name: "",
        email: "",
        phone: "",
        state: ""
    };
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const inputHandler = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setUser({ ...user, [name]: value });
    };
    
    const submitForm = async (e) => {
        e.preventDefault();
        console.log('Submitting user data:', user);
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/user`, user);  // Fixed: Dynamic URL
            console.log('Backend response:', response.data);
            toast.success("Form submitted successfully!", {
                position: "top-right",
            });
            setUser(initialUser);
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response data:', error.response?.data);
            console.error('Error status:', error.response?.status);
            const errorMsg = error.response?.data?.message || error.response?.statusText || "Failed to add user";
            toast.error(errorMsg, {
                position: "top-right",
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="addUser">
            <Link to="/" className="btn btn-info">
                <i className="fa-solid fa-backward"></i>
                Back
            </Link>
            <h3>Add New User</h3>
            <form className="addUserForm" onSubmit={submitForm}>
                <div className="inputGroup">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        onChange={inputHandler}
                        name="name"
                        autoComplete="off"
                        placeholder="Enter your Full Name"
                        value={user.name}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        onChange={inputHandler}
                        name="email"
                        autoComplete="off"
                        placeholder="Enter Email"
                        value={user.email}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        onChange={inputHandler}
                        name="phone"
                        autoComplete="off"
                        placeholder="Enter Phone Number"
                        value={user.phone}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="inputGroup">
                    <label htmlFor="state">State:</label>
                    <input
                        type="text"
                        id="state"
                        onChange={inputHandler}
                        name="state"
                        autoComplete="off"
                        placeholder="Enter your State"
                        value={user.state}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="inputGroup submitGroup">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add User'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUser;