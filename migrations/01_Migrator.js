const Menu_Management_Contract = artifacts.require("Menu_Management");

module.exports = function (deployer) {
  deployer.deploy(Menu_Management_Contract);
};