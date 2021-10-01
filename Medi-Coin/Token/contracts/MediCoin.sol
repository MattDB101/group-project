// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract MediCoin is ERC20{
	constructor() ERC20("MediCoin", "MED"){}
}
