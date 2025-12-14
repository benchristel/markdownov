export interface Token {
    toString(): string;
}

export interface State<T extends Token> {
    id(): string;
    update(token: T, tokenFrequencies: TokenFrequencies<T>): void;
    isTerminal(): boolean;
    terminalToken(): T;
}

export interface TokenFrequencies<T extends Token> {
    fractionOfAllTokens(token: T): number;
}
