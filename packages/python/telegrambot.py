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
CONTRACT_ABI_PATH = os.getcwd() + "/Semaphore.json"
GAS_LIMIT = int(os.getenv("GAS_LIMIT", "3000000"))
GROUP_ID = 51 # Hardcoded for now

with open(CONTRACT_ABI_PATH, 'r') as abi_file:
    contract_abi = json.load(abi_file)

web3 = Web3(Web3.HTTPProvider(ETH_NODE_URL))
contract = web3.eth.contract(address=SEMAPHORE_CONTRACT_ADDRESS, abi=contract_abi)

def get_nonce(address):
    return web3.eth.get_transaction_count(address)

def send_contract_transaction(function_name, *args):
    account = web3.eth.account.from_key(PRIVATE_KEY)
    tx = contract.functions[function_name](*args).build_transaction({
        'from': account.address,
        'nonce': get_nonce(account.address),
        'gas': GAS_LIMIT,
        'gasPrice': int(web3.eth.gas_price * 1.5)
    })
    signed_tx = web3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
    return web3.to_hex(tx_hash)

bot = telebot.TeleBot(TELEGRAM_BOT_TOKEN)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
	bot.reply_to(message, "Howdy, how are you doing?")

@bot.message_handler(func=lambda m: True)
def add_member_handler(message):
    try:
        identifier = int(message.text)
        tx_hash = send_contract_transaction('addMember', GROUP_ID, identifier)
        bot.reply_to(message, f"You've been added! Tx: https://sepolia.etherscan.io/tx/{tx_hash}")
    except Exception as e:
        bot.reply_to(message, f"Error: {str(e)}")

if __name__ == "__main__":
    bot.infinity_polling()
