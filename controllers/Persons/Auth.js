const Members = require("../../models/Persons/Members"),
  generateToken = require("../../config/generateToken"),
  seleniumLogin = require("../../config/selenium/login");

exports.login = async (req, res) => {
  console.log("[BACKEND] \n >>auth/login");

  const { email, password } = req.query;

  Members.findOne({ email })
    .select("-createdAt -updatedAt -__v")
    .then(async user => {
      const seleniumResponse = await seleniumLogin(email, password);
      console.log(seleniumResponse, "response");
      // if (user) {
      //   console.log("[BACKEND] \n >>auth/login \n >>200 user found");
      // if (await user.matchPassword(password)) {
      //   if (user.isActive) {
      //     user.password = undefined;
      //     res.json({ user, token: generateToken(user._id) });
      //   } else {
      //     res.json({ error: "Your account has been banned!" });
      //   }
      // } else {
      //   res.json({ error: "Password is incorrect!" });
      // }
      // } else {
      //   console.log("[BACKEND] \n >>auth/login \n >>404 user not found");
      //   Members.create({
      //     email,
      //     customId: new Date().toLocaleString(),
      //   }).then(user => {
      //     res.status(201).json({
      //       status: "Success",
      //       message: `(${email}) Created Successfully`,
      //       data: user,
      //     });
      //   });
      // }
    })
    .catch(error => res.status(400).json({ error: error.message }));
};

// exports.validateRefresh = (req, res) =>
//   Attendances.findOne({ user: res.locals.user._id })
//     .sort({ createdAt: -1 })
//     .then(item => {
//       if (item.out) {
//         res.json({ error: "Logged out from a different device." });
//       } else {
//         res.json(res.locals.user);
//       }
//     })
//     .catch(error => res.status(400).json({ error: error.message }));
