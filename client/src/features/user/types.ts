export type User = {
    name: string;
    email: string;
    prefs: UserPrefs;
    vault: SymmetricKey[];
};

export type UserPrefs = {
    theme: string;
};

export type SymmetricKey = JsonWebKey;
