pragma solidity 0.6.8;

import '../../../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import './RewardsTandil.sol';
import './InfractionFactory.sol';

contract Infraction is Ownable {
    enum Stages {
        COMMUNITY_REVIEW,
        DEPARTMENT_REVIEW,
        COURT_REVIEW,
        APPROVED_BY_COURT,
        VOLUNTARY_PAYMENT_PERIOD,
        REGULAR_PAYMENT_PERIOD,
        DUE_REGULAR_PAYMENT_PERIOD,
        EXTRA_PERIOD,
        PAID,
        CALIMED,
        REJECTED_BY_COMMUNITY,
        REJECTED_BY_DEPERMENT,
        REJECTED_BY_COURT,
        REJECTED
    }

    uint8 public requitedVotes = 3;

    Stages public stage;
    InfractionFactory public factory;
    RewardsTandil public rewards;
    string public infractionDataHash;
    string public domainImageHash;
    address[] public saidYes;
    address[] public saidNo;
    mapping (address => bool) public hasVoted;

    modifier atStage(Stages _stage) {
        require(stage == _stage, 'Invalid stage');
        _;
    }

    modifier onlyRejected() {
        require(
            stage == Stages.REJECTED_BY_COMMUNITY ||
            stage == Stages.REJECTED_BY_DEPERMENT ||
            stage == Stages.REJECTED_BY_COURT,
            'Only previously rejected');
        _;
    }

    modifier onlyIssued() {
        require(
            stage == Stages.VOLUNTARY_PAYMENT_PERIOD ||
            stage == Stages.REGULAR_PAYMENT_PERIOD ||
            stage == Stages.DUE_REGULAR_PAYMENT_PERIOD ||
            stage == Stages.EXTRA_PERIOD,
            'Only issued');
        _;
    }

    // PROOFS
    event newProof(string url);

    // CREATED -> COMMUNITY_REVIEW
    event ready();

    // COMMUNITY_REVIEW ->  DEPARTMENT_REVIEW
    event approvedByComunity();
    event rejectedByCommunity();

    // DEPARTMENT_REVIEW -> COURT_REVIEW
    event approvedByDepartment();
    event rejectedByDepartment();

    // COURT_REVIEW -> APPROVED_BY_COURT
    event approvedByCourt();
    event rejectedByCourt();

    // APPROVED_BY_COURT -> VOLUNTARY_PAYMENT_PERIOD
    event volunteerPaimentPeriodEnds();

    // VOLUNTARY_PAYMENT_PERIOD -> PAGO_REGULAR
    event regularPaimentPeriodEnds();

    // REGULAR_PAYMENT_PERIOD-> PAGO_VENCIDO
    event overduePaimentPeriodEnds();

    // * -> PAID
    event paid();

    // PAID -> CALIMED
    event claimed();

    // * -> REJECTED
    event rejected();

    constructor(
        address _factory,
        address _rewards,
        string memory _infractionDataHash,
        string memory _domainImageHash
    ) public  Ownable() {
        factory = InfractionFactory(_factory);
        rewards = RewardsTandil(_rewards);
        stage = Stages.COMMUNITY_REVIEW;
        infractionDataHash = _infractionDataHash;
        domainImageHash = _domainImageHash;
    }

    // State Machine

    function addProof(string memory _url) public {
        if (stage == Stages.REJECTED_BY_COMMUNITY) {
            requitedVotes = requitedVotes * 2 + 1; // Double votes required
            stage = Stages.COMMUNITY_REVIEW;
            factory.addInfractionForVote();
        }
        if (stage == Stages.REJECTED_BY_DEPERMENT) {
            stage = Stages.DEPARTMENT_REVIEW;
            factory.addInfractionForDepartmentReview();
        }
        if (stage == Stages.REJECTED_BY_COURT) {
            stage = Stages.COURT_REVIEW;
            factory.addInfractionForJudgeReview();
        }
        emit newProof(_url);
    }

    function communityRejects() public atStage(Stages.COMMUNITY_REVIEW) {
        emit rejectedByCommunity();
        stage = Stages.REJECTED_BY_COMMUNITY;
    }

    function communityApproves() public atStage(Stages.COMMUNITY_REVIEW) {
        emit approvedByComunity();
        stage = Stages.DEPARTMENT_REVIEW;
    }

    function departamentApproves() public atStage(Stages.DEPARTMENT_REVIEW) {
        emit approvedByDepartment();
        stage = Stages.COURT_REVIEW;
        factory.removeInfractionForDepartmentReview();
        factory.addInfractionForJudgeReview();
    }

    function departamentRejects() public atStage(Stages.DEPARTMENT_REVIEW){
        emit rejectedByDepartment();
        stage = Stages.REJECTED_BY_DEPERMENT;
        factory.removeInfractionForDepartmentReview();
    }

    function courtApproves() public atStage(Stages.COURT_REVIEW) {
        emit approvedByCourt();
        stage = Stages.VOLUNTARY_PAYMENT_PERIOD;
        factory.removeInfractionForJudgeReview();
    }

    function courtRejects() public atStage(Stages.COURT_REVIEW) {
        emit rejectedByCourt();
        stage = Stages.REJECTED_BY_COURT;
        factory.removeInfractionForJudgeReview();
    }

    function endVolunteerPayment() public atStage(Stages.VOLUNTARY_PAYMENT_PERIOD){
        emit volunteerPaimentPeriodEnds();
        stage = Stages.REGULAR_PAYMENT_PERIOD;
    }

    function endRegularPayment() public atStage(Stages.REGULAR_PAYMENT_PERIOD){
        emit regularPaimentPeriodEnds();
        stage = Stages.DUE_REGULAR_PAYMENT_PERIOD;
    }

    function endOverduePayment() public atStage(Stages.DUE_REGULAR_PAYMENT_PERIOD){
        emit overduePaimentPeriodEnds();
        stage = Stages.EXTRA_PERIOD;
    }

    function setPaid() public onlyIssued() {
        emit paid();
        stage = Stages.PAID;
    }

    function setClaimed() public atStage(Stages.PAID) {
        emit claimed();
        stage = Stages.CALIMED;
    }

    function reject() public onlyRejected() {
        emit rejected();
        stage = Stages.REJECTED;
    }

    function vote(bool _vote) public atStage(Stages.COMMUNITY_REVIEW){
        require(!hasVoted[_msgSender()], 'Already voted');

        hasVoted[_msgSender()] = true;
        if (_vote) {
            saidYes.push(_msgSender());
        } else {
            saidNo.push(_msgSender());
        }
        if (getTotalYes() > requitedVotes) {
            communityApproves();
            factory.removeInfractionForVote();
            factory.addInfractionForDepartmentReview();
        }
        if (getTotalNo() > requitedVotes) {
            communityRejects();
            factory.removeInfractionForVote();
        }
    }

    function getTotalYes() public view returns (uint) {
        return saidYes.length;
    }

    function getTotalNo() public view returns (uint) {
        return saidNo.length;
    }

    function getTotalVoters() public view returns (uint) {
        return saidYes.length + saidNo.length;
    }
}