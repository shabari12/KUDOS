import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Users, Code, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import Typewriter from "typewriter-effect";
import bgimage from "../components/bgg.png";
import Navbar from "../components/layout/Navbar";
import { motion } from "framer-motion"; // Import motion

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative  bg-cover bg-center" style={{ backgroundColor: '#2b4162', backgroundImage: 'linear-gradient(315deg, #2b4162 0%, #12100e 74%)' }}>
      <Navbar />
      <div className="flex flex-col min-h-screen items-center justify-center">
        {/* Hero Section */}
        <section className="text-white">
          <motion.div
            className="container mx-auto py-16 md:py-24 lg:py-32 pt-32"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                  Collect and showcase testimonials with ease
                </h1>
                <div className="mt-6 text-lg md:text-xl text-white">
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(
                          "Kudos helps you gather authentic feedback and display it beautifully on your website."
                        )
                        .pauseFor(2500)
                        .start();
                    }}
                  />
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-black">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-700"
                    >
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
              <motion.div
                className="hidden md:block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img src={bgimage} alt="Background" className="w-full h-auto" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Everything you need to collect and showcase testimonials
              </h2>
              <p className="mt-4 text-xl text-white max-w-3xl mx-auto">
                Our platform makes it easy to gather authentic feedback and
                display it beautifully.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <MessageSquare className="h-6 w-6 text-black" />,
                  title: "Customizable Forms",
                  description:
                    "Create branded testimonial collection forms that match your company's style and voice.",
                },
                {
                  icon: <Users className="h-6 w-6 text-black" />,
                  title: "Multiple Spaces",
                  description:
                    "Organize testimonials into different spaces for various products, services, or campaigns.",
                },
                {
                  icon: <Code className="h-6 w-6 text-black" />,
                  title: "Easy Embedding",
                  description:
                    "Showcase testimonials on your website with our simple embed code. No coding skills required.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 border border-gray-200 rounded-lg bg-black"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <motion.div
            className="container mx-auto px-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to start collecting testimonials?
            </h2>
            <p className="mt-4 text-xl text-white max-w-2xl mx-auto">
              Join thousands of businesses that use TestiCollect to build trust
              and increase conversions.
            </p>
            <div className="mt-8">
              <Link to="/signup">
                <Button size="lg" className="px-8 bg-white text-black">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;