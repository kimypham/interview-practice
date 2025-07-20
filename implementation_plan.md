# Implementation Plan

## 1. Update DataTable.service.tsx

-   Implement two functions:
    -   `getTotalPages(users: User[], rowsToShow: number): number`
        -   Calculates the total number of pages based on the number of users and rows per page.
    -   `getUsersToDisplay(users: User[], rowsToShow: number, currentPage: number): User[]`
        -   Returns the slice of users to display for the current page and rows per page.

## 2. Refactor DataTable.tsx

-   Remove all pagination logic from the component.
-   Import and use `getTotalPages` and `getUsersToDisplay` from the service file.

## Pagination for DataTable Component

**Goal:**
Enable pagination in the `DataTable` component so that clicking "Next" or "Prev" updates the displayed users, and disables the buttons appropriately.

### Planned Steps (atomic, per file/function):

1. **DataTable.tsx**
    - Implement the "Next" and "Prev" button click handlers to update the `currentPage` state.
    - Disable the "Prev" button when on the first page.
    - Disable the "Next" button when on the last page.
    - Ensure the correct users are displayed for the current page.
