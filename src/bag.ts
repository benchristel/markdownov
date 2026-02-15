import {equals} from "@benchristel/taste"

interface BagEntry<T> {
    element: T;
    count: number;
}
export class Bag<T> {
    private contents: BagEntry<T>[] = []
    private size: number = 0

    add(element: T) {
        this.size++
        for (const existing of this.contents) {
            if (equals(existing.element, element)) {
                existing.count++
                return
            }
        }
        this.contents.push({element, count: 1})
    }

    pick(position: number) {
        // TODO: `target` is a lousy name. Rename.
        let target = position * this.size
        for (const {element, count} of this.contents) {
            target -= count
            if (target <= 0) {
                return element
            }
        }
    }

    countUnique(): number {
        return this.contents.length
    }
}
