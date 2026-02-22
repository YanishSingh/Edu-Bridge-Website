import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

const HeroSearchBar = () => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [courseInput, setCourseInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality with backend API
    console.log('Search:', { selectedLevel, selectedCountry, selectedUniversity, courseInput });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full px-2 sm:px-4 md:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto bg-white rounded-full sm:rounded-full shadow-2xl p-1.5 sm:p-2 border-2 border-white">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-center">
            {/* Level Filter */}
            <div className="flex-1 w-full md:w-auto">
              <select
                id="level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-white rounded-full bg-primary text-white focus:ring-2 focus:ring-white focus:outline-none appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem sm:right-1rem center',
                  paddingRight: '2rem sm:2.5rem'
                }}
              >
                <option value="" style={{ backgroundColor: '#D6212A', color: 'white' }}>Select Level</option>
                <option value="undergraduate" style={{ backgroundColor: '#D6212A', color: 'white' }}>Undergraduate</option>
                <option value="graduate" style={{ backgroundColor: '#D6212A', color: 'white' }}>Graduate</option>
                <option value="phd" style={{ backgroundColor: '#D6212A', color: 'white' }}>PhD</option>
                <option value="diploma" style={{ backgroundColor: '#D6212A', color: 'white' }}>Diploma</option>
              </select>
            </div>

            {/* Country Filter */}
            <div className="flex-1 w-full md:w-auto">
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-white rounded-full bg-primary text-white focus:ring-2 focus:ring-white focus:outline-none appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem sm:right-1rem center',
                  paddingRight: '2rem sm:2.5rem'
                }}
              >
                <option value="" style={{ backgroundColor: '#D6212A', color: 'white' }}>Select Country</option>
                <option value="uk" style={{ backgroundColor: '#D6212A', color: 'white' }}>United Kingdom</option>
                <option value="usa" style={{ backgroundColor: '#D6212A', color: 'white' }}>United States</option>
                <option value="australia" style={{ backgroundColor: '#D6212A', color: 'white' }}>Australia</option>
                <option value="canada" style={{ backgroundColor: '#D6212A', color: 'white' }}>Canada</option>
                <option value="germany" style={{ backgroundColor: '#D6212A', color: 'white' }}>Germany</option>
                <option value="france" style={{ backgroundColor: '#D6212A', color: 'white' }}>France</option>
              </select>
            </div>

            {/* University Filter */}
            <div className="flex-1 w-full md:w-auto">
              <select
                id="university"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-white rounded-full bg-primary text-white focus:ring-2 focus:ring-white focus:outline-none appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem sm:right-1rem center',
                  paddingRight: '2rem sm:2.5rem'
                }}
              >
                <option value="" style={{ backgroundColor: '#D6212A', color: 'white' }}>Select University</option>
                <option value="oxford" style={{ backgroundColor: '#D6212A', color: 'white' }}>Oxford University</option>
                <option value="cambridge" style={{ backgroundColor: '#D6212A', color: 'white' }}>Cambridge University</option>
                <option value="harvard" style={{ backgroundColor: '#D6212A', color: 'white' }}>Harvard University</option>
                <option value="mit" style={{ backgroundColor: '#D6212A', color: 'white' }}>MIT</option>
              </select>
            </div>

            {/* Course Input - white background, red text (per design) */}
            <div className="flex-1 w-full md:w-auto">
              <input
                type="text"
                id="course"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                placeholder="Type Course"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-full bg-white text-primary placeholder-primary/70 focus:ring-2 focus:ring-primary focus:outline-none border border-gray-200"
              />
            </div>

            {/* Search Icon Button */}
            <button
              type="submit"
              className="bg-primary text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-primary-dark transition-colors duration-200 shadow-lg flex items-center justify-center border-2 border-white flex-shrink-0"
              aria-label="Search programs"
            >
              <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default HeroSearchBar;

