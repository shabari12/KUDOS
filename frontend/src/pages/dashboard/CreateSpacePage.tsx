import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { useSpaces } from '../../context/SpaceContext';
import axios from 'axios';

interface CreateSpaceFormData {
  spaceName: string;
  headerTitle: string;
  customMessage: string;
  question1: string;
  question2: string;
  question3: string;
  CollectStarRating: string;
  SpaceLogo: FileList;
}

const CreateSpacePage: React.FC = () => {

  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateSpaceFormData>();

  const onSubmit = async (data: CreateSpaceFormData) => {
    const formData = new FormData();
    formData.append('spaceName', data.spaceName);
    formData.append('headerTitle', data.headerTitle);
    formData.append('customMessage', data.customMessage);
    formData.append('Questions', JSON.stringify([data.question1, data.question2, data.question3]));
    formData.append('CollectStarRating', data.CollectStarRating);
    formData.append('SpaceLogo', data.SpaceLogo[0]);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/spaces/create-space`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error creating space:', error);
    }
  };

  return (
    <div className='min-h-screen relative bg-gradient-to-b from-[#8EC5FC] to-[#E0C3FC] bg-cover bg-center'>
      <div className=" container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Space</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Space Details</CardTitle>
            <CardDescription>
              Create a new space to collect and organize testimonials from your customers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="create-space-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input
                  label="Space Name"
                  placeholder="e.g., Product Feedback, Client Testimonials"
                  error={errors.spaceName?.message}
                  {...register('spaceName', { 
                    required: 'Space name is required',
                    minLength: {
                      value: 3,
                      message: 'Space name must be at least 3 characters'
                    }
                  })}
                />
              </div>
              <div>
                <Input
                  label="Header Title"
                  placeholder="e.g., Product Feedback, Client Testimonials"
                  error={errors.headerTitle?.message}
                  {...register('headerTitle', { 
                    required: 'Header title is required',
                    minLength: {
                      value: 3,
                      message: 'Header title must be at least 3 characters'
                    }
                  })}
                />
              </div>
              <div>
                <TextArea
                  label="Custom Message"
                  className='h-full hover:shadow-md transition-shadow duration-200 rounded-lg shadow-lg bg-white/30 backdrop-blur-md border border-white/20'
                  placeholder="Enter a custom message"
                  error={errors.customMessage?.message}
                  {...register('customMessage', { 
                    required: 'Custom message is required',
                    minLength: {
                      value: 10,
                      message: 'Custom message must be at least 10 characters'
                    }
                  })}
                />
              </div>
              <div>
                <Input
                 label='Enter the Questions'
                  placeholder="1."
                  error={errors.question1?.message}
                  {...register('question1', { 
                    required: 'Question 1 is required',
                    minLength: {
                      value: 10,
                      message: 'Question 1 must be at least 10 characters'
                    }
                  })}
                />
              </div>
              <div>
                <Input
                  
                  placeholder="2."
                  error={errors.question2?.message}
                  {...register('question2', { 
                    required: 'Question 2 is required',
                    minLength: {
                      value: 10,
                      message: 'Question 2 must be at least 10 characters'
                    }
                  })}
                />
              </div>
              <div>
                <Input
                  
                  placeholder="3."
                  error={errors.question3?.message}
                  {...register('question3', { 
                    required: 'Question 3 is required',
                    minLength: {
                      value: 10,
                      message: 'Question 3 must be at least 10 characters'
                    }
                  })}
                />
              </div>
              <div>
                <label className=" block text-sm font-medium text-gray-700">Collect Star Rating</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="collectStarRatingYes"
                      type="radio"
                      value="yes"
                      {...register('CollectStarRating', { required: 'Collect Star Rating is required' })}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="collectStarRatingYes" className="ml-3 block text-sm font-medium text-gray-700">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="collectStarRatingNo"
                      type="radio"
                      value="no"
                      {...register('CollectStarRating', { required: 'Collect Star Rating is required' })}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor="collectStarRatingNo" className="ml-3 block text-sm font-medium text-gray-700">
                      No
                    </label>
                  </div>
                </div>
                {errors.CollectStarRating && (
                  <p className="mt-2 text-sm text-red-600">{errors.CollectStarRating.message}</p>
                )}
              </div>
              <div>
                <Input
                  label="Space Logo"
                  type="file"
                  error={errors.SpaceLogo?.message}
                  {...register('SpaceLogo')}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              form="create-space-form"
              isLoading={isSubmitting}
            >
              Create Space
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default CreateSpacePage;