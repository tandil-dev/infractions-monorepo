pragma solidity 0.6.6;

import '../../../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../../../node_modules/@openzeppelin/contracts/access/AccessControl.sol';
import './Infraction.sol';

contract InfractionFactory is Ownable, AccessControl {
    mapping(address => Infraction[]) infractionsByUser;
    mapping(address => uint) amountOfInfractionsByUser;

    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");

    event infractionCreated(address infractionAddress);

    constructor() public Ownable() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function createInfraction() public returns(address){
        Infraction i = new Infraction();

        Infraction[] storage userInfractions = infractionsByUser[_msgSender()];
        userInfractions.push(i);

        amountOfInfractionsByUser[_msgSender()] = userInfractions.length;
        emit infractionCreated(address(i));
    }

    function getAmountOfInfractionByUser(address _userAddress) public view returns(uint) {
        return amountOfInfractionsByUser[_userAddress];
    }

    function getAddressByUserAndIndex(address _userAddress, uint _index) public view returns(address) {
        return address(infractionsByUser[_userAddress][_index]);
    }
}