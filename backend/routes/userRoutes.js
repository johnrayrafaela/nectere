const express = require("express");
const { register, login, addUser, updateUser, getUser, getAllUsers, deleteUser } = require("../controllers/userController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/add", addUser);
router.put("/update/:id", updateUser);
router.get("/get/:id", getUser);
router.get("/get-all", getAllUsers);
router.delete("/delete/:id", deleteUser);

module.exports = router;
