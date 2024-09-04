enum DATA_TYPE {
    ARRAY = 'Array',
    ARRAY_BUFFER = 'ArrayBuffer',
    BOOLEAN = 'Boolean',
    CRYPTO_KEY = 'CryptoKey',
    DATE = 'Date',
    NULL = 'Null',
    NUMBER = 'Number',
    OBJECT = 'Object',
    PROMISE = 'Promise',
    REGEXP = 'RegExp',
    STRING = 'String',
    UNSIGNED_BYTE_ARRAY = 'Uint8Array',
    UNDEFINED = 'Undefined',
}

/**
 * Wrapper class around ArrayBuffer and Uint8Array instances.
 */
export class Buffer {
    private data: Uint8Array | null = null;

    constructor(buffer: unknown) {
        const type = Object.prototype.toString
            .call(buffer)
            .match(/(\w+)[^[]$/)![1] as DATA_TYPE;

        switch (type) {
            case DATA_TYPE.STRING:
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
        return new Promise<Uint8Array>((resolve) => {
            if (this.data) resolve(this.data);
            setTimeout(() => {
                resolve(this.bytes);
            }, 100);
        });
    }

    get hex() {
        return new Promise<string>((resolve) => {
            this.bytes.then((bytes) => {
                let hex = '';
                for (const byte of bytes) {
                    hex += byte.toString(16).padStart(2, '0');
                }
                resolve(hex);
            });
        });
    }

    get base64() {
        return new Promise<string>((resolve) => {
            this.bytes.then((bytes) => {
                let b64 = '';
                for (const byte of bytes) {
                    b64 += String.fromCodePoint(byte);
                }
                resolve(btoa(b64));
            });
        });
    }
}
