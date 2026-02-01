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
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    
    const validateName = (value) => {
        if (!value.trim()) return "This field is mandatory";
        if (value.length < 2) return "Name must be at least 2 alphabets long";
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Name must contain only alphabets";
        return "";
    };

    const validateEmail = (value) => {
        if (!value.trim()) return "This field is mandatory";
        if (!value.endsWith("@gmail.com")) return "Email must end with @gmail.com";
        return "";
    };

    const validatePhone = (value) => {
        if (!value) return "This field is mandatory";
        if (value.length !== 10) return "Phone must be exactly 10 digits";
        if (!/^\d{10}$/.test(value)) return "Phone must contain only numbers";
        return "";
    };

    const validateState = (value) => {
        if (!value.trim()) return "This field is mandatory";
        return "";
    };

    const validateForm = () => {
        const newErrors = {};
        newErrors.name = validateName(user.name);
        newErrors.email = validateEmail(user.email);
        newErrors.phone = validatePhone(user.phone);
        newErrors.state = validateState(user.state);
        setErrors(newErrors);
        return Object.values(newErrors).every(error => !error);
    };

    const inputHandler = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setUser({ ...user, [name]: value });
        
        // Clear error on input change
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        let error = '';
        switch (name) {
            case 'name':
                error = validateName(user.name);
                break;
            case 'email':
                error = validateEmail(user.email);
                break;
            case 'phone':
                error = validatePhone(user.phone);
                break;
            case 'state':
                error = validateState(user.state);
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };
    
    const submitForm = async (e) => {
        e.preventDefault();
        console.log('Submitting user data:', user);
        
        if (!validateForm()) {
            toast.error("Please fill all fields", {
                position: "top-right",
            });
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/user`, user);  // Fixed: Dynamic URL
            console.log('Backend response:', response.data);
            toast.success("Form submitted successfully!", {
                position: "top-right",
            });
            setUser(initialUser);
            setErrors({});
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
            <Link to="/" className="back-btn">
                <i className="fa-solid fa-backward"></i>
                Back
            </Link>
            <h3>Add New User Form</h3>
            <form className="addUserForm" onSubmit={submitForm}>
                <div className="inputGroup">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        onChange={inputHandler}
                        onBlur={handleBlur}
                        name="name"
                        autoComplete="off"
                        placeholder="Enter your Full Name"
                        value={user.name}
                        required
                        disabled={loading}
                        className={errors.name ? "error" : ""}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="inputGroup">
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        onChange={inputHandler}
                        onBlur={handleBlur}
                        name="email"
                        autoComplete="off"
                        placeholder="Enter Email (must end with @gmail.com)"
                        value={user.email}
                        required
                        disabled={loading}
                        className={errors.email ? "error" : ""}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="inputGroup">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        onChange={inputHandler}
                        onBlur={handleBlur}
                        name="phone"
                        autoComplete="off"
                        placeholder="Enter 10-digit Phone Number"
                        value={user.phone}
                        required
                        disabled={loading}
                        className={errors.phone ? "error" : ""}
                        maxLength={10}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                <div className="inputGroup">
                    <label htmlFor="state">State:</label>
                    <input
                        type="text"
                        id="state"
                        onChange={inputHandler}
                        onBlur={handleBlur}
                        name="state"
                        autoComplete="off"
                        placeholder="Enter your State"
                        value={user.state}
                        required
                        disabled={loading}
                        className={errors.state ? "error" : ""}
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
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