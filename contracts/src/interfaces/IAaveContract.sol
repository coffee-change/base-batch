// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IAaveContract {
    function depositETH(address, address onBehalfOf, uint16 referralCode) external payable;
}