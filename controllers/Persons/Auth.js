const Members = require("../../models/Persons/Members"),
  generateToken = require("../../config/generateToken"),
  seleniumLogin = require("../../config/selenium/login");

exports.login = async (req, res) => {
  console.log("[BACKEND] \n >>auth/login");

  const { email, password } = req.query;

  Members.findOne({ email })
    .select("-createdAt -updatedAt -__v")
    .then(async user => {
      // const seleniumResponse = await seleniumLogin(email, password);
      // console.log(seleniumResponse, "response");
      if (user) {
        console.log("[BACKEND] \n >>auth/login \n >>200 user found");
        res.status(200).json({
          status: true,
          message: `(${email}) Logged in Successfully`,
          content: {
            user,
            token: generateToken({
              id: user._id,
              email,
              password,
            }),
          },
        });
      } else {
        console.log("[BACKEND] \n >>auth/login \n >>404 user not found");
        Members.create({
          email,
          customId: new Date().toLocaleString(),
        }).then(user => {
          res.status(201).json({
            status: true,
            message: `(${email}) Created Successfully`,
            content: {
              user,
              token: generateToken({
                id: user._id,
                email,
                password,
              }),
            },
          });
        });
      }
    })
    .catch(error => res.status(400).json({ error: error.message }));
};

exports.validateRefresh = (req, res) =>
  // send user credentials back to the frontend
  res.status(200).json({
    status: true,
    message: `(${res.locals.email}) Reconnected Successfully`,
    content: res.locals.user,
  });
