# Test Case Plan

## 1. DataTable.service.tsx

-   Unit tests for `getTotalPages`:
    -   Should return correct total pages for various user counts and rows per page.
    -   Should handle edge cases (zero/negative rows, empty users array).
-   Unit tests for `getUsersToDisplay`:
    -   Should return correct slice for given page and rows.
    -   Should handle edge cases (out-of-bounds page, zero/negative rows, empty users array).

## 2. DataTable.tsx

-   Update/maintain existing tests to ensure the component renders correctly using the new service functions.
-   Mock the service functions as needed in component tests.
