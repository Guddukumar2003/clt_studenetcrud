import express from "express";
import { create, getAllUsers, getUserById, update, deleteUser } from "../controller/userController.js";

const route = express.Router();

route.post("/user", create);
route.get("/users", getAllUsers);
route.get("/user/:id", getUserById);
route.put("/user/:id", update); // Fixed: Removed extra "/update" prefix to match frontend URL
route.delete("/user/:id", deleteUser); // Optional: Simplified DELETE to match pattern (remove "/delete" if frontend uses /api/user/:id)

export default route;