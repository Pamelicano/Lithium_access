const { expect } = require("chai");
const { performance } = require("perf_hooks");

describe("AccessControlList Performance Tests", function () {
    let AccessControlList;
    let accessControlList;
    let user;
    let addresses;

    before(async function () {
        // addresses
        [owner, admin, user, ...addresses] = await ethers.getSigners();

        AccessControlList = await ethers.getContractFactory("AccessControlList");
        accessControlList = await AccessControlList.deploy();
        await accessControlList.waitForDeployment();

        for (const address of addresses) {
            await accessControlList.registerUser(address.address, 2); //registration for each
        }
        // updating
    });

    it("should measure time for user registration", async function () {
        const start = performance.now();
        await accessControlList.registerUser(user.address, 2); // 2 = UserRole.User
        const end = performance.now();
        console.log(`User registration took ${end - start} milliseconds`);
    });

    it("should measure time for user login", async function () {

        const start = performance.now();
        await accessControlList.login();
        const end = performance.now();
        console.log(`User login took ${end - start} milliseconds`);
    });

    it("should measure time for user logout", async function () {
        const start = performance.now();
        await accessControlList.logout();
        const end = performance.now();
        console.log(`User logout took ${end - start} milliseconds`);
    });

    it("should measure time for role assignment", async function () {

        const start = performance.now();
        await accessControlList.assignUserRole(user.address, 1); // 1 = UserRole.Admin
        const end = performance.now();
        console.log(`Role assignment took ${end - start} milliseconds`);
    });

    it("should measure time for retrieving users", async function () {
        const start = performance.now();
        await accessControlList.getUsers();
        const end = performance.now();
        console.log(`Retrieving users took ${end - start} milliseconds`);
    });
});
