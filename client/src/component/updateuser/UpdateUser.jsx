import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import toast from "react-hot-toast"
import "./updateuser.css"

// Dynamic API URL: Production uses Render, local uses localhost:7000
const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://clt-studenetcrud-1.onrender.com'  // Live backend
    : 'http://localhost:7000';  // Local dev (fixed port)

const UpdateUser = () => {
    const initialUser = {
        name: "",
        email: "",
        phone: "",
        state: ""
    };
    const [user, setUser] = useState(initialUser);
    const navigate = useNavigate();
    const { id } = useParams(); // Fixed: Added parentheses to call the hook properly

    const inputHandler = (e) => {
        const { name, value } = e.target;
        console.log(name, value);

        setUser({ ...user, [name]: value });
    };

    useEffect(() => {
      axios.get(`${API_BASE_URL}/api/user/${id}`)  // Fixed URL
            .then((response) => {
                setUser(response.data)
            })
            .catch((error) => {
                console.log(error);
                toast.error("Failed to fetch user data", { position: "top-right" });  // Added toast for better UX
            });
    }, [id]);

    const submitForm = async (e) => {
        e.preventDefault();

        try {
            // Fixed: Use PUT for update and include ID in URL
            const response = await axios.put(`${API_BASE_URL}/api/user/${id}`, user);  // Fixed URL

            toast.success("User updated successfully", {
                position: "top-right",
            });

            // Delay navigation to allow toast to be visible
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error(error);

            toast.error("Failed to update user", {
                position: "top-right",
            });
        }
    };

    return (
        <div className="addUser">
            <Link to="/" className="btn btn-info">
                <i className="fa-solid fa-backward"></i>
                Back
            </Link>
            <h3>Update User</h3>
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
                    />
                </div>
                <div className="inputGroup submitGroup">
                    <button type="submit">Update User</button> {/* Fixed: Updated button text for clarity */}
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;