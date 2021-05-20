/** Generates n characters long, base36 encoded
 * @param - desired hash length default 30
 * @returns - base36 encoded string
 */
export default function genBase36Key(length: number = 30): string {
    let key: string = '';

    for (let index: number = 0; index < length; index++) {
        const num: number = Math.floor(Math.random() * 36);
        const str: string = num.toString(36);
        key += str;
    }
    return key;
}