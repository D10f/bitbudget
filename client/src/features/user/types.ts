export type User = {
    name: string;
    email: string;
    prefs: UserPrefs;

    /**
     * A tuple containing the user's master key and the vault key.
     */
    vault: [SymmetricKey, SymmetricKey] | [null, null];
};

export type UserPrefs = {
    theme: string;
};

export type SymmetricKey = JsonWebKey;
