/**
 * @author Anders Marzi Tornblad
 * https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
 */
export function isBase64(str: string) {
    const base64Regexp =
        /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64Regexp.test(str);
}

/**
 * Converts an array of bytes into a base64-encoded string.
 */
export function bytesToBase64(bytes: Uint8Array) {
    let b64 = '';
    for (const byte of bytes) {
        b64 += String.fromCodePoint(byte);
    }
    return btoa(b64);
}

/**
 * Converts a base64-encoded string into an byte array.
 */
export function base64ToBytes(str: string) {
    if (!isBase64(str)) {
        throw new Error('Provided string is not base64 encoded.');
    }
    const byteStr = atob(str);
    const byteArr = new Uint8Array(byteStr.length);
    for (let i = 0, l = byteStr.length; i < l; ++i) {
        byteArr[i] = byteStr[i].codePointAt(0) as number;
    }
    return byteArr;
}
