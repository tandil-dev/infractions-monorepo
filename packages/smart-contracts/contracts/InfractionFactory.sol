pragma solidity 0.6.6;

import '../../../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import './Infraction.sol';
import './RewardsTandil.sol';
import './Roles.sol';

contract InfractionFactory is Ownable {
    mapping(address => Infraction[]) infractionsByUser;
    mapping(address => uint) amountOfInfractionsByUser;

    event infractionCreated(address infractionAddress, address createdBy);

    RewardsTandil rewards;
    constructor(address _rewardsContract) public Ownable() {
        rewards = RewardsTandil(_rewardsContract);
    }

    function createInfraction(
        string infractionData,
        string infractionVideoUrl,
        string infractionDomainUrl
        ) public returns(address newInfractionAddress) {
        require(address(rewards) != address(0), 'Set rewards before');

        Infraction i = new Infraction(
            address(this), 
            address(rewards)
            infractionData,
            infractionVideoUrl,
            infractionDomainUrl,
        );

        Infraction[] storage userInfractions = infractionsByUser[_msgSender()];
        userInfractions.push(i);

        amountOfInfractionsByUser[_msgSender()] = userInfractions.length;
        emit infractionCreated(address(i), _msgSender());
        return address(i);
    }

    function getAmountOfInfractionByUser(address _userAddress) public view returns(uint) {
        return amountOfInfractionsByUser[_userAddress];
    }

    function getAddressByUserAndIndex(address _userAddress, uint _index) public view returns(address) {
        return address(infractionsByUser[_userAddress][_index]);
    }

    function setRewardsTokenContract(address _rewardsContract) public onlyOwner() {
        rewards = RewardsTandil(_rewardsContract);
    }
}