const User = require("../../models/Persons/Users"),
  generateToken = require("../../config/generateToken"),
  bcrypt = require("bcryptjs"),
  fs = require("fs");

const encrypt = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

exports.login = (req, res) => {
  const { email, password } = req.query;

  User.findOne({ email })
    .select("-createdAt -updatedAt -__v")
    .then(async user => {
      if (user) {
        if (await user.matchPassword(password)) {
          if (user.isActive) {
            user.password = undefined;

            res.json({ user, token: generateToken(user._id) });
          } else {
            res.json({ error: "Your account has been banned!" });
          }
        } else {
          res.json({ error: "Password is incorrect!" });
        }
      } else {
        res.json({ error: "Invalid Credentials!" });
      }
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

exports.save = (req, res) =>
  User.create(req.body)
    .then(user => res.status(201).json(`(${user._id}) Created successfully.`))
    .catch(error => res.status(400).json({ error: error.message }));

exports.changePassword = (req, res) => {
  const { email, password, old } = req.body;

  User.findOne({ email })
    .then(async user => {
      if (!user.isActive) {
        res.status(400).json({ expired: "Your account has been banned" });
      } else {
        if (await user.matchPassword(old)) {
          let newPassword = await encrypt(password);
          User.findByIdAndUpdate(user._id, { password: newPassword })
            .select("-password")
            .then(user => res.json(`(${user._id}) Updated successfully.`));
        } else {
          res.json({ error: "Old Password is incorrect." });
        }
      }
    })
    .catch(error => res.status(400).json({ error: error.message }));
};

exports.file = (req, res) => {
  const { path, base64, name } = req.body;
  let url = `./assets/${path}`;
  if (!fs.existsSync(url)) {
    fs.mkdirSync(url, { recursive: true });
  }
  try {
    let filename = `${url}/${name}`;
    fs.writeFileSync(filename, base64, "base64");
    return res
      .status(200)
      .json({ success: true, message: "Successfully Uploaded." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
