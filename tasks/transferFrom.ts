import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';
import { contractAddress } from '../hardhat.config';

task('transferfrom', 'Transfer tokens from one address to another')
    .addParam('from', 'From whom to transfer address')
    .addParam('to', 'Recipient user address')
    .addParam('amount', 'Token amount')
	.setAction(async ({from, to, amount}, { ethers }) => {
        const Token = await ethers.getContractFactory('MyToken')
        const tokenContract = Token.attach(contractAddress!);

        const contractTx: ContractTransaction = await tokenContract.transferFrom(from, to, amount);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'Transfer');
        const eInitiator: Address = event?.args!['from'];
        const eRecipient: Address = event?.args!['to'];
        const eAmount: BigNumber = event?.args!['value'];            
    	console.log(`Transfer from: ${eInitiator}`)
    	console.log(`Transfer to: ${eRecipient}`)
    	console.log(`Amount: ${eAmount}`)
})
