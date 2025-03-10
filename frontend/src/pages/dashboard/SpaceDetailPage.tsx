import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Code, Trash2, ExternalLink, Copy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useSpaces, Testimonial } from '../../context/SpaceContext';

const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSpace, deleteTestimonial } = useSpaces();
  const [activeTab, setActiveTab] = useState<'testimonials' | 'embed'>('testimonials');
  const [copied, setCopied] = useState(false);
  
  const space = getSpace(id || '');
  
  if (!space) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Space not found</h2>
          <p className="text-gray-600 mb-6">The space you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
          <p className="text-gray-600 mt-1">{space.description}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={handleCopyLink}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {copied ? 'Copied!' : 'Copy Share Link'}
          </Button>
          <Button 
            className="flex items-center"
            onClick={() => window.open(space.shareLink, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Form
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'testimonials'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('testimonials')}
            >
              Testimonials
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'embed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('embed')}
            >
              Embed
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'testimonials' && (
        <>
          {space.testimonials.length === 0 ? (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-blue-100 p-3 mb-4">
                  <Share2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Share your collection form with customers to start gathering testimonials.
                </p>
                <Button onClick={handleCopyLink}>
                  Copy Share Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {space.testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{formatDate(testimonial.date)}</CardDescription>
                      </div>
                      <button 
                        onClick={() => deleteTestimonial(space.id, testimonial.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{testimonial.feedback}</p>
                    {testimonial.mediaUrl && (
                      <div className="mt-4">
                        <img 
                          src={testimonial.mediaUrl} 
                          alt={`Media from ${testimonial.name}`} 
                          className="rounded-md max-h-40 object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'embed' && (
        <Card>
          <CardHeader>
            <CardTitle>Embed Testimonials on Your Website</CardTitle>
            <CardDescription>
              Copy the code below and paste it into your website where you want the testimonials to appear.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
              <code>{`<div id="testimonial-widget" data-space-id="${space.id}"></div>
<script src="${window.location.origin}/testimonial-widget.js"></script>`}</code>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <div className="border rounded-md p-4">
                <div className="space-y-4">
                  {space.testimonials.length === 0 ? (
                    <p className="text-gray-500 italic">No testimonials to display yet.</p>
                  ) : (
                    space.testimonials.slice(0, 2).map((testimonial) => (
                      <div key={testimonial.id} className="p-4 bg-gray-50 rounded-md">
                        <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
                        <p className="text-gray-900 font-medium mt-2">— {testimonial.name}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCopyEmbed}
              className="flex items-center"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Embed Code'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SpaceDetailPage;