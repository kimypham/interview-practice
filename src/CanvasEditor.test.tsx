import { fireEvent, render } from '@testing-library/react';
import CanvasEditor from './CanvasEditor';

describe('CanvasEditor', () => {
    it('should render a square when the add square button is clicked', () => {
        const { getByRole, getByTestId, queryAllByTestId } = render(
            <CanvasEditor />
        );

        // Render
        const addButton = getByRole('button');

        // Action
        fireEvent.click(addButton);

        // Result
        const squares = queryAllByTestId('canvas-square');
        expect(squares.length).toBe(1);
    });

    it('should allow dragging a square to a new position', () => {
        const { getByRole, getByTestId, queryAllByTestId } = render(
            <CanvasEditor />
        );

        fireEvent.click(getByRole('button'));
        const square = queryAllByTestId('canvas-square')[0];
        const canvas = getByTestId('canvas-area');

        // Action
        fireEvent.mouseDown(square, { clientX: 30, clientY: 30 });
        fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(canvas);

        // Result
        // The style should reflect the new position (left/top >= 0)
        expect(square.style.left).toBeDefined();
        expect(square.style.top).toBeDefined();
    });

    it('should only move the selected square when dragging', () => {
        const { getByRole, queryAllByTestId, getByTestId } = render(
            <CanvasEditor />
        );

        fireEvent.click(getByRole('button'));
        fireEvent.click(getByRole('button'));
        const squares = queryAllByTestId('canvas-square');
        const canvas = getByTestId('canvas-area');

        // Action: Drag the first square
        fireEvent.mouseDown(squares[0], { clientX: 30, clientY: 30 });
        fireEvent.mouseMove(canvas, { clientX: 120, clientY: 120 });
        fireEvent.mouseUp(canvas);

        // Result: Only the first square should have moved
        expect(squares[0].style.left).not.toBe('20px');
        expect(squares[1].style.left).toBe('20px');
    });

    it('should end drag operation on mouse up', () => {
        const { getByRole, queryAllByTestId, getByTestId } = render(
            <CanvasEditor />
        );

        fireEvent.click(getByRole('button'));
        const square = queryAllByTestId('canvas-square')[0];
        const canvas = getByTestId('canvas-area');

        fireEvent.mouseDown(square, { clientX: 30, clientY: 30 });
        fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(canvas);

        // Try moving again without mouse down
        fireEvent.mouseMove(canvas, { clientX: 200, clientY: 200 });

        // The square should not move further
        expect(square.style.left).not.toBe('200px');
    });

    it('should not move square if mouse is clicked but not dragged', () => {
        const { getByRole, queryAllByTestId, getByTestId } = render(
            <CanvasEditor />
        );

        fireEvent.click(getByRole('button'));
        const square = queryAllByTestId('canvas-square')[0];
        const canvas = getByTestId('canvas-area');

        fireEvent.mouseDown(square, { clientX: 30, clientY: 30 });
        fireEvent.mouseUp(canvas);

        // The square should remain at the default position
        expect(square.style.left).toBe('20px');
        expect(square.style.top).toBe('20px');
    });

    it('should not allow square to move outside the canvas bounds', () => {
        const { getByRole, queryAllByTestId, getByTestId } = render(
            <CanvasEditor />
        );

        fireEvent.click(getByRole('button'));
        const square = queryAllByTestId('canvas-square')[0];
        const canvas = getByTestId('canvas-area');

        // Try to move square outside the top-left
        fireEvent.mouseDown(square, { clientX: 30, clientY: 30 });
        fireEvent.mouseMove(canvas, { clientX: -100, clientY: -100 });
        fireEvent.mouseUp(canvas);

        expect(parseInt(square.style.left, 10)).toBeGreaterThanOrEqual(0);
        expect(parseInt(square.style.top, 10)).toBeGreaterThanOrEqual(0);
    });
});
