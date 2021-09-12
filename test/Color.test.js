const { assert } = require('chai');

const Color = artifacts.require('Color.sol');

require('chai')
	.use(require('chai-as-promised'))
	.should();

contract('Color', (accounts) => {
	let contract;
	before(async () => {
		contract = await Color.deployed();
	});
	describe('deployment', async () => {
		it('deploys successfully!', async () => {
			const address = contract.address;
			assert.notEqual(address, '', 'address is blank');
			assert.notEqual(address, 0x0, 'address is 0x0');
			assert.notEqual(address, null, 'address is null');
			assert.notEqual(address, undefined, 'address is undefined');
		});

		it('has a name', async () => {
			const name = await contract.name();
			assert.equal(name, 'Color', 'name is not Color');
		});

		it('has a symbol', async () => {
			const symbol = await contract.symbol();
			assert.equal(symbol, 'COLOR', 'symbol is not COLOR');
		});
	});

	describe('minting', async () => {
		it('creates a new token', async () => {
			const result = await contract.mint('#EC058E');
			const totalSupply = await contract.totalSupply();

			assert.equal(totalSupply, 1, 'total supply is not equal to 1');
			const event = result.logs[0].args;
			assert.equal(event.tokenId.toNumber(), 0, 'event log tokenId is not equal to 1');
			assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from address not correct');
			assert.equal(event.to, accounts[0], 'to address not correct');

			await contract.mint('#EC058E').should.be.rejected;
		});
	});

	describe('indexing', async () => {
		it('lists colors', async () => {
			await contract.mint('#FFFFFF');
			await contract.mint('#000000');
			await contract.mint('#E1E1E1');

			const totalSupply = await contract.totalSupply();

			let color,
				result = [];
			for (var i = 1; i <= totalSupply; i++) {
				color = await contract.colors(i - 1);
				result.push(color);
			}
			let expected = ['#EC058E', '#FFFFFF', '#000000', '#E1E1E1'];
			assert.equal(result.join(','), expected.join(','), 'colors minted not correct');
		});
	});
});
