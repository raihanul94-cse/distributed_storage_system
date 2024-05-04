const express = require("express");
const router = express.Router();
const authRoute = require("./auth");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
];

defaultRoutes.forEach((route) => {
  if (route.middleware) {
    router.use(route.path, route.middleware, route.route);
  } else {
    router.use(route.path, route.route);
  }
});

module.exports = router;
