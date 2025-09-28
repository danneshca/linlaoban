import React from 'react';
import { ConsultantCategory as CategoryType, Consultant } from '../types/consultant';
import ConsultantCard from './ConsultantCard';

interface ConsultantCategoryProps {
  category: CategoryType;
  onConsultantClick: (consultant: Consultant) => void;
}

const ConsultantCategory: React.FC<ConsultantCategoryProps> = ({ 
  category, 
  onConsultantClick 
}) => {
  return (
    <div className="mb-16">
      {/* 分类标题 */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
          <span className="text-2xl text-white">{category.icon}</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.title}</h2>
        <p className="text-gray-600 text-lg">{category.consultants.length} 位专业顾问为您服务</p>
      </div>

      {/* 顾问卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {category.consultants.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            onClick={onConsultantClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ConsultantCategory;