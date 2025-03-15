import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { UserDataContext } from '../../context/UserContext';
import Navbar from '../../components/layout/Navbar';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const { setUser } = useContext(UserDataContext);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, data);
      if (response.status === 201 || response.status === 200) {
        console.log("Login Successful");
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen relative  bg-cover bg-center" style={{ backgroundColor: '#2b4162', backgroundImage: 'linear-gradient(315deg, #2b4162 0%, #12100e 74%)' }}>
      <Navbar />
      <div className="flex flex-col justify-center py-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-white mx-auto" />
          <h2 className="mt-6 text-3xl font-bold text-white">Log in to your account</h2>
          <p className="mt-2 text-sm text-white">
            Or{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Card className="h-full hover:shadow-md transition-shadow duration-200 rounded-lg shadow-lg bg-white/30 backdrop-blur-md border border-white/20 shadow-lg rounded-xl w-full max-w-md">
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                
                <Input
                  label="Password"
                  
                  type="password"
                  autoComplete="current-password"
                  error={errors.password?.message}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />

                <div className="flex items-center justify-between text-sm text-white">
                  <div className="flex items-center">
                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2">Remember me</label>
                  </div>
                  <a href="#" className="text-blue-600 hover:text-blue-500">Forgot password?</a>
                </div>

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  Log in
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;