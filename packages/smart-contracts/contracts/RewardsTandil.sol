pragma solidity 0.6.8;

import "../../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import './Infraction.sol';

contract RewardsTandil is ERC20 {
    constructor() ERC20("Recompensas Tandil", "TNL-RWD") public {
        _setupDecimals(1);
    }

    function claimReward(address infractionAddress) public {
        // Check that sender == infraction owner, and change from paid to claimed
        // Take special care here for reentrancy attack
        Infraction i = Infraction(infractionAddress);
        i.setClaimed();
        _mint(_msgSender(), i.reward());
    }
}