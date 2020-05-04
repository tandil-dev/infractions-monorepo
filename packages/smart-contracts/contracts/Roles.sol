pragma solidity 0.6.6;

import '../../../node_modules/@openzeppelin/contracts/access/AccessControl.sol';

contract Roles is AccessControl {

    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");


    constructor() public {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function addInspector(address newInspector) public {
        grantRole(INSPECTOR_ROLE, newInspector);
    }

    function removeInspector(address inspectorAddress) public {
        revokeRole(INSPECTOR_ROLE, inspectorAddress);
    }

    function addJudge(address newJudge) public {
        grantRole(JUDGE_ROLE, newJudge);
    }

    function removeJudge(address judegeAddress) public {
        revokeRole(JUDGE_ROLE, judegeAddress);
    }
}