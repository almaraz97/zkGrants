# 💼 ZK Grants
Create an anonymous group, allocate tokens to a grant recipient, and then privately vote on their release!
## 🚀 Purpose
Often, groups of people need to pool funds together for a common goal. However, there are many reasons why individuals may not want to reveal their (dis)approval to the group. This project aims to create a system where individuals can pool funds together and anonymously vote on the release of those funds.
## ✨ Features
### Anonymous voting
[Semaphore](https://github.com/semaphore-protocol/semaphore/)
 is used to generate private identities, aggregate them into a group, and then allow group members to vote by generating valid proofs.

### Onchain escrow
[Denota Protocol](https://github.com/denotalabs/denota-protocol) is used to escrow funds, store grant metadata, and set the conditions for token release. It uses NFTs to represent the grant and for compatibility with the crypto ecosystem (metadata interoperability, DeFi, etc).
