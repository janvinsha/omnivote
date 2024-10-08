import {
    SignProtocolClient,
    SpMode,
    EvmChains,
    delegateSignAttestation,
    delegateSignRevokeAttestation,
    delegateSignSchema,
} from '@ethsign/sp-sdk';

interface SignProtocolAdapterOptions {
    chain: EvmChains;
    schemaId?: string;
}

const schemaIds = { sepolia: "" }

export class OmnivoteService {
    private readonly client: SignProtocolClient;
    private readonly schemaId: string;

    constructor({ chain, schemaId = '' }: SignProtocolAdapterOptions) {
        this.client = new SignProtocolClient(SpMode.OnChain, { chain });
        this.schemaId = schemaId;
    }

    public async createSchema(data: any): Promise<any> {
        const createSchemaRes = await this.client.createSchema({
            name: 'xxx',
            data: [data],
        });
        return createSchemaRes;
    }

    public async createAttestation(data: any): Promise<any> {
        const createAttestationRes = await this.client.createAttestation({
            schemaId: this.schemaId,
            data,
            indexingValue: 'xxx',
        });
        return createAttestationRes;
    }
}
