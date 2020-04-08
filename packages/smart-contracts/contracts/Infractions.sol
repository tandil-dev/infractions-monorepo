pragma solidity 0.6.5;

import '../../../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../../../node_modules/@openzeppelin/contracts/access/AccessControl.sol';

contract Infractions is Ownable, AccessControl {

    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");

    constructor() public Ownable() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }
}