import { create } from 'ipfs-http-client';

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

const auth = "Basic " + Buffer.from(`${projectId}:${projectSecret}`).toString("base64");

const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});

export const uploadFileToIPFS = async (file: any) => {
    try {
        const addedFile = await client.add(file);
        return `https://ipfs.infura.io/ipfs/${addedFile.path}`;
    } catch (error) {
        console.error("Error uploading file to IPFS:", error);
        throw error;
    }
};

export default client;
