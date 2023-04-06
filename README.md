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
In the process of initializing the wallet, an object needs to be created through ethers.Wallet, 
This object is associated with the user account, so when it comes to encryption and decryption, 
the secret key of this account will be used for operations.

Note that only the http provider is currently supported here.

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
Use the `ethMessageSigner` method to get the singer created with your private key 
during initialization, and use this signer to encrypt the `message`, 
so the message obtained by `getEthMessageSignature` can only be decrypted
using the message corresponding to the private key from the previous initialization.

```typescript
// this is used sign message by 
const result = await wallet.ethMessageSigner().getEthMessageSignature("message");
```

#### Get Current User Address
The `address` method gets the address corresponding to `your private key`.
```typescript
const address = wallet.address();
```

#### Get Asset Address By Asset Id
Query the assetAddress address by its number in the system, and return a zero address if it does not exist
```typescript
const assetAddress = await wallet.resolveTokenAddress('asset id');
```

#### Get Asset Id By Asset Address
Query the number in the system by assetAddress, if not present, return 0
```typescript
const assetId = await wallet.resolveTokenId('asset address');
```

#### Add Asset
We allow users to add their own assets, but the following conditions must be met<br>
1、We have a maximum number of assets, which can be viewed via the contract's `listingCap` variable, and cannot be added if the current limit has been reached;；<br>
2、When using the addAsset function for the first time<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.1、If it has been added to the whitelist by the administrator and is active, it can be added directly；<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.2、If you are not in the whitelist or in the whitelist inactive state, you need to switch on the current function and pay a certain fee, refer to the value of `listingFee` in the contract；<br>
3、Assets that have already been added cannot be added again；
```typescript
const tokenAddress = 'BEP20 token address';
// Before adding, it is recommended to check whether the asset exists and whether it can be added.
await wallet.addAsset({ tokenAddress });
```

#### Whether The BEP20 Token Is Approved For Deposit
You can check if the assetAddress is allowed to be recharged.
If you need to determine whether a specified amount is allowed, 
you can use the second parameter `erc20ApproveThreshold

```typescript
const isApproved = await wallet.isBEP20DepositsApproved('BEP20 asset address');
```

#### Approve BEP20 Token For Deposit
Reference BEP20 approve
```typescript
const result = await wallet.approveBEP20TokenDeposits('BEP20 address');
// You can check if it is successful approved by the following method
const isApproved = await wallet.isBEP20DepositsApproved("BEP20 address");
```

#### Deposit BNB
Query the token address by `resolveTokenAddress` and then call `deposit`, 
the specific deposit logic can be referred to the description of Deposit BEP20.

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
const approveTx = await wallet.approveForAllERC721TokenDeposits('nft address');
// You can check if it is successful approved by the following method
const isApproved = await wallet.isERC721DepositsApprovedForAll('nft address');

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
If you want to have your own exclusive ERC721, you can create it by this method, 
if the operation is successful, you can have your own exclusive collection in
other markets when you extract NFT from zkbnb; if you use the default one, 
the collection you belong to after extraction is not owned by the user.

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
You can use the `getNFTAddress` method to get the address of the specified creator, 
collectionId of the corresponding factory, or return the default address if it has not been registered before.

```typescript
const creatorAddress = 'collection creator\'s wallet address';
const collectionId = 1;
// if zero address is returned, it means a dedicated nft address can be bound
const nftAddress = await wallet.getNFTAddress(creatorAddress, collectionId);
```

#### Get NFT tokenURI
If the URI has been set, the corresponding information can be obtained by this method, 
if not, the information obtained will change according to the nftContentHash and is not guaranteed to be the available URI.
```typescript
const nftContentType = 0; // 0-ipfs, 1-Greenfield
const nftContentHash = 'nft content hash';
const tokenURI = await wallet.getNftTokenURI(nftContentType, nftContentHash);
```

#### Get Pending Balance
You can get the balance that the user can represent in zkBNB
```typescript
// Please change the value of the parameter according to the actual situation
const address = 'wallet address';
const assetAddress = 'asset address';

const pendingBalance = await wallet.getPendingBalance(address, assetAddress);
```

#### Get Token Balance On BSC
Check the user's balance in assetAddress
```typescript
const pendingBalance = await wallet.getTokenBalance('asset address');
```
