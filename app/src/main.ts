import './style.css'
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { NetworkType } from '@airgap/beacon-types'

// Initialize Taquito
const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')

// Initialize Beacon Wallet
const wallet = new BeaconWallet({
  name: 'Tezos App',
  preferredNetwork: NetworkType.GHOSTNET
})

Tezos.setWalletProvider(wallet)

// UI Elements
const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div>
    <h1>Tezos with Taquito</h1>
    <div class="card">
      <button id="connect" type="button">Connect Wallet</button>
      <button id="get-balance" type="button" style="display: none;">Get Balance</button>
    </div>
    <div id="status" class="status"></div>
    <div id="balance" class="balance"></div>
  </div>
`

const connectButton = document.querySelector<HTMLButtonElement>('#connect')!
const getBalanceButton = document.querySelector<HTMLButtonElement>('#get-balance')!
const statusDiv = document.querySelector<HTMLDivElement>('#status')!
const balanceDiv = document.querySelector<HTMLDivElement>('#balance')!

// Connect wallet
connectButton.addEventListener('click', async () => {
  try {
    statusDiv.textContent = 'Connecting...'
    await wallet.requestPermissions({
      network: {
        type: NetworkType.GHOSTNET,
        rpcUrl: 'https://ghostnet.ecadinfra.com'
      }
    })
    const address = await wallet.getPKH()
    statusDiv.textContent = `Connected: ${address}`
    connectButton.style.display = 'none'
    getBalanceButton.style.display = 'block'
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    statusDiv.textContent = `Error: ${errorMessage}`
  }
})

// Get balance
getBalanceButton.addEventListener('click', async () => {
  try {
    balanceDiv.textContent = 'Loading balance...'
    const address = await wallet.getPKH()
    const balance = await Tezos.tz.getBalance(address)
    balanceDiv.textContent = `Balance: ${balance.dividedBy(1000000).toNumber()} XTZ`
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    balanceDiv.textContent = `Error: ${errorMessage}`
  }
})

