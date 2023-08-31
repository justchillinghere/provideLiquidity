// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IAddLiquidity.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import "./interfaces/IERC20.sol";

contract AddLiquidity is IAddLiquidity {
    IUniswapV2Router02 public uniswapV2Router;
    IUniswapV2Factory public uniswapV2Factory;

    constructor(address _router, address _factory) {
        uniswapV2Router = IUniswapV2Router02(_router);
        uniswapV2Factory = IUniswapV2Factory(_factory);
    }
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external returns (uint amountA, uint amountB, uint liquidity) {
        IERC20 tokenA = IERC20(_tokenA);
        IERC20 tokenB = IERC20(_tokenB);
		uint sentTokenA;
		uint sentTokenB;
		uint mintedLiquidity;
        require(
            tokenA.allowance(msg.sender, address(uniswapV2Router)) >= _amountA,
            "Allowance for token A less than desired. Please approve the required amount"
        );
        require(
            tokenB.allowance(msg.sender, address(uniswapV2Router)) >= _amountB,
            "Allowance for token B less than desired. Please approve the required amount"
        );
        (sentTokenA, sentTokenB, mintedLiquidity) = uniswapV2Router.addLiquidity(
            _tokenA,
            _tokenB,
            _amountA,
            _amountB,
            0,
            0,
            msg.sender,
            block.timestamp + (5 minutes)
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
