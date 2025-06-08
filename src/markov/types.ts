export const END = ""

export interface Order {
    textBoundary(): typeof END[];
    initialState(): State;
    tokenize(text: string): string[];
}

export interface State {
    id(): string;
    update(token: string): void;
    tail(): string[];
}
