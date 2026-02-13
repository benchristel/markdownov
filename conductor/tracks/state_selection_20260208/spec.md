# Specification: State Type Selection

## Overview
The `Markdownov` class currently uses a fixed state type--`PosTaggedState`. This track aims to allow users to choose the state type via a constructor parameter.

## Requirements
- A union type definition for versioned state names (e.g., `'order1-v7'`, `'order2-v0'`, `'pos-tagged-v1'`).
- A factory function that returns the appropriate state constructor based on the provided name.
- `Markdownov` constructor accepts an optional `state` parameter in its options object.
- Markdownov remains backwards compatibile with existing uses, ie default to a sensible state if none is provided.

## Implementation Details
- **Union Type:** `StateName = 'order1' | 'order2' | 'pos-tagged-v1'` (or similar versioned names).
- **Factory:** A function mapping `StateName` to the corresponding class (e.g., `Order1State`, `Order2State`, `PosTaggedState`).
- **Options Update:** Add `state?: StateName` to the `MarkdownovOptions` interface.