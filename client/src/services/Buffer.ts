import { base64ToBytes, bytesToBase64 } from '../helpers/encoding';

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
 * Takes a regular JavaScript object and converts it into its byte
 * representation.
 */
async function objectToBuffer(obj: object) {
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
    return await blob.arrayBuffer();
}

/**
 * Wrapper class around typed array instances. Provides various methods
 * to access the raw bytes and to perform common operations like base64
 * or hexadecimal encoding.
 */
export class Buffer {
    private constructor(private readonly data: Uint8Array) {}

    /**
     * Returns the underlying Uint8Array data.
     */
    get raw() {
        return this.data;
    }

    /**
     * Returns the data in hexadecimal format.
     */
    get hex() {
        let hex = '';
        for (const byte of this.raw) {
            hex += byte.toString(16).padStart(2, '0');
        }
        return hex;
    }

    /**
     * Returns the data in base64 format.
     */
    get base64() {
        return bytesToBase64(this.raw);
    }

    /**
     * Accepts as input any number of sources of buffer or typed array,
     * and returns them as single instance of Buffer.
     */
    static async concat(...args: Array<Buffer | Uint8Array | ArrayBuffer>) {
        let byteLength = 0;
        const buffers: Uint8Array[] = [];

        for (const b of args) {
            const buffer = await Buffer.from(b);
            buffers.push(buffer.raw);
            byteLength += buffer.raw.byteLength;
        }

        const combinedBuffer = await Buffer.from(new Uint8Array(byteLength));

        let offset = 0;
        buffers.forEach((buffer) => {
            combinedBuffer.raw.set(buffer, offset);
            offset += buffer.byteLength;
        });

        return combinedBuffer;
    }

    /**
     * Accepts as input any form of data and converts it into its byte
     * representation. This is the entrypoint to make new instances of
     * this class.
     */
    static async from(input: unknown, encoding?: 'base64') {
        if (input instanceof Buffer) {
            return input;
        }

        const type = Object.prototype.toString
            .call(input)
            .match(/(\w+)[^[]$/)![1] as DATA_TYPE;

        let bytes: Uint8Array | BufferSource;

        switch (type) {
            case DATA_TYPE.STRING:
                bytes =
                    encoding === 'base64'
                        ? base64ToBytes(input as string)
                        : new TextEncoder().encode(input as string);
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
