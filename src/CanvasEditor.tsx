import React, { ReactElement, useEffect, useState } from 'react';
import {
    loadShapesFromLocalStorage,
    saveShapesToLocalStorage,
    Shape as ServiceShape,
} from './CanvasEditor.service';
import SideToolbar from './SideToolbar';

interface Shape {
    id: string;
    type: 'square';
    x: number;
    y: number;
}

const defaultSquarePosition = { x: 20, y: 20 };

const CanvasEditor: React.FC = (): ReactElement => {
    const [shapes, setShapes] = useState<ServiceShape[]>(
        loadShapesFromLocalStorage()
    );
    const [draggedShapeId, setDraggedShapeId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{
        x: number;
        y: number;
    } | null>(null);

    // useEffect(() => {
    //     const loadedShapes: ServiceShape[] = loadShapesFromLocalStorage();
    //     setShapes(loadedShapes);
    // }, []);

    useEffect(() => {
        saveShapesToLocalStorage(shapes);
    }, [shapes]);

    const handleAddSquare = (): void => {
        setShapes((prevShapes) => [
            ...prevShapes,
            {
                id: `square-${Date.now()}-${Math.random()}`,
                type: 'square',
                x: defaultSquarePosition.x,
                y: defaultSquarePosition.y,
            },
        ]);
    };

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement>,
        shapeId: string
    ): void => {
        event.stopPropagation();
        const shape = shapes.find((s) => s.id === shapeId);
        if (!shape) return;
        const rect = (event.target as HTMLDivElement).getBoundingClientRect();
        setDraggedShapeId(shapeId);
        setDragOffset({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (!draggedShapeId || !dragOffset) return;
        const canvasRect = (
            event.currentTarget as HTMLDivElement
        ).getBoundingClientRect();
        const newX = event.clientX - canvasRect.left - dragOffset.x;
        const newY = event.clientY - canvasRect.top - dragOffset.y;
        setShapes((prevShapes) =>
            prevShapes.map((shape) =>
                shape.id === draggedShapeId
                    ? {
                          ...shape,
                          x: Math.max(0, Math.min(newX, 500 - 40)),
                          y: Math.max(0, Math.min(newY, 500 - 40)),
                      }
                    : shape
            )
        );
    };

    const handleMouseUp = (): void => {
        setDraggedShapeId(null);
        setDragOffset(null);
    };

    return (
        <div className="flex h-screen w-screen bg-gray-100">
            <SideToolbar onShapeClick={handleAddSquare} />
            <div className="flex flex-1 items-center justify-center">
                <div
                    data-testid="canvas-area"
                    className="bg-white relative"
                    style={{ width: '500px', height: '500px' }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {shapes.map((shape) => (
                        <div
                            key={shape.id}
                            className="bg-black absolute cursor-move"
                            style={{
                                width: '40px',
                                height: '40px',
                                left: `${shape.x}px`,
                                top: `${shape.y}px`,
                            }}
                            data-testid="canvas-square"
                            onMouseDown={(event) =>
                                handleMouseDown(event, shape.id)
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CanvasEditor;
