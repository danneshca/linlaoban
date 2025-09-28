import React from 'react';
import { Consultant } from '../types/consultant';

interface ConsultantCardProps {
  consultant: Consultant;
  onClick: (consultant: Consultant) => void;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({ consultant, onClick }) => {
  const handleClick = () => {
    onClick(consultant);
  };

  const getBrandColor = (brand?: string) => {
    switch (brand) {
      case '颜泡泡':
        return 'from-slate-700 to-slate-800';
      case '宠小妹':
        return 'from-gray-700 to-gray-800';
      case '玥星球':
        return 'from-slate-600 to-slate-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      strategy: '🎯',
      hr: '👥',
      stock: '📈',
      finance: '💰',
      marketing: '📢',
      development: '💻',
      advertising: '🎨',
      sales: '🤝',
      service: '🎧'
    };
    return icons[type as keyof typeof icons] || '💼';
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${getBrandColor(consultant.brand)} min-h-[300px] group border border-gray-200/20 shadow-md hover:shadow-2xl hover:-translate-y-1`}
      onClick={() => onClick(consultant)}
    >

      {/* 顾问信息 */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">{getTypeIcon(consultant.type)}</div>
          {consultant.brand && (
            <span className="text-xs bg-white/25 px-3 py-1 rounded-full text-white font-medium backdrop-blur-sm">
              {consultant.brand}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-3 leading-tight">{consultant.name}</h3>
        <p className="text-white/90 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
          {consultant.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {consultant.expertise.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="text-xs bg-white/20 px-3 py-1 rounded-full text-white font-medium"
              title={skill}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* 开始咨询按钮 */}
        <div className="mt-auto">
          <div className="inline-flex items-center px-5 py-3 bg-white/25 backdrop-blur-sm rounded-lg text-white font-medium group-hover:bg-white/35 transition-all duration-300 border border-white/30">
            <span>开始咨询</span>
            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;