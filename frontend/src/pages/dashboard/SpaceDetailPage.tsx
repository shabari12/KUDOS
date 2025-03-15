import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Star, ExternalLink, Copy, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import axios from 'axios';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [space, setSpace] = useState<any>({
    testimonials: [],
    Questions: [],
  });
  const [activeTab, setActiveTab] = useState<'testimonials' | 'embed' | 'edit'>('testimonials');
  const [copied, setCopied] = useState(false);
  const [editedSpace, setEditedSpace] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpace = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/spaces/get-space?spaceId=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const spaceData = response.data.space;
        spaceData.shareLink = `${window.location.origin}/submit/${id}`;
        setSpace(spaceData);
        setEditedSpace(spaceData);

        // Fetch testimonials
        const testimonialResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/feedback/get-feedback`, { spaceId: id }
        );
        if (testimonialResponse.status === 200 || testimonialResponse.status === 201) {
          setSpace((prevSpace: any) => ({
            ...prevSpace,
            testimonials: testimonialResponse.data.feedbacks,
          }));
        }
      } catch (err: any) {
        console.error('Error fetching space or testimonials:', err);
        setError("Failed to load space details. Please try again.");
      }
    };

    loadSpace();
  }, [id]);

  // Initialize Swiper carousel for testimonials
  useEffect(() => {
    if (activeTab === 'embed' && space.testimonials.length > 0) {
      new Swiper('.testimonial-carousel', {
        slidesPerView: 3, // Show 3 cards per slide
        spaceBetween: 16, // Space between cards
        loop: true,
        autoplay: {
          delay: 3000, // 3 seconds
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }
  }, [activeTab, space.testimonials]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(space.shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = () => {
    const embedCode = `
      <!-- Swiper CSS -->
      <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
    
      <!-- Testimonial Widget Container -->
      <div class="testimonial-carousel swiper-container overflow-hidden">
        <div class="swiper-wrapper"></div>
        <!-- Pagination Dots -->
        <div class="swiper-pagination"></div>
      </div>
    
      <!-- Swiper JS -->
      <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
    
      <!-- Testimonial Widget Script -->
      <script src="${window.location.origin}/testimonial-widget.js" data-space-id="${id}"></script>
    `;
    
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('spaceId', id);
      formData.append('spaceName', editedSpace.spaceName);
      formData.append('headerTitle', editedSpace.headerTitle);
      formData.append('customMessage', editedSpace.customMessage);
      formData.append('Questions', JSON.stringify(editedSpace.Questions));
      formData.append('CollectStarRating', editedSpace.CollectStarRating);

      if (editedSpace.spaceLogo instanceof File) {
        formData.append('SpaceLogo', editedSpace.spaceLogo);
      }

      await axios.post(`${import.meta.env.VITE_BASE_URL}/spaces/update-space`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setSpace(editedSpace);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving space:', err);
      setError("Failed to save space details. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative  bg-cover bg-center" style={{ backgroundColor: '#2b4162', backgroundImage: 'linear-gradient(315deg, #2b4162 0%, #12100e 74%)' }}><div className="container mx-auto px-4 py-8 ">
    <button
      onClick={() => navigate('/dashboard')}
      className="flex items-center text-white hover:text-gray-900 mb-6"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Dashboard
    </button>

    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{space.spaceName}</h1>
        <p className="text-white mt-1">{space.customMessage}</p>
      </div>
      <div className="mt-4 md:mt-0 flex space-x-3">
        <Button variant="outline" className="flex items-center" onClick={handleCopyLink}>
          <Share2 className="h-4 w-4 mr-2" />
          {copied ? 'Copied!' : 'Copy Share Link'}
        </Button>
        <Button className="flex items-center" onClick={() => window.open(space.shareLink, '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View Form
        </Button>
      </div>
    </div>

    {/* Tabs */}
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['testimonials', 'embed', 'edit'].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-white hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab as 'testimonials' | 'embed' | 'edit')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
    </div>

    {/* Testimonials Tab */}
    {activeTab === 'testimonials' && (
      <Card className=''>
        <CardHeader>
          <CardTitle className='text-white'>Testimonials</CardTitle>
        </CardHeader>
        <CardContent>
          {space?.testimonials?.length === 0 ? (
            <p className="text-white italic">No testimonials yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {space?.testimonials?.map((testimonial: any) => (
                <div key={testimonial._id} className="p-6 h-full hover:shadow-md transition-shadow duration-200 rounded-lg shadow-lg bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-sm border border-gray-100">
                  {/* User Info and Image */}
                  <div className="flex items-center space-x-4">
                    {testimonial.feedbackuserLogo && (
                      <img
                        src={testimonial.feedbackuserLogo}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-white">{testimonial.email}</p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  {testimonial.rating && (
                    <div className="flex items-center mt-4">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-5 w-5 ${
                            index < testimonial.rating ? 'text-yellow-400' : 'text-white'
                          }`}
                          fill={index < testimonial.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  )}

                  {/* Feedback */}
                  <p className="mt-4 text-white italic">"{testimonial.feedback}"</p>

                  {/* Submitted Time */}
                  <p className="mt-4 text-sm text-white">
                    Submitted on: {new Date(testimonial.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )}

    {/* Embed Tab */}
    {activeTab === 'embed' && (
<Card>
  <CardHeader>
    <CardTitle>Embed Testimonials</CardTitle>
    <CardDescription>
      Copy the embed code below to add testimonials to your site.
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Embed Code Section */}
    <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto mb-6">
      <code>{`
        <!-- Swiper CSS -->
        <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />

        <!-- Testimonial Widget Container -->
        <div class="testimonial-carousel swiper-container overflow-hidden">
          <div class="swiper-wrapper"></div>
          <!-- Pagination Dots -->
          <div class="swiper-pagination"></div>
        </div>

        <!-- Swiper JS -->
        <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

        <!-- Testimonial Widget Script -->
        <script src="${window.location.origin}/testimonial-widget.js" data-space-id="${id}"></script>
      `}</code>
    </div>

    {/* Preview Section */}
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Preview</h3>
      <div className="p-6 bg-gray-100 rounded-lg">
        {space.testimonials.length === 0 ? (
          <p className="text-black italic">No testimonials to display.</p>
        ) : (
          <div className="testimonial-carousel swiper-container overflow-hidden">
            <div className="swiper-wrapper text-black ">
              {space.testimonials.map((testimonial: any) => (
                <div key={testimonial._id} className="swiper-slide">
                  <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                    {/* User Info and Image */}
                    <div className="flex items-center space-x-4">
                      {testimonial.feedbackuserLogo && (
                        <img
                          src={testimonial.feedbackuserLogo}
                          alt="User"
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      )}
                      <div>
                        <p className="text-lg font-semibold text-black ">{testimonial.name}</p>
                        <p className="text-sm text-white">{testimonial.email}</p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    {testimonial.rating && (
                      <div className="flex items-center mt-4">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-5 w-5 ${
                              index < testimonial.rating ? 'text-yellow-400' : 'text-white'
                            }`}
                            fill={index < testimonial.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    )}

                    {/* Feedback */}
                    <p className="mt-4 text-black  italic">"{testimonial.feedback}"</p>

                    {/* Submitted Time */}
                    <p className="mt-4 text-sm text-black ">
                      Submitted on: {new Date(testimonial.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Dots */}
            <div className="swiper-pagination"></div>
          </div>
        )}
      </div>
    </div>
  </CardContent>
  <CardFooter>
    <Button onClick={handleCopyEmbed} className="flex items-center">
      <Copy className="h-4 w-4 mr-2" />
      {copied ? 'Copied!' : 'Copy Embed Code'}
    </Button>
  </CardFooter>
</Card>
)}

    {/* Edit Tab */}
    {activeTab === 'edit' && (
  <Card className='h-full hover:shadow-md transition-shadow duration-200 rounded-lg shadow-lg bg-white/30 backdrop-blur-md border border-white/20'>
    <CardHeader className="flex flex-col items-center text-center">
      {isEditing ? (
        <div className="mb-4 w-full">
          <label className="block text-black text-sm font-bold mb-2">Space Logo</label>
          <input
            type="file"
            onChange={(e) => setEditedSpace({ ...editedSpace, spaceLogo: e.target.files?.[0] })}
            className="block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer p-2"
          />
        </div>
      ) : (
        space.spaceLogo && (
          <img
            src={space.spaceLogo}
            alt="Space Logo"
            className="w-24 h-24 object-cover rounded-full mb-4 border-2 border-gray-300"
          />
        )
      )}

      {isEditing ? (
        <input
          type="text"
          value={editedSpace.spaceName}
          onChange={(e) => setEditedSpace({ ...editedSpace, spaceName: e.target.value })}
          className="text-2xl font-bold text-center w-full border p-2 rounded text-black bg-transparent"
        />
      ) : (
        <CardTitle className="text-2xl font-bold">{space.spaceName}</CardTitle>
      )}

      {isEditing ? (
        <textarea
          value={editedSpace.customMessage}
          onChange={(e) => setEditedSpace({ ...editedSpace, customMessage: e.target.value })}
          className="text-black text-center w-full border p-2 rounded bg-transparent"
        />
      ) : (
        <CardDescription className="text-white">{space.customMessage}</CardDescription>
      )}
    </CardHeader>

    <CardContent className="p-6">
      <p className="text-black font-medium">Questions:</p>
      <div className="text-black">
        {space?.Questions?.map((question: string, index: number) => (
          <div key={index} className="mb-4 h-full hover:shadow-md transition-shadow duration-200 rounded-lg shadow-lg bg-white/30 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-sm">
            <p className="text-black font-semibold">Question {index + 1}:</p>
            {isEditing ? (
              <input
                type="text"
                value={editedSpace.Questions[index]}
                onChange={(e) => {
                  const newQuestions = [...editedSpace.Questions];
                  newQuestions[index] = e.target.value;
                  setEditedSpace({ ...editedSpace, Questions: newQuestions });
                }}
                className="w-full p-2 border-none text-black bg-transparent"
              />
            ) : (
              <p className="text-black">{question}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-black font-medium">Collect Star Rating:</p>
        {isEditing ? (
          <select
            value={editedSpace.CollectStarRating ? "Yes" : "No"}
            onChange={(e) => setEditedSpace({ ...editedSpace, CollectStarRating: e.target.value === "Yes" })}
            className="w-full border p-2 rounded text-black bg-transparent"
          >
            <option value="Yes" className='text-black'>Yes</option>
            <option value="No" className='text-black'>No</option>
          </select>
        ) : (
          <p className='text-white'>{space.CollectStarRating ? "Yes" : "No"}</p>
        )}
      </div>

      <p className="text-sm text-white mt-2">Created on: {new Date(space.createdAt).toLocaleDateString()}</p>
    </CardContent>

    <CardFooter className="flex justify-end space-x-2">
      <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
      {isEditing && (
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      )}
    </CardFooter>
  </Card>
)}
  </div></div>
    
  );
};

export default SpaceDetailPage;
