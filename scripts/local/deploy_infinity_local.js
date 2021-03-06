// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [user1,user2,user3] = await hre.ethers.getSigners();

  //Infinity Vault Deployment Params:
  const name = "Infinity Gamma";
  const symbol = "iGAMMA";
  const _gToken = "0x0c6dd143F4b86567d6c21E8ccfD0300f00896442" //gGAMMA address
  const _gammaTroller = "0xF54f9e7070A1584532572A6F640F09c606bb9A83"; //GammaTroller address
  const _gamma = "0xb3Cb6d2f8f2FDe203a022201C81a96c167607F15"; //GAMMA address

  const _withdrawFeeAddress = user2.address; //user2 address
  const _performanceFeeAddress = user3.address; //user3 address

  //Account To Impersonate
  const accountToImpersonate = "0xD1Ec391627c9E2Fb0c570Da876Bc75dF23c42BEB" //Raj's Account


  const InfinityVault = await hre.ethers.getContractFactory("contracts/infinityVault.sol:InfinityVault");
  const infinityVault = await InfinityVault.deploy(name,symbol,_gToken,_gammaTroller,_withdrawFeeAddress,_performanceFeeAddress,_gamma);
  await infinityVault.deployed();

  console.log("\n INFINITY VAULT DEPLOYED ADDRESS :",infinityVault.address);

  //impersonating raj account
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [accountToImpersonate],
  });
  
  const gToken = await ethers.getContractAt("contracts/gToken.sol:GErc20Delegator",_gToken);
  const signer = await ethers.getSigner(accountToImpersonate)
  impersonated_gTOKEN_bal = await gToken.balanceOf(accountToImpersonate);

  await gToken.connect(signer).transfer(user1.address, BigInt(impersonated_gTOKEN_bal));

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [accountToImpersonate],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
