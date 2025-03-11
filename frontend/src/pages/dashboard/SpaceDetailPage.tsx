import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, ExternalLink, Copy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import axios from 'axios';

const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpace = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/spaces/get-space?spaceId=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data.space);
        setSpace(response.data.space);
      } catch (err: any) {
        console.error('Error fetching space:', err);
        setError("Failed to load space details. Please try again.");
      }
    };

    loadSpace();
  }, [id]);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(space.shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="flex flex-col items-center text-center">
          {space.spaceLogo && (
            <img
              src={space.spaceLogo}
              alt="Space Logo"
              className="w-24 h-24 object-cover rounded-full mb-4 border-2 border-gray-300"
            />
          )}
          <CardTitle className="text-2xl font-bold">{space.spaceName}</CardTitle>
          <CardTitle className="text-lg text-gray-600">{space.headerTitle}</CardTitle>
          <CardDescription className="text-gray-500">{space.customMessage}</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <p className="text-gray-700 font-medium">Questions: {space.Questions}</p>
          <p className="text-gray-700 font-medium">Collect Star Rating: {space.CollectStarRating ? "Yes" : "No"}</p>
          <p className="text-sm text-gray-500 mt-2">Created on: {new Date(space.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </Card>

      <div className="mt-6 flex space-x-3 justify-center">
        <Button variant="outline" className="flex items-center" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          {copied ? 'Copied!' : 'Copy Share Link'}
        </Button>
        <Button className="flex items-center" onClick={() => window.open(space.shareLink, '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View Space
        </Button>
      </div>
    </div>
  );
};

export default SpaceDetailPage;
