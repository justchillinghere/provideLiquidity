//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

interface IAddLiqudity {
	event AddedLiquidity(address TokenA,
		address TokenB, 
		address creator, 
		address LPpair);
	
	function AddLiquidity(address _TokenA,
		address _TokenB,
		uint256 amountA,
		uint256 amountB) external returns(address);
}
