import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star, Users, Code, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Typewriter from 'typewriter-effect';
const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[url('./components/bgimg1.png')] bg-cover bg-center min-h-screen flex items-center justify-center text-black">
        <div className="container mx-auto  py-16 md:py-24 lg:py-32 pt-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black">
                Collect and showcase testimonials with ease
              </h1>
<div className="mt-6 text-lg md:text-xl text-black">
  <Typewriter
    onInit={(typewriter) => {
      typewriter
        .typeString('Kudos helps you gather authentic feedback  and display it beautifully on your website.')
        .callFunction(() => {
          console.log('String typed out!');
        })
        .pauseFor(2500)
        
        .start();
    }}
  />
</div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-700">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything you need to collect and showcase testimonials
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to gather authentic feedback and display it beautifully.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            <div className="p-6 border border-gray-200 rounded-lg bg-[#e0c3fc]">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Customizable Forms</h3>
              <p className="text-black">
                Create branded testimonial collection forms that match your company's style and voice.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-[#e0c3fc]">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4  ">
                <Users className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Multiple Spaces</h3>
              <p className="text-black">
                Organize testimonials into different spaces for various products, services, or campaigns.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-[#e0c3fc]">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 ">
                <Code className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Easy Embedding</h3>
              <p className="text-black">
                Showcase testimonials on your website with our simple embed code. No coding skills required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ready to start collecting testimonials?
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses that use TestiCollect to build trust and increase conversions.
          </p>
          <div className="mt-8">
            <Link to="/signup">
              <Button size="lg" className="px-8 bg-[#E0C3FC] text-black">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
