// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract AccessControlList is Ownable(msg.sender) {

    enum UserRole { Owner, Admin, User }

    struct User { 
        address userAddress;
        UserRole userRole;  
    }
    mapping(address => User) public users;
    mapping(address => bool) public loggedInUsers;
    address[] public userAddresses;


    event UserLoggedIn(address user);
    event UserLoggedOut(address user);
    event UserRoleAssigned(address user, UserRole role);
    event UserAccessRecorded(address user, bool loggedIn, uint timestamp);

    modifier onlyAdminOrOwner() {
        require(users[msg.sender].userRole == UserRole.Admin || users[msg.sender].userRole == UserRole.Owner, "Only admins or owner can access this resource");
        _;
    }

    constructor() {
        // Assign the contract creator as owner
        users[msg.sender] = User(msg.sender, UserRole.Owner);
        userAddresses.push(msg.sender);
        emit UserRoleAssigned(msg.sender, UserRole.Owner);
    }

    function login() external {
        require(users[msg.sender].userAddress != address(0), "User not registered");
        require(!loggedInUsers[msg.sender], "User already logged in");
        loggedInUsers[msg.sender] = true;
        emit UserLoggedIn(msg.sender);
        emit UserAccessRecorded(msg.sender, true, block.timestamp);
    }

    function logout() external {
        require(loggedInUsers[msg.sender], "User not logged in");
        loggedInUsers[msg.sender] = false;
        emit UserLoggedOut(msg.sender);
        emit UserAccessRecorded(msg.sender, false, block.timestamp);
    }

    function registerUser(address _user, UserRole _role) external onlyOwner {
        require(users[_user].userAddress == address(0), "User already registered");
        users[_user] = User(_user, _role);
        userAddresses.push(_user);
        emit UserRoleAssigned(_user, _role);
    }

    function assignUserRole(address _user, UserRole _role) external onlyAdminOrOwner {
        require(users[_user].userAddress != address(0), "User not registered");
        require(users[_user].userRole != UserRole.Owner, "Cannot change Owner's role");
        users[_user].userRole = _role;
        emit UserRoleAssigned(_user, _role);
    }

    function getUserRole(address _user) external view returns (UserRole) {
        return users[_user].userRole;
    }

    function getUsers() external view returns (address[] memory, UserRole[] memory) {
        uint256 userCount = userAddresses.length;
        address[] memory addresses = new address[](userCount);
        UserRole[] memory roles = new UserRole[](userCount);

        for (uint256 i = 0; i < userCount; i++) {
            addresses[i] = userAddresses[i];
            roles[i] = users[userAddresses[i]].userRole;
        }

        return (addresses, roles);
    }

}