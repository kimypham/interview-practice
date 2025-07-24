import React, { ReactElement, ReactNode } from 'react';

interface SideToolbarProps {
    children?: ReactNode;
    onShapeClick?: () => void;
}

const SideToolbar: React.FC<SideToolbarProps> = ({
    children,
    onShapeClick,
}: SideToolbarProps): ReactElement => {
    return (
        <aside
            data-testid="side-toolbar"
            className="flex flex-col items-center justify-start w-20 h-full bg-gray-200 py-4"
            style={{ minWidth: '80px' }}
        >
            <button
                type="button"
                aria-label="Add square"
                className="bg-black w-10 h-10 mb-4 focus:outline-none"
                onClick={onShapeClick}
                data-testid="toolbar-square"
            />
            {children}
        </aside>
    );
};

export default SideToolbar;
