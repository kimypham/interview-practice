import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('should render the app', () => {
        render(<App />);
        expect(
            screen.getByText('Hello World! (And hello Canva!)')
        ).toBeInTheDocument();
    });
});
