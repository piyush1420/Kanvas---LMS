// Kambaz/auth.js
// Route guard: requireRole() needs any signed-in user,
// requireRole("FACULTY", "ADMIN") needs one of those roles.
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    if (roles.length && !roles.includes(currentUser.role)) {
      res.sendStatus(403);
      return;
    }
    next();
  };
