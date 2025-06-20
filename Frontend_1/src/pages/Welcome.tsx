import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos'; // Import AOS for animations
import 'aos/dist/aos.css'; // Import the AOS CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome
import { faArrowRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import { motion } from 'framer-motion';

const WelcomePage: React.FC = () => {
  // Background images array
  const bgImages = [
    '/images/welcome1.jpg', // Replace with your first image path
    //'/images/welcome2.jpg', // Replace with your second image path
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const ruhuna = '/images/ruhuna.gif';

  useEffect(() => {
    AOS.init(); // Initialize AOS when the component mounts
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Cycle through background images
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [bgImages.length]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImages[currentBgIndex]})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative text-center text-white px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0.1, scale: 1.2 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={ruhuna}
            alt="University of Ruhuna"
            className="h-[80%] w-auto object-contain"
          />
        </motion.div>

        <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Animated Logo (smaller version) */}
                    <motion.div
                      initial={{ scale: 0.8, rotate: -5 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                      className="mb-6 flex justify-center"
                    >
                      <img
                        src={ruhuna}
                        alt="University of Ruhuna"
                        className="h-16 w-auto object-contain"
                      />
                    </motion.div>
        
        
        {/* Heading and Paragraph with animations */}
        <h1
          className="text-4xl font-extrabold mb-4"
          data-aos="fade-up"
          data-aos-duration="1500"
        >
          Welcome to EMS
        </h1>
        <p
          className="text-lg mb-8"
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-delay="200"
        >
          Streamline your exam management process with ease. Designed for the
          Department of Computer Science, University of Ruhuna.
        </p>

        </motion.div>

        {/* Buttons with animations */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
            data-aos="zoom-in"
            data-aos-duration="1500"
            data-aos-delay="400"
          >
            Get Started <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Link>
          <Link
            to="/learn-more"
            className="inline-flex items-center py-2 px-6 border border-white hover:bg-white hover:text-black rounded-md shadow-lg transition focus:outline-none focus:ring focus:ring-white"
            data-aos="zoom-in"
            data-aos-duration="1500"
            data-aos-delay="400"
          >
            Learn More <FontAwesomeIcon icon={faInfoCircle} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
