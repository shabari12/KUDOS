import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, ExternalLink, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { UserDataContext } from '../../context/UserContext';
import { useSpaces, Space } from '../../context/SpaceContext';

const DashboardPage: React.FC = () => {
  const { user } = useContext(UserDataContext);
  const { spaces, deleteSpace } = useSpaces();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newSpaceName, setNewSpaceName] = React.useState('');
  const [newSpaceDescription, setNewSpaceDescription] = React.useState('');
  console.log('DashboardPage user:', user);
  const handleDeleteSpace = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
      deleteSpace(id);
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.username}</h1>
          <p className="text-gray-600 mt-1">Manage your testimonial spaces</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/dashboard/create-space">
            <Button className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create New Space
            </Button>
          </Link>
        </div>
      </div>

      {spaces.length === 0 ? (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces yet</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Create your first testimonial space to start collecting feedback from your customers.
            </p>
            <Link to="/dashboard/create-space">
              <Button>Create Your First Space</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Link key={space.id} to={`/dashboard/space/${space.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{space.name}</CardTitle>
                    <button 
                      onClick={(e) => handleDeleteSpace(space.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <CardDescription>{space.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Created: {formatDate(space.createdAt)}</span>
                    <span>{space.testimonials.length} testimonials</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    <span className="truncate">Share link available</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="ghost" className="w-full justify-center">
                    Manage Space
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;