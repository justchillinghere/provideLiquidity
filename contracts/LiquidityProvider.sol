// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/ILiquidityProvider.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import "./interfaces/IERC20.sol";

contract LiquidityProvider is ILiquidityProvider {
    IUniswapV2Router02 public uniswapV2Router;
    IUniswapV2Factory public uniswapV2Factory;
	address sender = msg.sender;

    constructor(address _router, address _factory) {
        uniswapV2Router = IUniswapV2Router02(_router);
        uniswapV2Factory = IUniswapV2Factory(_factory);
    }
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external returns (uint sentTokenA, uint sentTokenB, uint mintedLiquidity) {
        IERC20 tokenA = IERC20(_tokenA);
		IERC20 tokenB = IERC20(_tokenB);
        require(tokenA.transferFrom(sender, address(this), _amountA), "Token A transfer failed");
        require(tokenB.transferFrom(sender, address(this), _amountB), "Token B transfer failed");
		tokenA.approve(address(uniswapV2Router), _amountA);
		tokenB.approve(address(uniswapV2Router), _amountB);
        (sentTokenA, sentTokenB, mintedLiquidity) = uniswapV2Router.addLiquidity(
            _tokenA,
            _tokenB,
            _amountA,
            _amountB,
            0,
            0,
            msg.sender,
            block.timestamp
        );
        emit AddedLiquidity(
            _tokenA,
            _tokenB,
            msg.sender,
            uniswapV2Factory.getPair(_tokenA, _tokenB)
        );
        return (sentTokenA, sentTokenB, mintedLiquidity);
    }
}
