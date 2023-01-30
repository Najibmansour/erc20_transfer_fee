const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy();

  // const Token = await ethers.getContractFactory("MyToken");
  // const token = await upgrades.deployProxy(Token, [], {
  //   initializer: "initialize",
  // });
  await token.deployed();

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
