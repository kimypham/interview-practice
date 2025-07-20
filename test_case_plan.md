# Test Case Plan

## 1. DataTable.service.tsx

-   Unit tests for `getTotalPages`:
    -   Should return correct total pages for various user counts and rows per page.
    -   Should handle edge cases (zero/negative rows, empty users array).
-   Unit tests for `getUsersToDisplay`:
    -   Should return correct slice for given page and rows.
    -   Should handle edge cases (out-of-bounds page, zero/negative rows, empty users array).

## Pagination for DataTable Component

### DataTable.tsx

-   Assert that the "Prev" button is disabled on the first page.
-   Assert that the "Next" button is disabled on the last page.
-   Assert that clicking "Next" updates the displayed users to the next slice.
-   Assert that clicking "Prev" updates the displayed users to the previous slice.
-   Assert that the correct users are displayed for each page.
-   Assert that the page number updates correctly.
-   Edge case: If there are fewer users than the selected rows per page, both buttons should be disabled.
-   Edge case: If the users list is empty, both buttons should be disabled and no rows are shown.
