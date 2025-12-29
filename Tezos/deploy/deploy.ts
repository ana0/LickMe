import { config } from "dotenv";
import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { LocalForger } from "@taquito/local-forging";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const GHOSTNET_RPC = "https://ghostnet.ecadinfra.com";

interface DeployConfig {
  rpcUrl: string;
  mnemonic?: string;
  privateKey?: string;
  derivationPath?: string;
  adminAddress?: string;
}

async function loadContract(): Promise<{ code: object; storage: object }> {
  const contractPath = resolve(__dirname, "../LickAuction/step_006_cont_0_contract.json");
  const storagePath = resolve(__dirname, "../LickAuction/step_006_cont_0_storage.json");

  const code = JSON.parse(readFileSync(contractPath, "utf8"));
  const storage = JSON.parse(readFileSync(storagePath, "utf8"));

  return { code, storage };
}

function buildStorage(adminAddress: string) {
  return {
    admin: adminAddress,
    artworks: new MichelsonMap(),
    pending: new MichelsonMap(),
  };
}

async function createSigner(config: DeployConfig): Promise<InMemorySigner> {
  if (config.mnemonic) {
    const derivationPath = config.derivationPath || "m/44'/1729'/0'/0'";
    return InMemorySigner.fromMnemonic({
      mnemonic: config.mnemonic,
      derivationPath,
    });
  }

  if (config.privateKey) {
    return new InMemorySigner(config.privateKey);
  }

  throw new Error("Either TEZOS_MNEMONIC or TEZOS_PRIVATE_KEY must be set");
}

async function deploy(config: DeployConfig): Promise<string> {
  const tezos = new TezosToolkit(config.rpcUrl);

  const signer = await createSigner(config);
  tezos.setProvider({
    signer,
    forger: new LocalForger(),
  });

  const deployerAddress = await signer.publicKeyHash();
  const adminAddress = config.adminAddress || deployerAddress;

  console.log(`Deployer address: ${deployerAddress}`);
  console.log(`Admin address: ${adminAddress}`);

  const balance = await tezos.tz.getBalance(deployerAddress);
  console.log(`Deployer balance: ${balance.toNumber() / 1_000_000} XTZ`);

  if (balance.toNumber() < 1_000_000) {
    throw new Error(
      `Insufficient balance. Get testnet XTZ from https://faucet.ghostnet.teztnets.com/`
    );
  }

  const { code } = await loadContract();
  const storage = buildStorage(adminAddress);

  const originateParams = {
    code: code as object[],
    storage,
  };

  console.log("\nEstimating origination...");

  try {
    const estimate = await tezos.estimate.originate(originateParams);
    console.log(`Estimated gas: ${estimate.gasLimit}, storage: ${estimate.storageLimit}`);
  } catch (estimateError) {
    console.error("Estimate failed:", estimateError);
    throw estimateError;
  }

  console.log("\nOriginating contract...");

  const originationOp = await tezos.contract.originate(originateParams);

  console.log(`Waiting for confirmation (op hash: ${originationOp.hash})...`);

  await originationOp.confirmation(1);

  const contractAddress = originationOp.contractAddress!;
  console.log(`\nContract deployed successfully!`);
  console.log(`Contract address: ${contractAddress}`);
  console.log(`View on explorer: https://ghostnet.tzkt.io/${contractAddress}`);

  return contractAddress;
}

async function main() {
  const mnemonic = process.env.TEZOS_MNEMONIC;
  const privateKey = process.env.TEZOS_PRIVATE_KEY;

  if (!mnemonic && !privateKey) {
    console.error("Error: No credentials provided");
    console.error("\nSet one of these environment variables:");
    console.error("  TEZOS_MNEMONIC - Your 12/15/24 word seed phrase");
    console.error("  TEZOS_PRIVATE_KEY - Your private key (edsk...)");
    console.error("\nExample:");
    console.error('  TEZOS_MNEMONIC="word1 word2 ... word12" npm run deploy');
    console.error("\nOptional variables:");
    console.error("  TEZOS_DERIVATION_PATH - HD derivation path (default: m/44'/1729'/0'/0')");
    console.error("  TEZOS_ADMIN_ADDRESS - Contract admin (default: deployer address)");
    process.exit(1);
  }

  const config: DeployConfig = {
    rpcUrl: process.env.TEZOS_RPC_URL || GHOSTNET_RPC,
    mnemonic,
    privateKey,
    derivationPath: process.env.TEZOS_DERIVATION_PATH,
    adminAddress: process.env.TEZOS_ADMIN_ADDRESS,
  };

  console.log("Deploying LickAuction to Ghostnet...\n");
  console.log(`RPC: ${config.rpcUrl}`);

  try {
    const contractAddress = await deploy(config);

    console.log("\n--- Deployment Summary ---");
    console.log(`Network: Ghostnet`);
    console.log(`Contract: ${contractAddress}`);
    console.log(`\nAdd this to your app configuration:`);
    console.log(`CONTRACT_ADDRESS=${contractAddress}`);
  } catch (error) {
    console.error("\nDeployment failed:", error);
    process.exit(1);
  }
}

main();
