import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { consultantCategories } from '../data/consultants';
import { Consultant } from '../types/consultant';
import ConsultantCategory from '../components/ConsultantCategory';

const Home: React.FC = () => {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const navigate = useNavigate();

  const handleConsultantClick = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    
    // 公司战略顾问和人事顾问已启用AI对话功能
    if (consultant.id === 'strategy-001') {
      navigate('/strategic-consultant');
    } else if (consultant.id === 'hr-001') {
      navigate('/hr-consultant');
    } else {
      // 其他顾问显示功能开发中提示
      alert(`${consultant.name} 功能正在开发中，敬请期待！\n\n目前"公司战略顾问"和"人事顾问"提供AI智能对话服务。`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* 页面头部 */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">林老板顾问团</h1>

            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* 顾问服务分类展示 */}
        <div className="space-y-16">
          {consultantCategories.map((category) => (
            <ConsultantCategory
              key={category.type}
              category={category}
              onConsultantClick={handleConsultantClick}
            />
          ))}
        </div>
      </main>


    </div>
  );
};

export default Home;