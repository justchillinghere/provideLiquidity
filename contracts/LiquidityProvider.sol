// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./interfaces/AddLiquidity.sol";
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';

contract AddLiquidity is IAddLiqudity{
	IUniswapV2Router02 public uniswapV2Router;
    IUniswapV2Factory public uniswapV2Factory;
	
    constructor(address _router, address _factory) {
        uniswapV2Router = IUniswapV2Router02(_router);
        uniswapV2Factory = IUniswapV2Factory(_factory);
    }
	function pairFound (address _TokenA, address _TokenB) public returns (bool) {
		return (!(uniswapV2Factory.getPair(_TokenA, _TokenB) == address(0)));
	}

}