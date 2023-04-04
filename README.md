## ZkBNB L1 Client

### Install

Using npm:

```bash
> npm install @bnb-chain/zkbnb-js-l1-sdk
```

Using yarn:

```bash
> yarn add @bnb-chain/zkbnb-js-l1-sdk
```

Using pnpm:

```bash
> pnpm add @bnb-chain/zkbnb-js-l1-sdk
```

### Usage

#### Init
```typescript
import { Wallet, Provider, getZkBNBDefaultProvider } from '@bnb-chain/zkbnb-js-l1-sdk';

const rpcEndpoint = 'https://data-seed-prebsc-2-s1.binance.org:8545'; // bsc testnest rpc
const ethWallet = new ethers.Wallet(
  'your private key',
  new ethers.providers.JsonRpcProvider(rpcEndpoint)
);
const provider = getZkBNBDefaultProvider('bscTestnet'); // bsc or bscTestnet
// or by this method
// const testEndpoint = 'https://testapi.zkbnbchain.org'; // bsc testnest
// const provider = await Provider.newHttpProvider(testEndpoint);
const wallet = await Wallet.fromZkBNBSigner(ethWallet, provider);
```

#### Sign message
```typescript
// this is used sign message by 
const result = await provider.ethMessageSigner().getEthMessageSignature("message");
```

#### Get Current User Address
```typescript
const address = provider.address();
```

#### Get Asset Address By Asset Id
```typescript
const assetAddress = await wallet.resolveTokenAddress('asset id');
```

#### Get Asset Id By Asset Address
```typescript
const assetId = await wallet.resolveTokenId('asset address');
```

#### Add Asset
```typescript
const tokenAddress = 'BEP20 token address';
// Before adding, it is recommended to check whether the asset exists and whether it can be added.
await wallet.addAsset({ tokenAddress });
```

#### Whether The BEP20 Token Is Approved For Deposit
```typescript
const isApproved = await wallet.isBEP20DepositsApproved('BEP20 asset address');
```

#### Approve BEP20 Token For Deposit
```typescript
const result = await wallet.approveBEP20TokenDeposits('BEP20 address');
// You can check if it is successful approved by the following method
const isApproved = await wallet.isBEP20DepositsApproved("BEP20 address");
```

#### Deposit BNB
```typescript
const tokenAddress = await wallet.resolveTokenAddress(0);
const result = await wallet.deposit({
  to: wallet.address(),
  tokenAddress: "0x0000000000000000000000000000000000000000",
  amount: ethers.utils.parseEther('0.001'),
});
```

#### Deposit BEP20
Deposit funds from the BSC to the zkBNB.

To do the BEP20 token transfer, this token transfer should be approved. User can make BEP20 deposits approved forever using approveBEP20TokenDeposits("token address"), or the user can approve the exact amount (required for a deposit) upon each deposit using approveBEP20TokenDeposits("token address", "exact amount"), but this is not recommended.
```typescript
const result = await wallet.deposit({
  to: wallet.address(),
  tokenAddress: 'BEP20 Address',
  amount: ethers.utils.parseEther('0.001'),
});
```

#### Approve NFT For Deposit
```typescript
const approveTx = await this.approveForAllERC721TokenDeposits('nft address');
// You can check if it is successful approved by the following method
const isApproved = await this.isERC721DepositsApprovedForAll('nft address');

```

#### Deposit NFT
Deposit NFT from BSC to zkBNB, Only supports the nft created by zkBNB.

To do the NFT transfer, this transfer should be approved by approveForAllERC721TokenDeposits("nft address") once.

```typescript
const depositResult = await wallet.depositNFT({
    to: 'wallet address', // which address to deposit to
    tokenAddress: 'nft address',
    tokenId: 'nft ID',
});
```

#### FullExit
Withdraw BNB or BEP20 from zkBNB to BSC
```typescript
const result = await wallet.requestFullExit({
    tokenAddress: 'asset address',
    accountIndex: 'account index',
});
```

#### FullExit Nft
Withdraw NFT from zkBNB to BSC
```typescript
const requestResult = await wallet.requestFullExitNft({
    tokenId: 'nft ID',
    accountIndex: 'account index',
});
```

#### Register A Dedicated NFT Contract For A Collection
```typescript
const name = 'collection name';
const symbol = 'collection symbol';
const collectionId = 'collection Id';
await wallet.deployAndRegisterNFTFactory({
    collectionId,
    name,
    symbol,
});
```

#### Get NFT Address By Collection's Creator Address And Collection ID
```typescript
const creatorAddress = 'collection creator\'s wallet address';
const collectionId = 1;
// if zero address is returned, it means a dedicated nft address can be bound
const nftAddress = await wallet.getNFTAddress(creatorAddress, collectionId);
```

#### Get NFT tokenURI
```typescript
const nftContentType = 0; // 0-ipfs, 1-Greenfield
const nftContentHash = 'nft content hash';
const tokenURI = await wallet.getNftTokenURI(nftContentType, nftContentHash);
```

#### Get Pending Balance
```typescript
// Please change the value of the parameter according to the actual situation
const address = 'wallet address';
const assetAddress = 'asset address';

const pendingBalance = await wallet.getPendingBalance(address, assetAddress);
```
