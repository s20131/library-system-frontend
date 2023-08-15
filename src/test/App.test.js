import { render, screen } from '@testing-library/react';
import { expect, it } from '@jest/globals';
import App from '../App';

it('renders main page with books in the nav bar', () => {
  render(<App />);
  const linkElement = screen.getAllByText(/książki/i)[0];
  expect(linkElement).toBeInTheDocument();
});
