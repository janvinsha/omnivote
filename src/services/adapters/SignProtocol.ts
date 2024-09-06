// @ts-nocheck
import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    DataLocation,
    IndexService
} from '@ethsign/sp-sdk';

interface SignProtocolAdapterOptions {
    chain: EvmChains;
}

const schemaIds = {
    sepolia: {
        id: "0x8d",
        txnHash: "0x252e36f37087c0611d73c963e72e101d36382479c05c136e8f837a8ebd41d09a",
    },
    baseSepolia: {
        id: "0x1cd",
        txnHash: "0x92af1bdf73fdef3806e24b15c4f6cb5c3fa30f8214a21f9b9cb23214676ac97c",
    }

};


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

    public async getAllAttestations(query: {}): Promise<any> {
        const indexService = new IndexService("testnet");
        let _query = {
            // id: schemaIds.sepolia.id,
            // schemaId: this.schemaId,
            attester: query?.attester,
            page: 1,
            // mode: "onchain"
            // indexingValue: "xxx",
        }
        const retrieveAttestationsRes = await indexService.queryAttestationList(_query);
        return retrieveAttestationsRes;
    }
}
