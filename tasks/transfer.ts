import { task } from 'hardhat/config'
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';
import { contractAddress } from '../hardhat.config';

task ('transfer', 'Transfer form msg.sender account to another account')
	.addParam('to', 'Recipent user address')
	.addParam('amount', 'Token amount')
	.setAction(async ({to, amount}, { ethers }) => {
		const Token = await ethers.getContractFactory('MyToken');
        const tokenContract = Token.attach(contractAddress!);

		const transferTx: ContractTransaction = await tokenContract.transfer(to, amount);
		const transferReceipt: ContractReceipt = await transferTx.wait();
		const event = transferReceipt.events?.find(event => event.event === 'Transfer');
        const eInitiator: Address = event?.args!['from'];
        const eRecipient: Address = event?.args!['to'];
        const eAmount: BigNumber = event?.args!['value'];
    	console.log(`Sender: ${eInitiator}`);
    	console.log(`Recipient: ${eRecipient}`);
    	console.log(`Amount: ${eAmount}`);
})
