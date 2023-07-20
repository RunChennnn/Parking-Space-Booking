import { render, screen } from '@testing-library/react';
import AccountDetailRow from '../components/AccountDetailRow';

describe('AccountDetailRow', () => {
  it('Displays correct header text', () => {
    const props = {
      head: 'Email address',
      body: 'hello@world.org'
    };
    render(AccountDetailRow(props));
    expect(screen.getByText(/Email address/i)).toBeInTheDocument()
  })

  it('Displays correct body text', () => {
    const props = {
      head: 'Email address',
      body: 'hello@world.org'
    };
    render(AccountDetailRow(props));
    expect(screen.getByText(/hello@world.org/i)).toBeInTheDocument()
  })
})
