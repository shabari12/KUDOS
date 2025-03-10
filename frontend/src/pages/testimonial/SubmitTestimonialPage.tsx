import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MessageSquare, Upload, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { useSpaces } from '../../context/SpaceContext';

interface TestimonialFormData {
  name: string;
  feedback: string;
  mediaUrl?: string;
}

const SubmitTestimonialPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSpace, addTestimonial } = useSpaces();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TestimonialFormData>();
  
  const space = getSpace(id || '');
  
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

  const onSubmit = (data: TestimonialFormData) => {
    addTestimonial(space.id, {
      name: data.name,
      feedback: data.feedback,
      mediaUrl: data.mediaUrl
    });
    setIsSubmitted(true);
  };

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
          <MessageSquare className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Share your feedback
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We'd love to hear about your experience with {space.name}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input
                  label="Your Name"
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
                <TextArea
                  label="Your Feedback"
                  rows={5}
                  error={errors.feedback?.message}
                  {...register('feedback', { 
                    required: 'Feedback is required',
                    minLength: {
                      value: 10,
                      message: 'Feedback must be at least 10 characters'
                    }
                  })}
                />
              </div>

              <div>
                <Input
                  label="Image URL (optional)"
                  placeholder="https://example.com/your-image.jpg"
                  error={errors.mediaUrl?.message}
                  {...register('mediaUrl', { 
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                />
                <p className="mt-1 text-xs text-gray-500">
                  You can add a link to an image that represents your experience.
                </p>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Submit Testimonial
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