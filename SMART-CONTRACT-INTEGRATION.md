# CoffeeChangeV2 Smart Contract Integration - Complete Guide

## 🎯 Contract Details

**Contract Address (Base Sepolia):** `0x449c5730788b0eebcbFF1D2935Ff107999328D61`

**Main Function:** `userDepositEth()` - Payable function to deposit ETH

**Contract Features:**
- Deposits ETH from users
- Tracks user positions
- Integrates with Aave for yield
- Uses Oracle for ETH/USD pricing

---

## ✅ What's Been Integrated

### 1. **Contract Configuration**
- Updated `DepositCard.js` with CoffeeChangeV2 contract address
- Added complete contract ABI
- Configured to use `userDepositEth()` function

### 2. **Deposit Flow**
When user clicks "Deposit":
1. Validates: Total roundups >= $1.00
2. Calculates required ETH from Oracle price
3. Calls `writeContract()` with:
   - Contract: `0x449c5730788b0eebcbFF1D2935Ff107999328D61`
   - Function: `userDepositEth`
   - Value: Required ETH amount
4. Waits for wallet confirmation
5. Waits for blockchain confirmation
6. Marks roundups as deposited in database
7. Refreshes page to show updated data

### 3. **Transaction Lifecycle**

```
User clicks "Deposit"
    ↓
Loading state: "Confirm in wallet..."
    ↓
User confirms in wallet (MetaMask/Coinbase)
    ↓
Loading state: "Confirming..."
    ↓
Transaction mined on blockchain
    ↓
✅ Success message shown
    ↓
Database updated (status = true)
    ↓
Page refreshes automatically
    ↓
Dashboard shows $0.00 pending
Portfolio shows deposited amount
```

---

## 🔧 Technical Implementation

### Contract Call Structure

```javascript
writeContract({
  address: "0x449c5730788b0eebcbFF1D2935Ff107999328D61",
  abi: COFFEE_CHANGE_ABI,
  functionName: "userDepositEth",
  value: parseEther(requiredETH.toFixed(18))
})
```

### Example Transaction

**User has:**
- Total roundups: $1.50
- ETH price: $2,500 (from Oracle)
- Required ETH: 0.0006 ETH

**Transaction:**
```
To: 0x449c5730788b0eebcbFF1D2935Ff107999328D61
Function: userDepositEth()
Value: 0.0006 ETH
Gas: ~50,000 (estimated)
```

---

## 📊 User Experience Flow

### Step 1: User Has Pending Roundups
```
Dashboard shows:
  Total Roundups: $1.50
  ETH Price: $2,500
  Required ETH: 0.0006 ETH
  Button: "Deposit 0.0006 ETH" (ENABLED)
```

### Step 2: User Clicks Deposit
```
Console logs:
  === DEPOSIT INITIATED ===
  USD Value: 1.5
  ETH Price: 2500
  Required ETH: 0.0006
  Transaction sent to wallet for confirmation...
```

Button shows: "Confirm in wallet..."

### Step 3: User Confirms in Wallet
```
Console: ⏳ Waiting for wallet confirmation...
Button shows: "Confirming..."
```

### Step 4: Transaction Mining
```
Console: 🔄 Transaction confirming on blockchain...
Button shows: "Confirming..."
```

### Step 5: Success
```
Console:
  ✅ Transaction successful! Hash: 0xabc123...
  Successfully marked roundups as deposited

Success message shown with Blockscout link
Page refreshes after 2 seconds
```

### Step 6: Post-Deposit
```
Dashboard:
  Total Roundups: $0.00
  Button: "Need $1.00 more to deposit" (DISABLED)

Portfolio:
  Total Deposited: $1.50
  Shows 3 transactions now with status = true
```

---

## 🔍 Console Logs Guide

### Normal Flow:
```
=== DEPOSIT INITIATED ===
USD Value: 1.5
ETH Price: 2500
Required ETH: 0.0006
Transaction sent to wallet for confirmation...
⏳ Waiting for wallet confirmation...
🔄 Transaction confirming on blockchain...
✅ Transaction successful! Hash: 0x...
Successfully marked roundups as deposited
```

### If User Rejects:
```
=== DEPOSIT INITIATED ===
Transaction sent to wallet for confirmation...
❌ Transaction error: User rejected the request
```

### If Transaction Fails:
```
=== DEPOSIT INITIATED ===
🔄 Transaction confirming on blockchain...
❌ Transaction error: [Error details]
```

---

## 📝 Database Update Flow

After successful transaction:

1. **API Call:** `/api/mark-deposited`
   ```json
   {
     "walletAddress": "0x5AFD...",
     "txHash": "0xabc123..."
   }
   ```

2. **Database Update:**
   ```sql
   UPDATE base_batch_roundup
   SET status = true
   WHERE user_id = ? AND status = false
   ```

3. **Result:**
   - All pending roundups marked as deposited
   - They disappear from Dashboard
   - They appear in Portfolio

---

## 🧪 Testing Checklist

