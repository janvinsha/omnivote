
# OmniVote
OmniVote is a decentralized voting platform that allows users to create and manage proposals across multiple blockchain networks seamlessly. By leveraging Chainlink's Cross-Chain Interoperability Protocol (CCIP), OmniVote enables smart contracts on different blockchains to communicate with each other, ensuring a truly omnichain governance experience. OmniVote uses Sign Protocol for attestations and stores proposal, DAO, and vote data in MongoDB. The platform supports decentralized identity and cross-chain governance to provide secure, tamper-proof voting.

## Features:
Cross-Chain Voting: Seamless communication between smart contracts deployed on different blockchains using Chainlink CCIP.
Secure Identity: OmniVote integrates with Sign Protocol for secure attestations and decentralized identity management.
Multi-Chain Smart Contracts: Smart contracts are deployed on Ethereum Sepolia and Base Sepolia.
Web3Auth Integration: Easy login and authentication for users using Web3Auth.
User-Friendly Interface: Built with Next.js, shadcn, and Tailwind for a modern and accessible user experience.

## Smart Contract
The core smart contract for OmniVote is available here.
Repository: https://github.com/janvinsha/OmniVoteContractCCIP/blob/develop/contracts/OmniVote.sol

## Technology Stack:
Frontend: Next.js, shadcn, Tailwind
Backend: Express.js, MongoDB
Blockchain: Chainlink CCIP for cross-chain communication
Identity & Security: Sign Protocol for attestations, Web3Auth for authentication
Storage: MongoDB for proposals, DAO, and voting data



## Getting Started
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

