// CanvasEditor.service.tsx
// Service file for CanvasEditor drag logic helpers

export interface Shape {
    id: string;
    type: 'square';
    x: number;
    y: number;
}

const LOCAL_STORAGE_KEY: string = 'canvas-editor-shapes';

export const saveShapesToLocalStorage = (shapes: Shape[]): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shapes));
};

export const loadShapesFromLocalStorage = (): Shape[] => {
    const data: string | null = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data) as Shape[];
    } catch {
        return [];
    }
};

export const clearShapesFromLocalStorage = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export const calculateNewPosition = (
    mouseX: number,
    mouseY: number,
    canvasRect: DOMRect,
    dragOffset: { x: number; y: number }
): { x: number; y: number } => {
    // Example logic for calculating new position
    const x = mouseX - canvasRect.left - dragOffset.x;
    const y = mouseY - canvasRect.top - dragOffset.y;
    return { x, y };
};
