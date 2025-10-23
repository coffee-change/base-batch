// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IAaveContract} from "./interfaces/IAaveContract.sol";
import {OracleReader} from "./OracleReader.sol";

contract CoffeeChangeV2 {
    error CoffeeChangeV2__CannotBeLessThanOrEqualToZero();

    address public constant AAVE_CONTRACT = 0x0568130e794429D2eEBC4dafE18f25Ff1a1ed8b6;
    address private constant NULL_ADDRESS = 0x8bAB6d1b75f19e9eD9fCe8b9BD338844fF79aE27;
    uint16 private constant AAVE_REFERRAL_CODE = 0;
    uint256 private constant PRECENTAGE_PRECISION = 100;
    uint256 private constant TEN_YEARS_TIMESTAMP = 315569260;

    OracleReader public oracleReader;

    uint256 public s_balanceOfContractInEth;


    struct UserPosition {
        uint256 depositsInContract;
        uint256 depositedInAave;
        uint256 userFirstContributionTimestamp;
        uint256 timestampToWithdraw;
    }

    mapping (address => UserPosition) public s_userPositions;

    modifier cannotLessThanZero(uint256 _amount) {
        if(_amount <= 0) {
            revert CoffeeChangeV2__CannotBeLessThanOrEqualToZero();
        }
        _;
    }

    constructor(address _oracleReader) {
        oracleReader = OracleReader(_oracleReader);
    }


    function userDepositEth() public payable cannotLessThanZero(msg.value){
        s_balanceOfContractInEth += msg.value;
        s_userPositions[msg.sender].depositsInContract += msg.value;

        // Set first contribution timestamp if this is the user's first deposit
        if (s_userPositions[msg.sender].userFirstContributionTimestamp == 0) {
            s_userPositions[msg.sender].userFirstContributionTimestamp = block.timestamp;
            s_userPositions[msg.sender].timestampToWithdraw = s_userPositions[msg.sender].userFirstContributionTimestamp + TEN_YEARS_TIMESTAMP;
        }

        // Supply the deposited ETH to Aave
        supplyToAave(msg.value);
    }

    function supplyToAave(uint256 _amountToSupply) internal {
        // Supply ETH to Aave - must send the value with the call
        IAaveContract(AAVE_CONTRACT).depositETH{value: _amountToSupply}(
            NULL_ADDRESS,
            msg.sender,
            AAVE_REFERRAL_CODE
        );
        s_userPositions[msg.sender].depositedInAave += _amountToSupply;
    }

    function getBalanceInUsdValue() public view returns (uint256){
        uint256 deposits = s_userPositions[msg.sender].depositedInAave;
        uint256 ethValueInUsd;
        (ethValueInUsd,) = oracleReader.read();
        return deposits * ethValueInUsd;
    }
}