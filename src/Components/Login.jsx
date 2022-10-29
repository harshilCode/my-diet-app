import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { logInWithEmailAndPassword } from '../firebase'; 

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    logInWithEmailAndPassword(email, password);
    console.log({
      email,
      password
    })
  }

  return (
    // <div>
    //   <form onSubmit={handleSubmit}>
    //     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    //       Email
    //     </label>
    //     <div className="relative mt-1 rounded-md shadow-sm">
    //       <input
    //         type="email"
    //         name="email"
    //         id="email"
    //         value={email}
    //         className="block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
    //         placeholder="you@example.com"
    //         onChange={handleEmailChange}
    //         aria-invalid="true"
    //         aria-describedby="email-error"
    //       />
    //       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
    //         <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
    //       </div>
    //     </div>

    //     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
    //       Password
    //     </label>
    //     <div className="mt-1">
    //       <input
    //         type="password"
    //         name="password"
    //         id="password"
    //         value={password}
    //         onChange={handlePasswordChange}
    //         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    //         placeholder="Password"
    //       />
    //     </div>
    //     <button onClick={handleSubmit}>Login</button>
    //   </form>
    // </div>
    <div className="h-full bg-gray-50">
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    placeholder="you@example.com"
                    onChange={handleEmailChange}
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                {/* TODO - Create component and form with field email and integrate firebase function */}
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}