The user of the Markdownov class should be able to choose a state type via a constructor parameter.

The parameter should be a string specifying which state type to use. It should use a union type.

There should be a factory function that selects the appropriate state constructor given one of the string names.

The string names should be versioned because the models will change over time.
