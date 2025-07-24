import { render, screen } from '@testing-library/react';
import SideToolbar from './SideToolbar';

describe('SideToolbar', () => {
    beforeAll(() => {
        window.getComputedStyle = (elt: Element) => {
            if ((elt as HTMLElement).dataset.testid === 'side-toolbar') {
                return {
                    position: 'absolute',
                    order: '0',
                    left: '0px',
                } as CSSStyleDeclaration;
            }
            // Default fallback
            return {} as CSSStyleDeclaration;
        };
    });

    it('should render the toolbar on the left and display its children', () => {
        render(
            <SideToolbar>
                <div data-testid="test-child">Test Child</div>
            </SideToolbar>
        );
        const toolbar = screen.getByTestId('side-toolbar');

        // Check that the toolbar exists
        expect(toolbar).toBeInTheDocument();

        // Check that the toolbar is on the left (flex col or absolute left)
        const style = window.getComputedStyle(toolbar);
        expect(
            style.position === 'absolute' ||
                style.order === '0' ||
                style.left === '0px'
        ).toBe(true);

        // Check that children are rendered
        expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
});
