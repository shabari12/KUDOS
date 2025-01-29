const userModel = require("../models/userModel");

module.exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await userModel.create({ username, email, password });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error });
  }
  return user;
};
