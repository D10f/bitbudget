export type User = {
    data: UserData;
    prefs: UserPrefs;
    vault: CryptoKey[];
};

export type UserData = {
    name: string;
    email: string;
};

export type UserPrefs = {
    theme: string;
};
