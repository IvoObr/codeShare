class Helpers {
    
    /** Generates 30 characters long, base36 encoded
    * @param - desired hash length
    * @returns - base36 encoded string
    */
    public genBase36Key(length: number = 30): string {
        let key: string = '';

        for (let index: number = 0; index < length; index++) {
            const num: number = Math.floor(Math.random() * 36);
            const str: string = num.toString(36);
            key += str;
        }
        return key;
    }

    public isPasswordStrong(password: string): boolean {

        const minLength: boolean = password.length > 8;
        const oneUppercase: boolean = new RegExp(/[A-Z]/).test(password);
        const oneLowercase: boolean = new RegExp(/[a-z]/).test(password);
        const oneNumber: boolean = new RegExp(/[0-9]/).test(password);
        const oneSymbol: boolean = new RegExp(/[-#!$@%^&*()_+|~=`{}\[\]:";'<>?,.\/]/).test(password);

        return minLength && oneUppercase && oneLowercase && oneNumber && oneSymbol;
    }

    public isEmailValid(email: string): boolean {
        const regex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }
}

export default new Helpers();

