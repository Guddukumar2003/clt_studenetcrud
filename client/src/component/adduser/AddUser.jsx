import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import "./adduser.css"; // Assuming the CSS file is named adduser.css
import toast from "react-hot-toast"

const AddUser = () => {
    const initialUser = {
        name: "",
        email: "",
        phone: "",
        state: ""
    };
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        console.log(name, value); // Keep for debugging

        setUser({ ...user, [name]: value });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        // Log the payload before sending (sanity check)
        console.log('Submitting user data:', user);

        setLoading(true); // Disable form during submit

        try {
            const response = await axios.post("http://localhost:8000/api/user", user);
            console.log('Backend response:', response.data);  // Log success response

            toast.success("Form submitted successfully!", {
                position: "top-right",
            });

            // Reset form after success
            setUser(initialUser);

            // Delay navigation to allow toast to be visible
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error('Full error object:', error);  // Log entire error
            console.error('Error response data:', error.response?.data);  // Backend message
            console.error('Error status:', error.response?.status);  // e.g., 400, 500

            // Customize toast based on error
            const errorMsg = error.response?.data?.message || error.response?.statusText || "Failed to add user";
            toast.error(errorMsg, {
                position: "top-right",
            });
        } finally {
            setLoading(false); // Re-enable form
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
                        required // Add validation hint
                        disabled={loading} // Disable during loading
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