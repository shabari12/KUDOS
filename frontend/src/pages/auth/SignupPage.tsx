import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { UserDataContext } from '../../context/UserContext';
import Navbar from '../../components/layout/Navbar';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignupFormData>();
  const password = watch('password');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const { setUser } = useContext(UserDataContext);

  const onSubmit = async (data: SignupFormData) => {
    try {
      const newUser = {
        username: data.name,
        email: data.email,
        password: data.password
      };
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
      if (response.status === 201 || response.status === 200) {
        setEmail(data.email);
        setUsername(data.name);
        setUserPassword(data.password);
        setShowOtpInput(true);
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleOtpSubmit = async (data: SignupFormData) => {
    try {
      const subUser = {
        email: email,
        otp: data.otp,
        username: username,
        password: userPassword,
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/verify-otp`, subUser);
      if (response.status === 201 || response.status === 200) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        console.log("OTP verification failed");
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#8EC5FC] to-[#E0C3FC] bg-cover bg-center">
      <Navbar />
      <div className="sm:mx-auto sm:w-full sm:max-w-md p-10">
        <div className="flex justify-center">
          <MessageSquare className="h-12 w-12 text-black" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-black hover:text-blue-500">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="h-full hover:shadow-md transition-shadow duration-200 rounded-lg shadow-lg bg-white/30 backdrop-blur-md border border-white/20 shadow-lg rounded-xl w-full max-w-md">
          <CardContent className="pt-6">
            {!showOtpInput ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    label="Username"
                    autoComplete="name"
                    error={errors.name?.message}
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                </div>

                <div>
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
                </div>

                <div>
                  <Input
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    error={errors.password?.message}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                </div>

                <div>
                  <Input
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Sign up
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-6">
                <div>
                  <Input
                    label="OTP"
                    type="text"
                    autoComplete="one-time-code"
                    error={errors.otp?.message}
                    {...register('otp', { 
                      required: 'OTP is required',
                      minLength: {
                        value: 4,
                        message: 'OTP must be 4 digits'
                      },
                      maxLength: {
                        value: 4,
                        message: 'OTP must be 4 digits'
                      }
                    })}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Submit OTP
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-200 p-6">
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;