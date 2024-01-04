const Menu_Management_Contract = artifacts.require("Menu_Management");
const FastCoin_Contract = artifacts.require("FastCoin");
const LoyaltyProgram_Contract = artifacts.require("LoyaltyProgram");
const OrderProcessing_Contract = artifacts.require("OrderProcessing");
const PromotionsSystem_Contract = artifacts.require("PromotionsSystem");

module.exports = async function (deployer) {
  await deployer.deploy(Menu_Management_Contract);
  await deployer.deploy(FastCoin_Contract);
  await deployer.deploy(PromotionsSystem_Contract);

  const Menu_Management_Contract_Instance = await Menu_Management_Contract.deployed();
  const FastCoin_Contract_Instance = await FastCoin_Contract.deployed();
  const PromotionsSystem_Contract_Instance = await PromotionsSystem_Contract.deployed();

  await deployer.deploy(LoyaltyProgram_Contract,FastCoin_Contract_Instance.address);
  const LoyaltyProgram_Contract_Instance = await LoyaltyProgram_Contract.deployed();

  await deployer.deploy(OrderProcessing_Contract,Menu_Management_Contract_Instance.address,LoyaltyProgram_Contract_Instance.address,PromotionsSystem_Contract_Instance.address,FastCoin_Contract_Instance.address);


};