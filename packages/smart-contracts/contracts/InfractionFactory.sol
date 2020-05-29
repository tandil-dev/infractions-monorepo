pragma solidity 0.6.8;

import '../../../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import './Infraction.sol';
import './RewardsTandil.sol';
import './Roles.sol';

contract InfractionFactory is Ownable {
    mapping(address => Infraction[]) infractionsByUser;
    mapping(address => uint) amountOfInfractionsByUser;
    mapping(address => address) InfractionCreatedBy;

    address[] public infractionsForVote;
    mapping(address => uint) public indexOfInfractionForVote;

    address[] public infractionsForDepartmentReview;
    mapping(address => uint) public indexOfInfractionForDepartmentReview;

    address[] public infractionsForJudgeReview;
    mapping(address => uint) public indexOfInfractionForJudgeReview;

    event infractionCreated(address infractionAddress, address createdBy);

    RewardsTandil rewards;
    constructor(address _rewardsContract) public Ownable() {
        rewards = RewardsTandil(_rewardsContract);
    }

    function createInfraction(
        string memory infractionData,
        string memory infractionVideoUrl,
        string memory infractionDomainUrl
        ) public returns(address newInfractionAddress) {
        require(address(rewards) != address(0), 'Set rewards before');

        Infraction i = new Infraction(
            address(this),
            address(rewards),
            infractionData,
            infractionVideoUrl,
            infractionDomainUrl
        );

        Infraction[] storage userInfractions = infractionsByUser[_msgSender()];
        userInfractions.push(i);

        infractionsForVote.push(address(i));
        indexOfInfractionForVote[address(i)] = infractionsForVote.length - 1;

        amountOfInfractionsByUser[_msgSender()] = userInfractions.length;
        InfractionCreatedBy[address(i)] = _msgSender();
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

    function getTotalInfactinsForVote() public view returns(uint) {
        return infractionsForVote.length;
    }

    function removeInfractionForVote() public {
        uint index = indexOfInfractionForVote[_msgSender()];
        require(infractionsForVote[index] == _msgSender(), 'Only infraction contract can remove self');
        require(index < infractionsForVote.length, 'Index out of range');
        indexOfInfractionForVote[_msgSender()] = 0;

        for (uint i = index; i < infractionsForVote.length - 1; i++){
            infractionsForVote[i] = infractionsForVote[i + 1];
            indexOfInfractionForVote[infractionsForVote[i]] = indexOfInfractionForVote[infractionsForVote[i]] - 1;
        }
        infractionsForVote.pop();
    }

    function addInfractionForVote() public {
        infractionsForVote.push(address(_msgSender()));
        indexOfInfractionForVote[address(_msgSender())] = infractionsForVote.length - 1;
    }

    function getTotalInfactinsForDepartmentReview() public view returns(uint) {
        return infractionsForDepartmentReview.length;
    }

    function removeInfractionForDepartmentReview() public {
        uint index = indexOfInfractionForDepartmentReview[_msgSender()];
        require(infractionsForDepartmentReview[index] == _msgSender(), 'Only infraction contract can remove self');
        require(index < infractionsForDepartmentReview.length, 'Index out of range');
        indexOfInfractionForDepartmentReview[_msgSender()] = 0;

        for (uint i = index; i < infractionsForDepartmentReview.length - 1; i++){
            infractionsForDepartmentReview[i] = infractionsForDepartmentReview[i + 1];
            indexOfInfractionForDepartmentReview[
                infractionsForDepartmentReview[i]
                ] = indexOfInfractionForDepartmentReview[infractionsForDepartmentReview[i]] - 1;
        }
        infractionsForDepartmentReview.pop();
    }

    function addInfractionForDepartmentReview() public {
        infractionsForDepartmentReview.push(address(_msgSender()));
        indexOfInfractionForDepartmentReview[address(_msgSender())] = infractionsForDepartmentReview.length - 1;
    }

    function getTotalInfactinsForJudgeReview() public view returns(uint) {
        return infractionsForJudgeReview.length;
    }

    function removeInfractionForJudgeReview() public {
        uint index = indexOfInfractionForJudgeReview[_msgSender()];
        require(infractionsForJudgeReview[index] == _msgSender(), 'Only infraction contract can remove self');
        require(index < infractionsForJudgeReview.length, 'Index out of range');
        indexOfInfractionForJudgeReview[_msgSender()] = 0;

        for (uint i = index; i < infractionsForJudgeReview.length - 1; i++){
            infractionsForJudgeReview[i] = infractionsForJudgeReview[i + 1];
            indexOfInfractionForJudgeReview[
                infractionsForJudgeReview[i]
                ] = indexOfInfractionForJudgeReview[infractionsForJudgeReview[i]] - 1;
        }
        infractionsForJudgeReview.pop();
    }

    function addInfractionForJudgeReview() public {
        infractionsForJudgeReview.push(address(_msgSender()));
        indexOfInfractionForJudgeReview[address(_msgSender())] = infractionsForJudgeReview.length - 1;
    }
}