### Pre-Deposit Tests:
- [ ] Dashboard shows correct total roundups
- [ ] ETH price loads from Oracle
- [ ] Required ETH calculation is accurate
- [ ] Button disabled when total < $1.00
- [ ] Button enabled when total >= $1.00

### Deposit Tests:
- [ ] Click "Deposit" opens wallet
- [ ] Can see transaction details in wallet
- [ ] Correct ETH amount shown in wallet
- [ ] Contract address matches in wallet
- [ ] Can confirm transaction
- [ ] Can reject transaction

### Post-Deposit Tests:
- [ ] Success message appears
- [ ] Transaction hash is clickable
- [ ] Page refreshes automatically
- [ ] Dashboard shows $0.00 pending
- [ ] Portfolio shows deposited amount
- [ ] Database has status = true
- [ ] Can make new transactions after

---

## 🚨 Error Handling

### Error: "User rejected the request"
- **Cause:** User clicked "Reject" in wallet
- **Action:** Nothing is charged, try again
- **UI:** Error message shown, button re-enabled

### Error: "Insufficient funds"
- **Cause:** User doesn't have enough ETH
- **Action:** Add ETH to wallet
- **UI:** Error message with details

### Error: "Transaction failed"
- **Cause:** Smart contract error or network issue
- **Action:** Check console for details, try again
- **UI:** Error message shown

### Error: "CoffeeChangeV2__CannotBeLessThanOrEqualToZero"
- **Cause:** Trying to deposit 0 ETH
- **Action:** Wait until roundups >= $1.00
- **UI:** Button should be disabled

---

## 🔗 Smart Contract Functions Used

### 1. `userDepositEth()` - Payable
**Purpose:** Deposit ETH to contract
**Parameters:** None (value sent as msg.value)
**Returns:** Nothing
**Access:** Anyone can call

**Usage in app:**
```javascript
writeContract({
  functionName: "userDepositEth",
  value: parseEther("0.0006")
})
```

### 2. `s_userPositions(address)` - View
**Purpose:** Get user's position details
**Parameters:** User address
**Returns:**
- `depositsInContract` - ETH in contract
- `depositedInAave` - ETH deposited to Aave
- `userFirstContributionTimestamp` - First deposit time
- `timestampToWithdraw` - When can withdraw

**Future use:** Show user's position in Portfolio

### 3. `getBalanceInUsdValue()` - View
**Purpose:** Get contract's total balance in USD
**Parameters:** None
**Returns:** USD value (18 decimals)

**Future use:** Show total protocol value

---

## 📊 Expected Gas Costs

**Network:** Base Sepolia (Testnet)

**Estimated Gas:**
- `userDepositEth()`: ~50,000 gas
- Gas Price: ~0.001 Gwei (Base is cheap!)
- Total Cost: ~$0.0001 (negligible on testnet)

**On Base Mainnet:**
- Gas costs are extremely low (~$0.001 per transaction)
- Much cheaper than Ethereum mainnet

---

## 🎯 Success Criteria

Integration is working correctly when:

1. ✅ Dashboard correctly calculates required ETH
2. ✅ Clicking deposit opens wallet with correct amount
3. ✅ Contract address is `0x449c5730788b0eebcbFF1D2935Ff107999328D61`
4. ✅ Function called is `userDepositEth`
5. ✅ Transaction confirms on blockchain
6. ✅ Database updates (status = true)
7. ✅ Dashboard shows $0.00 after deposit
8. ✅ Portfolio shows deposited roundups
9. ✅ Can view transaction on Blockscout
10. ✅ Page refreshes and shows updated data

---

## 🔄 Complete Flow Diagram

```
User makes USDC transfers
    ↓
Blockscout API tracks transactions
    ↓
Backend calculates roundups
    ↓
Database stores (status = false)
    ↓
Dashboard shows pending roundups
    ↓
When total >= $1.00
    ↓
Button enabled
    ↓
User clicks "Deposit"
    ↓
Frontend calculates ETH from Oracle price
    ↓
Calls writeContract(userDepositEth)
    ↓
User confirms in wallet
    ↓
Transaction sent to blockchain
    ↓
CoffeeChangeV2 contract receives ETH
    ↓
Contract deposits to Aave (automatically)
    ↓
Transaction confirmed
    ↓
Backend marks roundups as deposited (status = true)
    ↓
Dashboard shows $0.00 pending
    ↓
Portfolio shows deposited roundups
    ↓
User accumulates new roundups
    ↓
Cycle repeats
```

---

## 🎉 You're All Set!

The smart contract integration is complete. Users can now:
- See their pending roundups
- Deposit ETH when total >= $1.00
- ETH automatically goes to CoffeeChangeV2 contract
- Contract handles Aave integration
- View their investment history in Portfolio

**Next Steps:**
1. Test the full flow on Base Sepolia
2. Make some USDC transactions
3. Wait for roundups to reach $1.00
4. Try depositing ETH
5. Check Portfolio to see deposited roundups

---

**Integration Complete! 🚀**
