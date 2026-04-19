import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn, googleSignIn } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (data: any) => {
    setError('');
    try {
      await signIn(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError("Invalid email or password");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      const userInfo = {
        name: result.user?.displayName,
        email: result.user?.email,
        photo: result.user?.photoURL,
        role: 'Worker', // Default
      };
      await axiosPublic.post('/users', userInfo);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-morphism p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                {...register("email", { required: true })}
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                {...register("password", { required: true })}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-95"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
            >
              <img className="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
