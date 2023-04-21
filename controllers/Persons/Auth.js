const Members = require("../../models/Persons/Members"),
  generateToken = require("../../config/generateToken"),
  seleniumLogin = require("../../config/seleniumLogin");

exports.login = async (req, res) => {
  console.log(">>auth/login");

  const { email, password } = req.query;

  Members.findOne({ email })
    .select("-createdAt -updatedAt -__v")
    .then(async user => {
      const seleniumResponse = await seleniumLogin(email, password);
      if (seleniumResponse.status) {
        console.log(">>auth/login - fb login success");
        if (user) {
          console.log(">>auth/login - user found, proceed with token");
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
          console.log(
            ">>auth/login - user not found, register then proceed with token"
          );
          Members.create({
            email,
            facebook: seleniumResponse.content,
            messengerId: new Date().toLocaleString(),
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
      } else {
        res.status(400).json({
          status: false,
          message: seleniumResponse.message,
        });
      }
      seleniumResponse.driver.quit();
    })
    .catch(error =>
      res.status(400).json({ status: false, message: error.message })
    );
};

exports.validateRefresh = (req, res) => {
  console.log(">>auth/validateRefresh");

  // send user credentials back to the frontend
  res.status(200).json({
    status: true,
    message: `(${res.locals.email}) Reconnected Successfully`,
    content: res.locals.user,
  });
};
