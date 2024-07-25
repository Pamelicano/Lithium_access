const {expect} = require("chai");
const { ethers } = require("hardhat");

describe("AccessControlList", function () {
  let AccessControlList;
  let acl;
  let owner;
  let admin;
  let user;

  beforeEach(async function () {
    [owner, admin, user, other] = await ethers.getSigners();
    AccessControlList = await ethers.getContractFactory("AccessControlList");
    acl = await AccessControlList.deploy();
    await acl.waitForDeployment();
  });
  

  it("should assign the owner role to the contract creator", async function () {
    const role = await acl.getUserRole(owner.address);
    expect(role).to.equal(0); // UserRole.Owner
  });

  it("should allow owner to register a user", async function () {
    await acl.registerUser(admin.address, 1); // UserRole.Admin
    const role = await acl.getUserRole(admin.address);
    expect(role).to.equal(1); // UserRole.Admin
  });

  it("should allow registered users to log in", async function () {
    await acl.registerUser(user.address, 2); // UserRole.User
    await acl.connect(user).login();
    const loggedIn = await acl.loggedInUsers(user.address);
    expect(loggedIn).to.be.true;
  });

  it("should prevent unregistered users from logging in", async function () {
    await expect(acl.connect(user).login()).to.be.revertedWith(
      "User not registered"
    );
  });

  it("should prevent users from logging in twice", async function () {
    await acl.registerUser(user.address, 2);
    await acl.connect(user).login();
    await expect(acl.connect(user).login()).to.be.revertedWith(
      "User already logged in"
    );
  });

  it("should allow logged-in users to log out", async function () {
    await acl.registerUser(user.address, 2);
    await acl.connect(user).login();
    await acl.connect(user).logout();
    const loggedIn = await acl.loggedInUsers(user.address);
    expect(loggedIn).to.be.false;
  });

  it("should prevent users from logging out if not logged in", async function () {
    await expect(acl.connect(user).logout()).to.be.revertedWith(
      "User not logged in"
    );
  });

  it("should allow admins or owners to assign roles", async function () {
    await acl.registerUser(admin.address, 1); // UserRole.Admin
    await acl.registerUser(user.address, 2);  // UserRole.User
    await acl.connect(admin).assignUserRole(user.address, 1);
    const role = await acl.getUserRole(user.address);
    expect(role).to.equal(1); // UserRole.Admin
  });

  it("should prevent changing the owner's role", async function () {
    await expect(
      acl.connect(admin).assignUserRole(owner.address, 1)
    ).to.be.revertedWith("Cannot change Owner's role");
  });

  it("should prevent non-admins or non-owners from assigning roles", async function () {
    await acl.registerUser(user.address, 2); // UserRole.User
    await expect(
      acl.connect(user).assignUserRole(user.address, 1)
    ).to.be.revertedWith("Only admins or owner can access this resource");
  });
  it("should return a list of all users and their roles", async function () {
    await acl.registerUser(admin.address, 1); // UserRole.Admin
    await acl.registerUser(user.address, 2);  // UserRole.User
    await acl.registerUser(other.address, 2); // UserRole.User

    const [addresses, roles] = await acl.getUsers();

    expect(addresses.length).to.equal(4); // Owner + 3 зарегистрированных пользователя

    expect(addresses).to.include(owner.address);
    expect(addresses).to.include(admin.address);
    expect(addresses).to.include(user.address);
    expect(addresses).to.include(other.address);

    const ownerIndex = addresses.indexOf(owner.address);
    const adminIndex = addresses.indexOf(admin.address);
    const userIndex = addresses.indexOf(user.address);
    const otherIndex = addresses.indexOf(other.address);

    expect(roles[ownerIndex]).to.equal(0); // UserRole.Owner
    expect(roles[adminIndex]).to.equal(1); // UserRole.Admin
    expect(roles[userIndex]).to.equal(2); // UserRole.User
    expect(roles[otherIndex]).to.equal(2); // UserRole.User
  });
});