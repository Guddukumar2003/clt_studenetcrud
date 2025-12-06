import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import "./adduser.css"; // Assuming the CSS file is named adduser.css
import toast from "react-hot-toast"

const AddUser = () => {
    const users = {
        name: "",
        email: "",
        phone: "",
        state: ""
    };
    const [user, setUser] = useState(users);
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const { name, value } = e.target;
        console.log(name, value);

        setUser({ ...user, [name]: value });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/api/user", user);

            toast.success("form submit Successfull", {
                position: "top-right",
            });

            // Delay navigation to allow toast to be visible
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error(error);

            toast.error("Failed to add user", {
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
                    <button type="submit">Add User</button> 
                </div>
            </form>
        </div>
    );
};

export default AddUser;