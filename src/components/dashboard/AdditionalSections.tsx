
import React from 'react';
import NewsSection from './NewsSection';
import CustomSection from './CustomSection';

const AdditionalSections: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <NewsSection />
      <CustomSection />
    </div>
  );
};

export default AdditionalSections;
