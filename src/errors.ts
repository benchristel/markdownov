export function errorThrownFrom(f: () => void) {
    try {
        f()
    } catch (e) {
        return e
    }
}
