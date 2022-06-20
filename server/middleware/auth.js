const { Faculty } = require("../models/Faculty");

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;

  Faculty.findByToken(
    token,
    (err, user) => {
      if (err) throw err;
      if (!user)
        return res.json({
          isAuth: false,
          error: true,
        });

      req.token = token;
      req.faculty = user;
      next();
    }
  );
};

module.exports = { auth };
