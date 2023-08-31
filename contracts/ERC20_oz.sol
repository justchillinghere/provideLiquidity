// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenB is ERC20 {
	constructor() ERC20("TokenB", "TKB") {
		_mint(msg.sender, 10 ether);
	}
}
