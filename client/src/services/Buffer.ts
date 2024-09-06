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

async function objectToBuffer(obj: object) {
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
    return await blob.arrayBuffer();
}

/**
 * Wrapper class around ArrayBuffer and Uint8Array instances.
 */
export class Buffer {
    private constructor(private readonly data: Uint8Array) {}

    get raw() {
        return this.data;
    }

    get hex() {
        let hex = '';
        for (const byte of this.raw) {
            hex += byte.toString(16).padStart(2, '0');
        }
        return hex;
    }

    get base64() {
        let b64 = '';
        for (const byte of this.raw) {
            b64 += String.fromCodePoint(byte);
        }
        return b64;
    }

    static async concat(...args: Array<Buffer | Uint8Array | ArrayBuffer>) {
        let byteLength = 0;
        const buffers: Uint8Array[] = [];

        for (const b in args) {
            const buffer = await Buffer.from(b);
            buffers.push(buffer.raw);
            byteLength += buffer.raw.length;
        }

        const combinedBuffer = await Buffer.from(new Uint8Array(byteLength));

        buffers.forEach((buffer, idx) => {
            combinedBuffer.raw.set(buffer, idx * buffer.byteLength);
        });

        return combinedBuffer;
    }

    static async from(input: unknown) {
        if (input instanceof Buffer) {
            return input;
        }

        const type = Object.prototype.toString
            .call(input)
            .match(/(\w+)[^[]$/)![1] as DATA_TYPE;

        let bytes: Uint8Array | BufferSource;

        switch (type) {
            case DATA_TYPE.STRING:
                bytes = new TextEncoder().encode(input as string);
                break;

            case DATA_TYPE.DATE:
                bytes = new TextEncoder().encode((input as Date).toString());
                break;

            case DATA_TYPE.UNSIGNED_BYTE_ARRAY:
                bytes = input as Uint8Array;
                break;

            case DATA_TYPE.ARRAY_BUFFER:
                bytes = new Uint8Array(input as ArrayBuffer);
                break;

            case DATA_TYPE.CRYPTO_KEY:
                bytes = await crypto.subtle.exportKey(
                    'raw',
                    input as CryptoKey,
                );
                break;

            case DATA_TYPE.OBJECT:
                bytes = await objectToBuffer(input as object);
                break;

            case DATA_TYPE.NUMBER:
            case DATA_TYPE.BOOLEAN:
            case DATA_TYPE.UNDEFINED:
            case DATA_TYPE.NULL:
                throw new Error(`Invalid data type ${type}`);
            default:
                throw new Error('Unable to extract buffer.');
        }

        return new Buffer(
            bytes instanceof Uint8Array
                ? bytes
                : new Uint8Array(bytes as ArrayBuffer),
        );
    }
}
