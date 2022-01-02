const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    Account
} = require("@solana/web3.js")

//KeyPair class will help to create a new wallet.
//In this object type of keypair we will be airdropping sol
const newPair = new Keypair();

//We’re extracting the public key from accountInfo and storing it in a new variable called publicKey which is of type string.
const publicKey = new PublicKey(newPair._keypair.publicKey).toString()

//We’re extracting the private key from accountInfo and storing it in a new variable called secretKey 
//which is of type Uint8Array of length 64.
//Never share the private key of your wallet with anyone.
const secretKey = newPair._keypair.secretKey

//web3 allows us to view balance using getBalance inside connection class
const getAccountBalance= async()=>{
    try {
        //Creates a connection object that’ll be used to get the balance.
        //Apart from the main network (called mainnet), Solana also maintains clusters called devnet and testnet.
        //Devnet is the replica of the Solana’s mainnet, and serves as a playground for anyone who wants to try out the features of Solana.
        //clusterApiUrl provides us the URL for devnet that we’ll be passing to create our connection object so that we get details of devnet.
        const connection = new Connection(clusterApiUrl("devnet"),"confirmed")

        //wallet object from secret key
        const myWallet = await Keypair.fromSecretKey(secretKey);

        const walletBalance = await connection.getBalance(new PublicKey(myWallet.publicKey))

        console.log(`Wallet balance:,${parseInt(walletBalance)/LAMPORTS_PER_SOL} SOL`)
        console.log("Wallet address:",publicKey)
        
    } catch (error) {
        console.log("Error:",error)
    }
}

//for airdropping solana
const airdropSol = async()=>{
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletKeyPair = await Keypair.fromSecretKey(secretKey);

        //creating airdrop signature
        //amount of sol we want to aairdrop at max 2 sol can be airdropped
        const fromAirdropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair.publicKey),
            2*LAMPORTS_PER_SOL
        )

        //wait till confirmation for the transaction from network
        await connection.confirmTransaction(fromAirdropSignature)
    } catch (error) {
        console.log("Error:",error)
    }
}

//
const driverFunction = async()=>{
    await getAccountBalance()
    await airdropSol()
    await getAccountBalance()
}


driverFunction()