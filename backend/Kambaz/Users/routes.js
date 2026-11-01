// Kambaz/Users/routes.js
import UsersDao from "./dao.js";
import { requireRole } from "../auth.js";

export default function UserRoutes(app) {
  const dao = UsersDao();

  const createUser = async (req, res) => {
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    if (user?.demo) {
      res.status(403).json({ message: "Demo accounts can't be deleted" });
      return;
    }
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  //
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const userId = req.params.userId;
    const user = await dao.findUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.session["currentUser"];
    const isAdmin = currentUser.role === "ADMIN";
    if (!isAdmin && currentUser._id !== userId) {
      res.sendStatus(403);
      return;
    }
    const userUpdates = { ...req.body };
    delete userUpdates.demo;
    if (!isAdmin) delete userUpdates.role;
    const user = await dao.findUserById(userId);
    if (user?.demo) {
      // Keep the shared demo logins working for every visitor
      delete userUpdates.username;
      delete userUpdates.password;
      delete userUpdates.role;
    }
    const status = await dao.updateUser(userId, userUpdates);

    if (currentUser._id === userId) {
      delete userUpdates.password;
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }

    res.json(status); // Return the update status, not currentUser
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    // Self sign-up can only create students or faculty, never admins
    const role = req.body.role === "FACULTY" ? "FACULTY" : "STUDENT";
    const currentUser = await dao.createUser({ ...req.body, role, demo: false });
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    // Only plain strings, so a body like {"password": {"$ne": ""}} can't match
    if (typeof username !== "string" || typeof password !== "string") {
      res.status(401).json({ message: "Unable to login. Try again later." });
      return;
    }
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  app.post("/api/users", requireRole("ADMIN"), createUser);
  app.get("/api/users", requireRole("ADMIN"), findAllUsers);
  app.get("/api/users/:userId", requireRole(), findUserById);
  app.put("/api/users/:userId", requireRole(), updateUser);
  app.delete("/api/users/:userId", requireRole("ADMIN"), deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}

