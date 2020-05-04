pragma solidity 0.6.6;

import '../../../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import './RewardsTandil.sol';
import './InfractionFactory.sol';

contract Infraction {
    enum Stages {
        CREATED,
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

    Stages public stage;
    InfractionFactory public factory;
    RewardsTandil public rewards;

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

    constructor(address _factory, address _rewards) public  {
        factory = InfractionFactory(_factory);
        rewards = RewardsTandil(_rewards);
        stage = Stages.CREATED;
    }

    // State Machine

    function addProof(string memory _url) public {
        if (stage == Stages.REJECTED_BY_COMMUNITY) {
            stage = Stages.COMMUNITY_REVIEW;
        }
        if (stage == Stages.REJECTED_BY_DEPERMENT) {
            stage = Stages.DEPARTMENT_REVIEW;
        }
        if (stage == Stages.REJECTED_BY_COURT) {
            stage = Stages.COURT_REVIEW;
        }
        emit newProof(_url);
    }

    function setReady() public atStage(Stages.CREATED) {
        emit ready();
        stage = Stages.COMMUNITY_REVIEW;
    }

    function communityRejects() public atStage(Stages.COMMUNITY_REVIEW) {
        emit rejectedByCommunity();
        stage = Stages.REJECTED_BY_COMMUNITY;
    }

    function communityApproves() public atStage(Stages.COMMUNITY_REVIEW) {
        emit approvedByComunity();
        stage = Stages.DEPARTMENT_REVIEW;
    }

    function departamentApproves() public atStage(Stages.DEPARTMENT_REVIEW){
        emit approvedByDepartment();
        stage = Stages.COURT_REVIEW;
    }

    function departamentRejects() public atStage(Stages.DEPARTMENT_REVIEW){
        emit rejectedByDepartment();
        stage = Stages.REJECTED_BY_DEPERMENT;
    }

    function courtApproves() public atStage(Stages.COURT_REVIEW) {
        emit approvedByCourt();
        stage = Stages.VOLUNTARY_PAYMENT_PERIOD;
    }

    function courtRejects() public atStage(Stages.COURT_REVIEW) {
        emit rejectedByCourt();
        stage = Stages.REJECTED_BY_COURT;
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
}