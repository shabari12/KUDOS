import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { UserDataContext } from '../../context/UserContext';
import axios from 'axios';

const DashboardPage: React.FC = () => {
  const { user } = useContext(UserDataContext);
  const [spaces, setSpaces] = useState<any[]>([]);

  useEffect(() => {
    const loadSpaces = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/spaces/get-all-spaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data && Array.isArray(response.data.spaces)) {
          setSpaces(response.data.spaces);
        } else {
          setSpaces([]);
        }
      } catch (error) {
        console.error('Error fetching spaces:', error);
        setSpaces([]);
      }
    };

    if (user) {
      loadSpaces();
    }
  }, [user]);

  const handleDeleteSpace = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${import.meta.env.VITE_BASE_URL}/spaces/delete-space`, 
          { spaceId: id }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSpaces(spaces.filter((space) => space._id !== id));
        console.log("space deleted successfully")
      } catch (error) {
        console.error('Error deleting space:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
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
              <Plus className="h-5 w-5 mr-2" /> Create New Space
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
            <Link key={space._id} to={`/dashboard/space/${space._id}`}>
              <Card className="h-full hover:shadow-md transition-shadow duration-200">
              <CardHeader>
  <div className="flex justify-between items-start">
    <div className="flex items-center">
      {space.spaceLogo && (
        <img 
          src={space.spaceLogo} 
          alt="Space Logo" 
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
      )}
      <CardTitle className="text-xl">{space.spaceName}</CardTitle>
    </div>
    <button onClick={(e) => handleDeleteSpace(space._id, e)} className="text-gray-400 hover:text-red-500 transition-colors">
      <Trash2 className="h-5 w-5" />
    </button>
  </div>
  <CardDescription>{space.customMessage}</CardDescription>
</CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Created: {formatDate(space.createdAt)}</span>
                    <span>{space.Questions?.length || 0} questions</span>
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
