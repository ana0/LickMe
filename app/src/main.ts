import { Buffer } from 'buffer'
globalThis.Buffer = Buffer

import './style.css'
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { NetworkType } from '@airgap/beacon-types'
import artworks from './artworks.json'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string
const RPC_URL = 'https://ghostnet.ecadinfra.com'

interface ArtworkMetadata {
  name: string
  image: string
  date?: string
  description?: string
}

interface PaymentRecord {
  timestamp: string
  amount: number // in mutez
}

interface ArtworkData {
  id: string
  metadata: ArtworkMetadata | null
  payments: PaymentRecord[]
  totalXtz: number
}

// Initialize Taquito
const Tezos = new TezosToolkit(RPC_URL)

// Initialize Beacon Wallet with support for Temple, Kukai, and other wallets
const wallet = new BeaconWallet({
  name: 'LickMe',
  network: {
    type: NetworkType.GHOSTNET,
    rpcUrl: RPC_URL
  },
  featuredWallets: ['temple', 'kukai'],
})

Tezos.setWalletProvider(wallet)

// Wallet state
let connectedAddress: string | null = null

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function updateWalletUI() {
  const connectBtn = document.querySelector<HTMLButtonElement>('#connect-wallet')
  const addressDisplay = document.querySelector<HTMLSpanElement>('#wallet-address')
  const disconnectBtn = document.querySelector<HTMLButtonElement>('#disconnect-wallet')

  if (!connectBtn || !addressDisplay || !disconnectBtn) return

  if (connectedAddress) {
    connectBtn.style.display = 'none'
    addressDisplay.textContent = shortenAddress(connectedAddress)
    addressDisplay.style.display = 'inline'
    disconnectBtn.style.display = 'inline'
  } else {
    connectBtn.style.display = 'inline'
    addressDisplay.style.display = 'none'
    disconnectBtn.style.display = 'none'
  }
}

async function checkExistingConnection() {
  try {
    const activeAccount = await wallet.client.getActiveAccount()
    if (activeAccount) {
      connectedAddress = activeAccount.address
      updateWalletUI()
    }
  } catch (error) {
    console.error('Error checking existing connection:', error)
  }
}

async function connectWallet(): Promise<boolean> {
  if (connectedAddress) return true

  try {
    await wallet.requestPermissions()
    connectedAddress = await wallet.getPKH()
    updateWalletUI()
    return true
  } catch (error) {
    console.error('Wallet connection failed:', error)
    return false
  }
}

async function disconnectWallet() {
  try {
    await wallet.clearActiveAccount()
    connectedAddress = null
    updateWalletUI()
  } catch (error) {
    console.error('Disconnect failed:', error)
  }
}

async function fetchMetadata(url: string): Promise<ArtworkMetadata | null> {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return {
      name: data.name,
      image: data.image_url,
      date: data.date,
      description: data.description
    }
  } catch (error) {
    console.error('Failed to fetch metadata:', error)
    return null
  }
}

async function fetchArtworkPayments(artworkId: string): Promise<PaymentRecord[]> {
  if (!CONTRACT_ADDRESS) return []

  try {
    const contract = await Tezos.contract.at(CONTRACT_ADDRESS)
    const storage = await contract.storage() as {
      artworks: Map<string, Array<{ timestamp: string; amount: { toNumber: () => number } }>>
      pending: Map<string, { timestamp: string; amount: { toNumber: () => number } }>
    }

    const payments: PaymentRecord[] = []

    // Get finalized payments from artworks map
    const artworkPayments = storage.artworks.get(artworkId)
    if (artworkPayments) {
      for (const payment of artworkPayments) {
        payments.push({
          timestamp: payment.timestamp,
          amount: payment.amount.toNumber()
        })
      }
    }

    // Get pending payment if exists
    const pending = storage.pending.get(artworkId)
    if (pending) {
      payments.push({
        timestamp: pending.timestamp,
        amount: pending.amount.toNumber()
      })
    }

    return payments
  } catch (error) {
    console.error(`Failed to fetch payments for ${artworkId}:`, error)
    return []
  }
}

function mutezToXtz(mutez: number): number {
  return mutez / 1_000_000
}

async function payForArtwork(artworkId: string, amountXtz: number): Promise<void> {
  const connected = await connectWallet()
  if (!connected) {
    throw new Error('Wallet not connected')
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured')
  }

  const contract = await Tezos.wallet.at(CONTRACT_ADDRESS)

  const batch = Tezos.wallet.batch()
    .withContractCall(contract.methods.pay_for_artwork(artworkId), { amount: amountXtz })

  const op = await batch.send()
  await op.confirmation(1)
}

