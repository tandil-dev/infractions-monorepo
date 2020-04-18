pragma solidity 0.6.6;

contract Infraction  {
    enum Stages {
        REVISION_COMUNITARIA,
        REVISION_EN_DEPARTAMENTO,
        REVISION_EN_JUZGADO,
        APROBADA_EN_JUZGADO,
        PAGO_VOLUNTARIO,
        PAGO_REGULAR,
        PAGO_REGULAR_VENCIDO,
        PERIODO_EXTRA,
        ABONADA,
        RECLAMADA,
        RECHAZADA_POR_COMUNIDAD,
        RECHAZADA_POR_DEPARTAMENTO,
        RECHAZADA_POR_JUZGADO,
        RECHAZO_DEFINITIVO
    }

    Stages public stage = Stages.REVISION_COMUNITARIA;

    modifier atStage(Stages _stage) {
        require(stage == _stage, 'Invalid stage');
        _;
    }

    modifier onlyRejected() {
        require(
            stage == Stages.RECHAZADA_POR_COMUNIDAD ||
            stage == Stages.RECHAZADA_POR_DEPARTAMENTO ||
            stage == Stages.RECHAZADA_POR_JUZGADO,
            'Only previously rejected');
        _;
    }

    modifier onlyIssued() {
        require(
            stage == Stages.PAGO_VOLUNTARIO ||
            stage == Stages.PAGO_REGULAR ||
            stage == Stages.PAGO_REGULAR_VENCIDO ||
            stage == Stages.PERIODO_EXTRA,
            'Only issued');
        _;
    }

    // REVISION_COMUNITARIA ->  REVISION_EN_DEPARTAMENTO
    event approvedByComunity();
    event rejectedByCommunity();
    event newComunityProofs();

    // REVISION_EN_DEPARTAMENTO -> REVISION_EN_JUZGADO
    event approvedByDepartment();
    event rejectedByDepartment();
    event newDepartmentProofs();

    // REVISION_EN_JUZGADO -> APROBADA_EN_JUZGADO
    event approvedByCourt();
    event rejectedByCourt();
    event newCourtProofs();

    // APROBADA_EN_JUZGADO -> PAGO_VOLUNTARIO
    event volunteerPaimentPeriodEnds();

    // PAGO_VOLUNTARIO -> PAGO_REGULAR
    event regularPaimentPeriodEnds();

    // PAGO_REGULAR -> PAGO_VENCIDO
    event overduePaimentPeriodEnds();

    // * -> ABONADA
    event paid();

    // ABONADA -> RECLAMADA
    event claimed();

    // * -> RECHAZO_DEFINITIVO
    event rejected();

    constructor() public {
        stage = Stages.REVISION_COMUNITARIA;
    }

    // State Machine

    function addProofs() public {
        if (stage == Stages.RECHAZADA_POR_COMUNIDAD) {
            emit newComunityProofs();
            stage = Stages.REVISION_COMUNITARIA;
        }
        if (stage == Stages.RECHAZADA_POR_DEPARTAMENTO) {
            emit newDepartmentProofs();
            stage = Stages.REVISION_EN_DEPARTAMENTO;
        }
        if (stage == Stages.RECHAZADA_POR_JUZGADO) {
            emit newCourtProofs();
            stage = Stages.REVISION_EN_JUZGADO;
        }
    }

    function communityRejects() public atStage(Stages.REVISION_COMUNITARIA){
        emit rejectedByCommunity();
        stage = Stages.RECHAZADA_POR_COMUNIDAD;
    }

    function communityApproves() public atStage(Stages.REVISION_COMUNITARIA){
        emit approvedByComunity();
        stage = Stages.REVISION_EN_DEPARTAMENTO;
    }

    function departamentApproves() public atStage(Stages.REVISION_EN_DEPARTAMENTO){
        emit approvedByDepartment();
        stage = Stages.REVISION_EN_JUZGADO;
    }

    function departamentRejects() public atStage(Stages.REVISION_EN_DEPARTAMENTO){
        emit rejectedByDepartment();
        stage = Stages.RECHAZADA_POR_DEPARTAMENTO;
    }

    function courtApproves() public atStage(Stages.REVISION_EN_JUZGADO){
        emit approvedByCourt();
        stage = Stages.PAGO_VOLUNTARIO;
    }

    function courtRejects() public atStage(Stages.REVISION_EN_JUZGADO){
        emit rejectedByCourt();
        stage = Stages.RECHAZADA_POR_JUZGADO;
    }

    function endVolunteerPayment() public atStage(Stages.PAGO_VOLUNTARIO){
        emit volunteerPaimentPeriodEnds();
        stage = Stages.PAGO_REGULAR;
    }

    function endRegularPayment() public atStage(Stages.PAGO_REGULAR){
        emit regularPaimentPeriodEnds();
        stage = Stages.PAGO_REGULAR_VENCIDO;
    }

    function endOverduePayment() public atStage(Stages.PAGO_REGULAR_VENCIDO){
        emit overduePaimentPeriodEnds();
        stage = Stages.PERIODO_EXTRA;
    }

    function setPaid() public onlyIssued() {
        emit paid();
        stage = Stages.ABONADA;
    }

    function setClaimed() public atStage(Stages.ABONADA){
        emit claimed();
        stage = Stages.RECLAMADA;
    }

    function reject() public onlyRejected() {
        emit rejected();
        stage = Stages.RECHAZO_DEFINITIVO;
    }
}