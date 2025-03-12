import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Code, Trash2, ExternalLink, Copy, Edit, Edit3, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import axios from 'axios';

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
        const spaceData = response.data.space
        spaceData.shareLink = `${window.location.origin}/submit/${id}`
        setSpace(response.data.space);
        setEditedSpace(response.data.space);
      } catch (err: any) {
        console.error('Error fetching space:', err);
        setError("Failed to load space details. Please try again.");
      }
    };

    loadSpace();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(space.shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = () => {
    const embedCode = `<div id="testimonial-widget" data-space-id="${space.id}"></div>
<script src="${window.location.origin}/testimonial-widget.js"></script>`;
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{space.spaceName}</h1>
          <p className="text-gray-600 mt-1">{space.customMessage}</p>
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
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            {space?.testimonials?.length === 0 ? (
              <p className="text-gray-500 italic">No testimonials yet.</p>
            ) : (
              <div className="space-y-4">
                {space?.testimonials?.map((testimonial) => (
                  <div key={testimonial.id} className="p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
                    <p className="text-gray-900 font-medium mt-2">— {testimonial.name}</p>
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
            <CardDescription>Copy the embed code below to add testimonials to your site.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
              <code>{`<div id="testimonial-widget" data-space-id="${space.id}"></div>
<script src="${window.location.origin}/testimonial-widget.js"></script>`}</code>
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

      {/* Edit Space Tab */}
      {activeTab === 'edit' && (
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            {isEditing ? (
              <div className="mb-4 w-full">
                <label className="block text-gray-700 text-sm font-bold mb-2">Space Logo</label>
                <input
                  type="file"
                  onChange={(e) => setEditedSpace({ ...editedSpace, spaceLogo: e.target.files?.[0] })}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2"
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
                className="text-2xl font-bold text-center w-full border p-2 rounded bg-gray-100"
              />
            ) : (
              <CardTitle className="text-2xl font-bold">{space.spaceName}</CardTitle>
            )}

            {isEditing ? (
              <textarea
                value={editedSpace.customMessage}
                onChange={(e) => setEditedSpace({ ...editedSpace, customMessage: e.target.value })}
                className="text-gray-600 text-center w-full border p-2 rounded bg-gray-100"
              />
            ) : (
              <CardDescription className="text-gray-500">{space.customMessage}</CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-6">
            <p className="text-gray-700 font-medium">Questions:</p>
            <div className="text-gray-700">
              {space?.Questions?.map((question: string, index: number) => (
                <div key={index} className="mb-4 bg-gray-100 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-700 font-semibold">Question {index + 1}:</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedSpace.Questions[index]}
                      onChange={(e) => {
                        const newQuestions = [...editedSpace.Questions];
                        newQuestions[index] = e.target.value;
                        setEditedSpace({ ...editedSpace, Questions: newQuestions });
                      }}
                      className="w-full border p-2 rounded bg-white"
                    />
                  ) : (
                    <p className="text-gray-700">{question}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-gray-700 font-medium">Collect Star Rating:</p>
              {isEditing ? (
                <select
                  value={editedSpace.CollectStarRating ? "Yes" : "No"}
                  onChange={(e) => setEditedSpace({ ...editedSpace, CollectStarRating: e.target.value === "Yes" })}
                  className="w-full border p-2 rounded bg-gray-100"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              ) : (
                <p className="text-gray-700">{space.CollectStarRating ? "Yes" : "No"}</p>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-2">Created on: {new Date(space.createdAt).toLocaleDateString()}</p>
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
    </div>
  );
};

export default SpaceDetailPage;