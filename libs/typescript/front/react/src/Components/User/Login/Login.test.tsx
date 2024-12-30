import { render, screen } from '@testing-library/react';
import { RouterContext } from 'next/apps/shared/lib/router-context.shared-runtime';

import { LoginForm } from './Login';
// import { MyReduxWraper } from 'elo/front/react/Redux';
import { Provider } from 'react-redux';
import { store } from 'elo/front/react/Redux';
import Router from 'next-router-mock';

// jest.mock('next/router', () => ({
//   useRouter() {
//     return {
//       push: jest.fn(),
//     };
//   },
// }));

describe('Login', () => {
  test('renders the login form with email and password fields and a submit button', () => {
    Router.router = {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
    };

    const { container } = render(
      <Provider store={store}>
        <RouterContext.Provider value={Router}>
          <LoginForm />
        </RouterContext.Provider>
      </Provider>
    );

    expect(container).toMatchSnapshot();

    // Check if the form elements are present
    expect(screen.getByLabelText(/login/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /aceptar/i })).toBeTruthy();
  });

  // test('allows entering email and password', () => {
  //   render(<LoginSimply />);
  //   const emailInput = screen.getByLabelText(/login/i);
  //   const passwordInput = screen.getByLabelText(/password/i);

  //   // Use userEvent to simulate typing
  //   userEvent.type(emailInput, 'test@example.com');
  //   userEvent.type(passwordInput, 'password123');

  //   expect(emailInput).toHaveValue('test@example.com');
  //   expect(passwordInput).toHaveValue('password123');
  // });

  // test('handles form submission', () => {
  //   const mockSubmit = jest.fn();
  //   render(<LoginSimply onSubmit={mockSubmit} />); // Assuming you pass onSubmit as a prop for demonstration

  //   const emailInput = screen.getByLabelText(/login/i);
  //   const passwordInput = screen.getByLabelText(/password/i);
  //   const submitButton = screen.getByRole('button', { name: /aceptar/i });

  //   // Simulate user input
  //   userEvent.type(emailInput, 'test@example.com');
  //   userEvent.type(passwordInput, 'password123');

  //   // Simulate form submission by clicking the submit button
  //   userEvent.click(submitButton);

  //   expect(mockSubmit).toHaveBeenCalled();
  //   // If you want to ensure the correct data is being passed, adjust your component to use onSubmit prop effectively.
});
