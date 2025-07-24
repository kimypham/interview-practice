import {
    calculateNewPosition,
    clearShapesFromLocalStorage,
    loadShapesFromLocalStorage,
    saveShapesToLocalStorage,
    Shape,
} from './CanvasEditor.service';

describe('CanvasEditor.service', () => {
    describe('calculateNewPosition', () => {
        it('should calculate correct new position based on mouse and offset', () => {
            const canvasRect = { left: 10, top: 10 } as DOMRect;
            const dragOffset = { x: 5, y: 5 };
            const result = calculateNewPosition(50, 60, canvasRect, dragOffset);
            expect(result).toEqual({ x: 35, y: 45 });
        });

        it('should handle negative positions', () => {
            const canvasRect = { left: 100, top: 100 } as DOMRect;
            const dragOffset = { x: 10, y: 10 };
            const result = calculateNewPosition(90, 90, canvasRect, dragOffset);
            expect(result).toEqual({ x: -20, y: -20 });
        });
    });

    const testShapes: Shape[] = [
        { id: '1', type: 'square', x: 10, y: 20 },
        { id: '2', type: 'square', x: 30, y: 40 },
    ];
    const LOCAL_STORAGE_KEY = 'canvas-editor-shapes';

    beforeEach(() => {
        localStorage.clear();
    });

    describe('saveShapesToLocalStorage', () => {
        it('should save shapes to localStorage when called with valid data', () => {
            saveShapesToLocalStorage(testShapes);

            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            expect(saved).toBe(JSON.stringify(testShapes));
        });
    });

    describe('loadShapesFromLocalStorage', () => {
        it('should load shapes from localStorage when data exists', () => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(testShapes));

            const loaded = loadShapesFromLocalStorage();
            expect(loaded).toEqual(testShapes);
        });

        it('should return an empty array when no data exists', () => {
            const loaded = loadShapesFromLocalStorage();
            expect(loaded).toEqual([]);
        });

        it('should return an empty array when data is invalid', () => {
            localStorage.setItem(LOCAL_STORAGE_KEY, 'not-json');
            const loaded = loadShapesFromLocalStorage();
            expect(loaded).toEqual([]);
        });
    });

    describe('clearShapesFromLocalStorage', () => {
        it('should remove the saved state from localStorage', () => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(testShapes));
            clearShapesFromLocalStorage();
            expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
        });
    });
});
