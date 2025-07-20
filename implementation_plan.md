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
