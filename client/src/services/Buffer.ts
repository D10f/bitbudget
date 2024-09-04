type DataType =
    | 'Array'
    | 'ArrayBuffer'
    | 'Boolean'
    | 'CryptoKey'
    | 'Date'
    | 'Null'
    | 'Number'
    | 'Object'
    | 'Promise'
    | 'RegExp'
    | 'String'
    | 'Uint8Array'
    | 'Undefined';

export type RawBytes =
    | Uint8Array
    | ArrayBuffer
    | Promise<Uint8Array | ArrayBuffer>;

/**
 * Wrapper class around ArrayBuffer and Uint8Array instances.
 */
export class Buffer {
    private readonly buffer: unknown;
    public readonly type: DataType;

    constructor(buffer: unknown) {
        this.type = Object.prototype.toString
            .call(buffer)
            .match(/(\w+)[^[]$/)![1] as DataType;

        switch (this.type) {
            case 'Number':
            case 'Boolean':
            case 'Undefined':
            case 'Null':
                throw new Error(`Invalid data type ${this.type}`);
            default:
                this.buffer = buffer;
        }
    }

    get raw(): RawBytes {
        switch (this.type) {
            case 'String':
                return new TextEncoder().encode(this.buffer as string);
            case 'Date':
                return new TextEncoder().encode(
                    (this.buffer as Date).toString(),
                );
            case 'Uint8Array':
                return this.buffer as Uint8Array;
            case 'ArrayBuffer':
                return new Uint8Array(this.buffer as ArrayBuffer);
            case 'CryptoKey':
                return this.cryptoKeyToBuffer();
            case 'Object':
                return this.objectToBuffer();
            default:
                throw new Error('Unable to extract buffer.');
        }
    }

    get hex() {
        const bytes = this.raw;
        if (bytes instanceof Promise) {
            return new Promise((resolve) => {
                bytes.then((b) => resolve(this._hex(new Uint8Array(b))));
            });
        }
        return this._hex(bytes as Uint8Array);
    }

    get base64() {
        const bytes = this.raw;
        if (bytes instanceof Promise) {
            return new Promise((resolve) => {
                bytes.then((b) => resolve(this._base64(new Uint8Array(b))));
            });
        }
        return this._base64(bytes as Uint8Array);
    }

    static from(input: unknown) {
        if (input instanceof Buffer) {
            return input;
        }
        return new Buffer(input);
    }

    private _hex(bytes: Uint8Array) {
        let hex = '';
        for (const byte of bytes) {
            hex += byte.toString(16).padStart(2, '0');
        }
        return hex;
    }

    private _base64(bytes: Uint8Array) {
        let b64 = '';
        for (const byte of bytes) {
            b64 += String.fromCodePoint(byte);
        }
        return btoa(b64);
    }

    private objectToBuffer() {
        const data = JSON.stringify(this.buffer);
        const blob = new Blob([data], { type: 'application/json' });
        return blob.arrayBuffer();
    }

    private cryptoKeyToBuffer() {
        if (!(this.buffer as CryptoKey).extractable) {
            throw new Error('Unable to extract CryptoKey');
        }
        return crypto.subtle.exportKey('raw', this.buffer as CryptoKey);
    }
}
