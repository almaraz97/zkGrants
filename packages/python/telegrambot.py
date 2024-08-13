import os
from dotenv import load_dotenv
from web3 import Web3
import telebot
import json

# Load environment variables from .env file
load_dotenv()
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
ETH_NODE_URL = os.getenv("SEPOLIA_RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
SEMAPHORE_CONTRACT_ADDRESS = "0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f" # os.getenv("SEMAPHORE_CONTRACT_ADDRESS")
CONTRACT_ABI_PATH = os.getcwd() + "/packages/python/Semaphore.json"
GAS_LIMIT = int(os.getenv("GAS_LIMIT", "300000"))
GROUP_ID = 33 # Hardcoded for now # https://sepolia.etherscan.io/tx/0xcbff2e65af446fef30f0df2e79d2d50495e39ddb7c4509679fe59fe173244a14

# Load Contract ABI
with open(CONTRACT_ABI_PATH, 'r') as abi_file:
    contract_abi = json.load(abi_file)

# Initialize Web3
web3 = Web3(Web3.HTTPProvider(ETH_NODE_URL))


def get_nonce(address):
    return web3.eth.get_transaction_count(address)

def send_contract_transaction(function_name, *args):
    account = web3.eth.account.from_key(PRIVATE_KEY)
    tx = web3.eth.contract(address=SEMAPHORE_CONTRACT_ADDRESS, abi=contract_abi).functions[function_name](*args).build_transaction({
        'from': account.address,
        'nonce': get_nonce(account.address),
        'gas': GAS_LIMIT,
        'gasPrice': web3.eth.gas_price
    })
    signed_tx = web3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return web3.toHex(tx_hash)

bot = telebot.TeleBot(TELEGRAM_BOT_TOKEN)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
	bot.reply_to(message, "Howdy, how are you doing?")

@bot.message_handler(func=lambda m: True)
def add_member_handler(message):
    try:
        identifier = int(message.text)
        tx_hash = send_contract_transaction('addMember', GROUP_ID, identifier)
        bot.reply_to(message, f"Transaction sent to add member {identifier}! Hash: {tx_hash}")
    except Exception as e:
        bot.reply_to(message, f"Error: {str(e)}")

if __name__ == "__main__":
    bot.infinity_polling()
