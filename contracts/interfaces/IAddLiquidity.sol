// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IAddLiquidity {
	event AddedLiquidity(address TokenA,
		address TokenB, 
		address creator, 
		address LPpair);
	
	function addLiquidity(address _TokenA,
		address _TokenB,
		uint256 _amountA,
		uint256 _amountB) external returns (uint amountA, uint amountB, uint liquidity);
}
