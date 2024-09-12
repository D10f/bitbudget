import { base64ToBytes, bytesToBase64, bytesToHex } from '@helpers/encoding';

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
    private constructor(private _data: Uint8Array) {}

    /**
     * Returns the buffer data encoded using the specified encoding. If
     * not specified, it defaults to UTF-8.
     */
    toString(encoding: 'hex' | 'base64' | 'utf-8' | 'utf8' = 'utf-8') {
        switch (encoding) {
            case 'utf-8':
            case 'utf8':
                return new TextDecoder().decode(this._data);
            case 'hex':
                return bytesToHex(this._data);
            case 'base64':
                return bytesToBase64(this._data);
        }
    }

    get data() {
        return this._data;
    }

    get size() {
        return this._data.byteLength;
    }

    static alloc(size: number) {
        return new Buffer(new Uint8Array(size));
    }

    /**
     * Accepts as input any number of sources of buffer or typed array,
     * and returns them as single instance of Buffer.
     */
    static async concat(...args: Array<Buffer | Uint8Array | ArrayBuffer>) {
        const combinedBuffer = Buffer.alloc(1024);
        let offset = 0;

        for (const arg of args) {
            const buffer = await Buffer.from(arg);

            while (buffer.size + offset > combinedBuffer.size) {
                combinedBuffer.expand();
            }

            combinedBuffer.data.set(buffer.data, offset);
            offset += buffer.size;
        }

        combinedBuffer.shrink(offset);
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

    /**
     * Reduces the size of the underlying Uint8Array. If *new_size* is
     * greater than the current size, it does nothing.
     */
    private shrink(newSize: number) {
        if (newSize >= this.size) return;
        this._data = this._data.subarray(0, newSize);
    }

    /**
     * Doubles the size of the underlying Uint8Array.
     */
    private expand() {
        const tmp = this._data.subarray();
        this._data = new Uint8Array(this.size * 2);
        this._data.set(tmp);
    }
}
