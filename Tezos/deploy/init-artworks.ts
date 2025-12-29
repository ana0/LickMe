import { config } from "dotenv";
import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { LocalForger } from "@taquito/local-forging";

config();

const GHOSTNET_RPC = "https://ghostnet.ecadinfra.com";

const ARTWORK_NAMES = [
  "artwork_1",
  "artwork_2",
  "artwork_3",
  "artwork_4",
  "artwork_5",
  "artwork_6",
  "artwork_7",
  "artwork_8",
  "artwork_9",
  "artwork_10",
];

async function createSigner(): Promise<InMemorySigner> {
  const mnemonic = process.env.TEZOS_MNEMONIC;
  const privateKey = process.env.TEZOS_PRIVATE_KEY;

  if (mnemonic) {
    const derivationPath = process.env.TEZOS_DERIVATION_PATH || "m/44'/1729'/0'/0'";
    return InMemorySigner.fromMnemonic({
      mnemonic,
      derivationPath,
    });
  }

  if (privateKey) {
    return new InMemorySigner(privateKey);
  }

  throw new Error("Either TEZOS_MNEMONIC or TEZOS_PRIVATE_KEY must be set");
}

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const rpcUrl = process.env.TEZOS_RPC_URL || GHOSTNET_RPC;

  if (!contractAddress) {
    console.error("Error: CONTRACT_ADDRESS not set in .env");
    process.exit(1);
  }

  console.log("Initializing artworks...\n");
  console.log(`RPC: ${rpcUrl}`);
  console.log(`Contract: ${contractAddress}`);

  const tezos = new TezosToolkit(rpcUrl);
  const signer = await createSigner();
  tezos.setProvider({
    signer,
    forger: new LocalForger(),
  });

  const signerAddress = await signer.publicKeyHash();
  console.log(`Signer: ${signerAddress}\n`);

  const contract = await tezos.contract.at(contractAddress);

  for (const artworkName of ARTWORK_NAMES) {
    console.log(`Adding artwork: ${artworkName}...`);
    try {
      const op = await contract.methods.add_artwork(artworkName).send();
      await op.confirmation(1);
      console.log(`  ✓ Added (op: ${op.hash})`);
    } catch (error) {
      console.error(`  ✗ Failed:`, error);
    }
  }

  console.log("\nDone! All artworks initialized.");
}

main();
