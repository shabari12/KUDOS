import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MessageSquare, Upload, Check, Star } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import axios from 'axios';

interface TestimonialFormData {
  name: string;
  email: string;
  feedback: string;
  mediaUrl?: string;
  rating?: number;
  photo?: FileList;
  permission: boolean;
}

const SubmitTestimonialPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<any>({
    testimonials: [],
    Questions: [],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TestimonialFormData>();

  useEffect(() => {
    const loadSpace = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/spaces/get-space?spaceId=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSpace(response.data.space);
      } catch (err: any) {
        console.error('Error fetching space:', err);
      }
    };

    loadSpace();
  }, [id]);

  const onSubmit = async (data: TestimonialFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("permission", data.permission.toString());
    formData.append("feedback", data.feedback);

    if (space.CollectStarRating) {
      formData.append("rating", rating.toString());
    }

    if (data.photo && data.photo[0]) {
      formData.append("feedbackuserLogo", data.photo[0]);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/feedback/submit-feedback/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Testimonial Data:", data);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
    }
  };

  if (!space) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Form not found
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              The testimonial form you're looking for doesn't exist or has been deleted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Thank you!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your testimonial has been submitted successfully.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
              >
                Submit another testimonial
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {space.spaceLogo && (
            <img
              src={space.spaceLogo}
              alt="Space Logo"
              className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-2 border-gray-300"
            />
          )}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Drop your testimonial for {space.spaceName}
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Questions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                <ul className="mt-2 space-y-4">
                  {space.Questions.map((question: string, index: number) => (
                    <li key={index}>
                      <label className="block text-sm font-medium text-gray-700">
                        {question}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feedback TextArea */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Feedback
                </label>
                <TextArea
                  rows={6}
                  {...register('feedback', {
                    required: 'Feedback is required',
                  })}
                />
                {errors.feedback && (
                  <p className="text-sm text-red-600">
                    {errors.feedback.message}
                  </p>
                )}
              </div>

              {/* Star Rating */}
              {space.CollectStarRating && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rate your experience
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`h-6 w-6 ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-6 w-6" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name */}
              <div>
              <p className='text-black block text-sm font-medium mb-1'>Name</p>
                <Input
                 
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
              </div>

              {/* Email */}
              <div className='text-black'>
                <p className='text-black block text-sm font-medium mb-1'>Your Email</p>
                <Input
                className='text-black'
                 
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Your Photo
                </label>
                <input
                  type="file"
                  {...register('photo')}
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2"
                />
              </div>

              {/* Permission Checkbox */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('permission')}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I give permission to use this testimonial across social channels and other marketing efforts
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Send
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitTestimonialPage;