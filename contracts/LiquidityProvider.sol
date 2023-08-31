// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./interfaces/IAddLiquidity.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import "./interfaces/IERC20.sol";

contract AddLiquidity is IAddLiqudity {
    IUniswapV2Router02 public uniswapV2Router;
    IUniswapV2Factory public uniswapV2Factory;

    constructor(address _router, address _factory) {
        uniswapV2Router = IUniswapV2Router02(_router);
        uniswapV2Factory = IUniswapV2Factory(_factory);
    }

    function addLiquidity(
        address _TokenA,
        address _TokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external returns (uint amountA, uint amountB, uint liquidity) {
        IERC20 tokenA = IERC20(_TokenA);
        IERC20 tokenB = IERC20(_TokenB);
        address pair;
        require(
            tokenA.allowance(msg.sender, address(uniswapV2Router)) >= _amountA,
            "Not enough allowance for token A"
        );
        require(
            tokenB.allowance(msg.sender, address(uniswapV2Router)) >= _amountB,
            "Not enough allowance for token B"
        );
        pair = uniswapV2Factory.getPair(_TokenA, _TokenB);
        return
            uniswapV2Router.addLiquidity(
                _TokenA,
                _TokenB,
                _amountA,
                _amountB,
                0,
                0,
                msg.sender,
                block.timestamp + (5 minutes)
            );
    }
}
