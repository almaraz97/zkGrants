-include .env

optimizer_runs=1000000
FACTORY_ADDRESS=0x0000000000FFe8B47B3e2130213B802212439497
VERIFIER_URL=https://api-sepolia.etherscan.io/api
DEPLOY_RPC_URL=${SEPOLIA_RPC_URL}

hookFileName=SemaphoreRelease
deploy:
	forge compile --optimizer-runs ${optimizer_runs}

	set -e ; \
	registrarAddress="0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B" ; \
	constructorArgs=$$(cast abi-encode "constructor(address)" $${registrarAddress}) ; \
	constructorArgs=$$(echo $${constructorArgs} | sed 's/0x//') ; \
	echo "Constructor Args: "$${constructorArgs} ; \
	bytecode=$$(jq -r '.bytecode.object' out/$(hookFileName).sol/$(hookFileName).json)$${constructorArgs} ; \
	echo $${bytecode} ; \
	cast send --chain 11155111 --private-key ${PRIVATE_KEY} --rpc-url ${DEPLOY_RPC_URL} --create $${bytecode} 
#  ; 

# \
# echo "Address deployed on blockchain.\nVerifying...\n\n" ; \
# sleep 10 ; \
# forge verify-contract --compiler-version v0.8.20+commit.a1b79de6 --num-of-optimizations ${optimizer_runs} --watch \
# --chain-id 11155111 --verifier-url ${VERIFIER_URL} --etherscan-api-key ${ETHER_SCAN_API_KEY} \
# --constructor-args $${constructorArgs} \
# $${hookAddress} \
# contracts/$(hookFileName).sol:$(hookFileName) ; \
# echo "Contract verified."

verify:
	set -e ; \
	registrarAddress=0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B ; \
	constructorArgs=$$(cast abi-encode "constructor(address)" $${registrarAddress}) ; \
	constructorArgs=$$(echo $${constructorArgs} | sed 's/0x//') ; \
	echo "Constructor Args: "$${constructorArgs} ; \
	hookAddress=$$(cat $(hookFileName).salt.txt | grep "Address: " | awk '{print $$2}') ; \
	forge verify-contract --compiler-version v0.8.20+commit.a1b79de6 --num-of-optimizations ${optimizer_runs} --watch \
	--chain-id 11155111 --verifier-url ${VERIFIER_URL} --etherscan-api-key ${ETHER_SCAN_API_KEY} \
	--constructor-args $${constructorArgs} \
	$${hookAddress} \
	contracts/$(hookFileName).sol:$(hookFileName) ; \
	echo "Contract verified."

deploy2:
	forge build --optimizer-runs ${optimizer_runs}

	set -e ; \
	registrarAddress="0x00002bCC9B3e92a59207C43631f3b407AE5bBd0B" ; \
	constructorArgs=$$(cast abi-encode "constructor(address)" $${registrarAddress}) ; \
	constructorArgs=$$(echo $${constructorArgs} | sed 's/0x//') ; \
	echo ; \
	echo ; \
	bytecode=$$(jq -r '.bytecode.object' out/$(hookFileName).sol/$(hookFileName).json)$${constructorArgs} ; \
	echo $${bytecode} ; \
	echo ; \
	echo ; \
	cast create2 --deployer ${FACTORY_ADDRESS} --init-code $${bytecode} --starts-with 0000 --caller ${ADDRESS} 2>&1 | tee $(hookFileName).salt.txt ; \
	echo ; \
	echo ; \
	salt=$$(cat $(hookFileName).salt.txt | grep "Salt: " | awk '{print $$2}') ; \
	echo ; \
	echo ; \
	hookAddress=$$(cat $(hookFileName).salt.txt | grep "Address: " | awk '{print $$2}') ; \
	cast send ${FACTORY_ADDRESS} "safeCreate2(bytes32,bytes calldata)" $${salt} $${bytecode} --private-key ${PRIVATE_KEY} --rpc-url ${DEPLOY_RPC_URL} ;
