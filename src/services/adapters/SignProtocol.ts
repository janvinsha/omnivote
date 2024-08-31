import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    DataLocation
} from '@ethsign/sp-sdk';

interface SignProtocolAdapterOptions {
    chain: EvmChains;
}

const schemaIds = {
    sepolia: {
        id: "0x8d",
        txnHash: "0x252e36f37087c0611d73c963e72e101d36382479c05c136e8f837a8ebd41d09a",
    },
    polygonAmoy: {
        id: "0x8b",
        txnHash: "0xc38e107e690a71431baaaf114fc801b35be550eb464d9ff95933e32bfbc5e199",
    }
    // Add other chains as needed
};


const attestation = {
    attestationId
        :
        "0x146",
    indexingValue
        :
        "xxx",
    txHash
        :
        "0x8df75d8e8d4eba0f9bd4562ab9f9f7c63302eab3cc6a71633c2d459044d7cb87"
}


export class SignProtocolAdapter {
    private readonly client: SignProtocolClient;
    private readonly schemaId: string;

    constructor({ chain }: SignProtocolAdapterOptions) {
        this.client = new SignProtocolClient(SpMode.OnChain, { chain });

        const schemaData = schemaIds[chain];
        if (!schemaData) {
            throw new Error(`Schema ID not found for chain: ${chain}`);
        }

        this.schemaId = schemaData.id;
    }

    public async createSchema(data: any): Promise<any> {
        const createSchemaRes = await this.client.createSchema({
            description: "Schema for omnivote votes on sepolia chain",
            registrant: "0x659CE0FC2499E1Fa14d30F5CD88aD058ba490e39",
            // dataLocation: DataLocation.ONCHAIN,
            name: 'Omnivotes votes schema',
            data: [data],
        });
        return createSchemaRes;
    }

    public async createAttestation(data: any): Promise<any> {
        console.log("THIS IS THE SCHEMA ID", this.schemaId)
        const createAttestationRes = await this.client.createAttestation({
            schemaId: this.schemaId,
            data,
            indexingValue: 'xxx',
        });
        return createAttestationRes;
    }
}
