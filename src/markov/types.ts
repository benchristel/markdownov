export interface Token {
    toString(): string;
}

export interface State<T extends Token> {
    /**
     * An opaque string representing the Markov model's (lossy) memory of the
     * preceding text.
     */
    context(): string;
    /**
     * Advance the state by the given token. Mutates the receiver.
     */
    update(token: T): void;
    /**
     * Whether the text generation has reached a natural conclusion.
     */
    isTerminal(): boolean;
    /**
     * A token that, if repeated passed to `update()`, will eventually cause
     * `isTerminal()` to be true.
     */
    terminalToken(): T;
}
