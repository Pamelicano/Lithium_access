const hre = require("hardhat");

async function main() {
    const Access = await hre.ethers.getContractFactory("AccessControlList");
    const access = await Access.deploy();
    await access.waitForDeployment();
    console.log(`deployed to ${access.target}`)
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
