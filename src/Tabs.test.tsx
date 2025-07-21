import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Tabs from './Tabs';

describe('Tabs', () => {
    describe('Component rendering', () => {
        it('should render all tab buttons when component mounts', () => {
            render(<Tabs />);

            expect(
                screen.getByRole('button', { name: 'HTML' })
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: 'CSS' })
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: 'JavaScript' })
            ).toBeInTheDocument();
        });

        it('should render all paragraphs when component mounts', () => {
            render(<Tabs />);

            expect(
                screen.getByText(/The HyperText Markup Language or HTML/)
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    /Cascading Style Sheets is a style sheet language/
                )
            ).toBeInTheDocument();
            expect(
                screen.getByText(/JavaScript, often abbreviated as JS/)
            ).toBeInTheDocument();
        });

        it('should render HTML button with correct text when component mounts', () => {
            render(<Tabs />);

            expect(
                screen.getByRole('button', { name: 'HTML' })
            ).toBeInTheDocument();
        });

        it('should render CSS button with correct text when component mounts', () => {
            render(<Tabs />);

            expect(
                screen.getByRole('button', { name: 'CSS' })
            ).toBeInTheDocument();
        });

        it('should render JavaScript button with correct text when component mounts', () => {
            render(<Tabs />);

            expect(
                screen.getByRole('button', { name: 'JavaScript' })
            ).toBeInTheDocument();
        });
    });

    describe('Initial state', () => {
        it('should show first tab as active by default when component mounts', () => {
            render(<Tabs />);

            const htmlButton = screen.getByRole('button', { name: 'HTML' });
            expect(htmlButton).toHaveClass('bg-blue-500');
        });

        it('should show first paragraph visible by default when component mounts', () => {
            render(<Tabs />);

            const htmlParagraph = screen.getByText(
                /The HyperText Markup Language or HTML/
            );
            expect(htmlParagraph).toBeVisible();
        });

        it('should hide non-active paragraphs by default when component mounts', () => {
            render(<Tabs />);

            const cssParagraph = screen.getByText(
                /Cascading Style Sheets is a style sheet language/
            );
            const jsParagraph = screen.getByText(
                /JavaScript, often abbreviated as JS/
            );

            expect(cssParagraph).toHaveClass('hidden');
            expect(jsParagraph).toHaveClass('hidden');
        });
    });

    describe('Button interaction', () => {
        it('should highlight HTML button when HTML button is clicked', () => {
            render(<Tabs />);

            const htmlButton = screen.getByRole('button', { name: 'HTML' });
            fireEvent.click(htmlButton);

            expect(htmlButton).toHaveClass('bg-blue-500');
        });

        it('should show HTML paragraph when HTML button is clicked', () => {
            render(<Tabs />);

            const htmlButton = screen.getByRole('button', { name: 'HTML' });
            fireEvent.click(htmlButton);

            const htmlParagraph = screen.getByText(
                /The HyperText Markup Language or HTML/
            );
            expect(htmlParagraph).toBeVisible();
        });

        it('should hide other paragraphs when HTML button is clicked', () => {
            render(<Tabs />);

            const htmlButton = screen.getByRole('button', { name: 'HTML' });
            fireEvent.click(htmlButton);

            const cssParagraph = screen.getByText(
                /Cascading Style Sheets is a style sheet language/
            );
            const jsParagraph = screen.getByText(
                /JavaScript, often abbreviated as JS/
            );

            expect(cssParagraph).toHaveClass('hidden');
            expect(jsParagraph).toHaveClass('hidden');
        });

        it('should highlight CSS button when CSS button is clicked', () => {
            render(<Tabs />);

            const cssButton = screen.getByRole('button', { name: 'CSS' });
            fireEvent.click(cssButton);

            expect(cssButton).toHaveClass('bg-blue-500');
        });

        it('should show CSS paragraph when CSS button is clicked', () => {
            render(<Tabs />);

            const cssButton = screen.getByRole('button', { name: 'CSS' });
            fireEvent.click(cssButton);

            const cssParagraph = screen.getByText(
                /Cascading Style Sheets is a style sheet language/
            );
            expect(cssParagraph).toBeVisible();
        });

        it('should hide other paragraphs when CSS button is clicked', () => {
            render(<Tabs />);

            const cssButton = screen.getByRole('button', { name: 'CSS' });
            fireEvent.click(cssButton);

            const htmlParagraph = screen.getByText(
                /The HyperText Markup Language or HTML/
            );
            const jsParagraph = screen.getByText(
                /JavaScript, often abbreviated as JS/
            );

            expect(htmlParagraph).toHaveClass('hidden');
            expect(jsParagraph).toHaveClass('hidden');
        });

        it('should highlight JavaScript button when JavaScript button is clicked', () => {
            render(<Tabs />);

            const jsButton = screen.getByRole('button', { name: 'JavaScript' });
            fireEvent.click(jsButton);

            expect(jsButton).toHaveClass('bg-blue-500');
        });

        it('should show JavaScript paragraph when JavaScript button is clicked', () => {
            render(<Tabs />);

            const jsButton = screen.getByRole('button', { name: 'JavaScript' });
            fireEvent.click(jsButton);

            const jsParagraph = screen.getByText(
                /JavaScript, often abbreviated as JS/
            );
            expect(jsParagraph).toBeVisible();
        });

        it('should hide other paragraphs when JavaScript button is clicked', () => {
            render(<Tabs />);

            const jsButton = screen.getByRole('button', { name: 'JavaScript' });
            fireEvent.click(jsButton);

            const htmlParagraph = screen.getByText(
                /The HyperText Markup Language or HTML/
            );
            const cssParagraph = screen.getByText(
                /Cascading Style Sheets is a style sheet language/
            );

            expect(htmlParagraph).toHaveClass('hidden');
            expect(cssParagraph).toHaveClass('hidden');
        });
    });

    describe('State management', () => {
        it('should update active tab state when different button is clicked', () => {
            render(<Tabs />);

            const htmlButton = screen.getByRole('button', { name: 'HTML' });
            const cssButton = screen.getByRole('button', { name: 'CSS' });

            fireEvent.click(cssButton);

            expect(cssButton).toHaveClass('bg-blue-500');
            expect(htmlButton).not.toHaveClass('bg-blue-500');
        });

        it('should remove highlight from previous button when new button is clicked', () => {
            render(<Tabs />);

            const htmlButton = screen.getByRole('button', { name: 'HTML' });
            const cssButton = screen.getByRole('button', { name: 'CSS' });

            fireEvent.click(htmlButton);
            fireEvent.click(cssButton);

            expect(htmlButton).not.toHaveClass('bg-blue-500');
            expect(cssButton).toHaveClass('bg-blue-500');
        });

        it('should maintain only one active tab at a time when buttons are clicked', () => {
            render(<Tabs />);

            const htmlButton = screen.getByRole('button', { name: 'HTML' });
            const cssButton = screen.getByRole('button', { name: 'CSS' });
            const jsButton = screen.getByRole('button', { name: 'JavaScript' });

            fireEvent.click(jsButton);

            const activeButtons = [htmlButton, cssButton, jsButton].filter(
                (button) => button.classList.contains('bg-blue-500')
            );
            expect(activeButtons).toHaveLength(1);
            expect(jsButton).toHaveClass('bg-blue-500');
        });
    });

    describe('Edge cases', () => {
        it('should handle rapid button clicks without errors when buttons are clicked quickly', () => {
            render(<Tabs />);

            const htmlButton = screen.getByRole('button', { name: 'HTML' });
            const cssButton = screen.getByRole('button', { name: 'CSS' });

            expect(() => {
                fireEvent.click(htmlButton);
                fireEvent.click(cssButton);
                fireEvent.click(htmlButton);
                fireEvent.click(cssButton);
            }).not.toThrow();
        });

        it('should maintain proper state when same button is clicked multiple times', () => {
            render(<Tabs />);

            const htmlButton = screen.getByRole('button', { name: 'HTML' });

            fireEvent.click(htmlButton);
            fireEvent.click(htmlButton);
            fireEvent.click(htmlButton);

            expect(htmlButton).toHaveClass('bg-blue-500');
            const htmlParagraph = screen.getByText(
                /The HyperText Markup Language or HTML/
            );
            expect(htmlParagraph).toBeVisible();
        });
    });
});