function createModal(): {
  show: (artworkId: string, artworkName: string) => void
  hide: () => void
} {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close">&times;</button>
      <h2 class="modal-title"></h2>
      <div class="modal-body">
        <label for="xtz-amount">Amount (XTZ)</label>
        <input type="number" id="xtz-amount" min="0.000001" step="0.1" value="1" />
        <button class="modal-send">Send</button>
      </div>
      <div class="modal-status"></div>
    </div>
  `
  document.body.appendChild(overlay)

  const closeBtn = overlay.querySelector('.modal-close') as HTMLButtonElement
  const title = overlay.querySelector('.modal-title') as HTMLHeadingElement
  const input = overlay.querySelector('#xtz-amount') as HTMLInputElement
  const sendBtn = overlay.querySelector('.modal-send') as HTMLButtonElement
  const status = overlay.querySelector('.modal-status') as HTMLDivElement

  let currentArtworkId = ''

  function hide() {
    overlay.classList.remove('active')
    status.textContent = ''
    status.className = 'modal-status'
  }

  function show(artworkId: string, artworkName: string) {
    currentArtworkId = artworkId
    title.textContent = `Pay for ${artworkName}`
    input.value = '1'
    overlay.classList.add('active')
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hide()
  })

  closeBtn.addEventListener('click', hide)

  sendBtn.addEventListener('click', async () => {
    const amount = parseFloat(input.value)
    if (isNaN(amount) || amount <= 0) {
      status.textContent = 'Please enter a valid amount'
      status.className = 'modal-status error'
      return
    }

    sendBtn.disabled = true
    status.textContent = 'Connecting wallet...'
    status.className = 'modal-status'

    try {
      status.textContent = 'Sending transaction...'
      await payForArtwork(currentArtworkId, amount)
      status.textContent = 'Payment successful!'
      status.className = 'modal-status success'
      setTimeout(hide, 2000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transaction failed'
      status.textContent = message
      status.className = 'modal-status error'
    } finally {
      sendBtn.disabled = false
    }
  })

  return { show, hide }
}

function formatXtz(amount: number): string {
  if (amount === 0) return '0 XTZ'
  if (amount < 0.01) return amount.toFixed(6) + ' XTZ'
  if (amount < 1) return amount.toFixed(4) + ' XTZ'
  return amount.toFixed(2) + ' XTZ'
}

function createArtworkCard(
  artworkId: string,
  metadata: ArtworkMetadata,
  totalXtz: number,
  onPayClick: (artworkId: string, name: string) => void
): HTMLElement {
  const card = document.createElement('div')
  card.className = 'artwork-card'
  const dateHtml = metadata.date ? `<p class="artwork-date">${metadata.date}</p>` : ''
  const totalHtml = `<p class="artwork-total">${formatXtz(totalXtz)} received</p>`
  card.innerHTML = `
    <img src="${metadata.image}" alt="${metadata.name}" class="artwork-image" />
    <h3 class="artwork-name">${metadata.name}</h3>
    ${dateHtml}
    ${totalHtml}
    <button class="pay-button">Pay me</button>
  `

  const button = card.querySelector('.pay-button') as HTMLButtonElement
  button.addEventListener('click', () => onPayClick(artworkId, metadata.name))

  return card
}

async function init() {
  const app = document.querySelector<HTMLDivElement>('#app')!

  app.innerHTML = `
    <header class="header">
      <h1>LickMe</h1>
      <div class="wallet-controls">
        <button id="connect-wallet" class="wallet-button">Connect Wallet</button>
        <span id="wallet-address" class="wallet-address"></span>
        <button id="disconnect-wallet" class="wallet-button disconnect">Disconnect</button>
      </div>
    </header>
    <div class="grid" id="artwork-grid">
      <div class="loading">Loading artworks...</div>
    </div>
  `

  // Set up wallet button handlers
  const connectBtn = document.querySelector<HTMLButtonElement>('#connect-wallet')!
  const disconnectBtn = document.querySelector<HTMLButtonElement>('#disconnect-wallet')!

  connectBtn.addEventListener('click', connectWallet)
  disconnectBtn.addEventListener('click', disconnectWallet)

  // Check for existing connection
  await checkExistingConnection()
  updateWalletUI()

  const grid = document.querySelector<HTMLDivElement>('#artwork-grid')!
  const modal = createModal()

  // Fetch all metadata and payments in parallel
  const artworkEntries = Object.entries(artworks) as [string, string][]
  const dataPromises = artworkEntries.map(async ([id, url]): Promise<ArtworkData> => {
    const [metadata, payments] = await Promise.all([
      fetchMetadata(url),
      fetchArtworkPayments(id)
    ])

    const totalMutez = payments.reduce((sum, p) => sum + p.amount, 0)
    const totalXtz = mutezToXtz(totalMutez)

    return { id, metadata, payments, totalXtz }
  })

  const results = await Promise.all(dataPromises)

  // Sort by total payments (highest first)
  results.sort((a, b) => b.totalXtz - a.totalXtz)

  grid.innerHTML = ''

  for (const { id, metadata, totalXtz } of results) {
    if (metadata) {
      const card = createArtworkCard(id, metadata, totalXtz, (artworkId, name) => {
        modal.show(artworkId, name)
      })
      grid.appendChild(card)
    }
  }

  if (grid.children.length === 0) {
    grid.innerHTML = '<div class="error">Failed to load artworks</div>'
  }
}

init()
