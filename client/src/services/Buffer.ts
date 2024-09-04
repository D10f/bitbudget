enum DATA_TYPE {
    ARRAY = 'ARRAY',
    ARRAY_BUFFER = 'ARRAY_BUFFER',
    BOOLEAN = 'BOOLEAN',
    CRYPTO_KEY = 'CRYPTO_KEY',
    DATE = 'DATE',
    NULL = 'NULL',
    NUMBER = 'NUMBER',
    OBJECT = 'OBJECT',
    PROMISE = 'PROMISE',
    REGEXP = 'REGEXP',
    STRING = 'STRING',
    UNSIGNED_BYTE_ARRAY = 'UNSIGNED_BYTE_ARRAY',
    UNDEFINED = 'UNDEFINED',
}

/**
 * Wrapper class around ArrayBuffer and Uint8Array instances.
 */
export class Buffer {
    private data = new Uint8Array([]);

    constructor(buffer: unknown) {
        const type = Object.prototype.toString
            .call(buffer)
            .match(/(\w+)[^[]$/)![1] as DATA_TYPE;

        switch (type) {
            case DATA_TYPE.ARRAY:
                this.data = new TextEncoder().encode(buffer as string);
                break;

            case DATA_TYPE.DATE:
                this.data = new TextEncoder().encode(
                    (buffer as Date).toString(),
                );
                break;

            case DATA_TYPE.UNSIGNED_BYTE_ARRAY:
                this.data = buffer as Uint8Array;
                break;

            case DATA_TYPE.ARRAY_BUFFER:
                this.data = new Uint8Array(buffer as ArrayBuffer);
                break;

            case DATA_TYPE.CRYPTO_KEY:
                crypto.subtle
                    .exportKey('raw', buffer as CryptoKey)
                    .then(
                        (keyBuffer) => (this.data = new Uint8Array(keyBuffer)),
                    );
                break;

            case DATA_TYPE.OBJECT:
                new Blob([JSON.stringify(buffer)], { type: 'application/json' })
                    .arrayBuffer()
                    .then(
                        (keyBuffer) => (this.data = new Uint8Array(keyBuffer)),
                    );
                break;

            case DATA_TYPE.NUMBER:
            case DATA_TYPE.BOOLEAN:
            case DATA_TYPE.UNDEFINED:
            case DATA_TYPE.NULL:
                throw new Error(`Invalid data type ${type}`);
            default:
                throw new Error('Unable to extract buffer.');
        }
    }

    static from(input: unknown) {
        if (input instanceof Buffer) {
            return input;
        }
        return new Buffer(input);
    }

    get bytes() {
        return this.data;
    }

    get hex() {
        let hex = '';
        for (const byte of this.data) {
            hex += byte.toString(16).padStart(2, '0');
        }
        return hex;
    }

    get base64() {
        let b64 = '';
        for (const byte of this.data) {
            b64 += String.fromCodePoint(byte);
        }
        return btoa(b64);
    }
}
