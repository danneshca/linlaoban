import React, { useState, useEffect } from 'react';
import { Consultant } from '../types/consultant';
import { consultants } from '../data/consultants';

interface ChatSession {
  id: string;
  consultantId: string;
  consultantName: string;
  consultantType: string;
  brand?: string;
  startTime: Date;
  lastMessage: string;
  messageCount: number;
  status: 'active' | 'completed' | 'paused';
}

const ChatHistory: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  // 模拟聊天历史数据
  useEffect(() => {
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        consultantId: 'strategy-1',
        consultantName: '公司战略顾问',
        consultantType: '公司战略顾问',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
        lastMessage: '感谢您的咨询，我已经为您制定了详细的战略规划方案...',
        messageCount: 15,
        status: 'completed',
      },
      {
        id: '2',
        consultantId: 'finance-ybb-1',
        consultantName: '财务顾问 - 颜泡泡',
        consultantType: '财务顾问',
        brand: '颜泡泡',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
        lastMessage: '根据您的财务状况，我建议您可以考虑以下投资组合...',
        messageCount: 8,
        status: 'active',
      },
      {
        id: '3',
        consultantId: 'hr-1',
        consultantName: '人事顾问',
        consultantType: '人事顾问',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
        lastMessage: '关于员工绩效考核体系的建立，我们需要从以下几个方面入手...',
        messageCount: 22,
        status: 'completed',
      },
      {
        id: '4',
        consultantId: 'marketing-cxm-1',
        consultantName: '营销顾问 - 宠小妹',
        consultantType: '营销顾问',
        brand: '宠小妹',
        startTime: new Date(Date.now() - 10 * 60 * 1000), // 10分钟前
        lastMessage: '您好，我正在为您分析目标市场的用户画像...',
        messageCount: 3,
        status: 'active',
      },
    ];
    setChatSessions(mockSessions);
  }, []);

  const filteredSessions = chatSessions.filter(session => {
    const matchesSearch = session.consultantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: ChatSession['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ChatSession['status']) => {
    switch (status) {
      case 'active': return '进行中';
      case 'completed': return '已完成';
      case 'paused': return '已暂停';
      default: return '未知';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else {
      return `${days}天前`;
    }
  };

  const handleContinueChat = (session: ChatSession) => {
    // 这里可以集成 Coze SDK 继续对话
    console.log('继续与顾问对话:', session.consultantName);
  };

  const handleDeleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 页面头部 */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">对话历史</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">查看和管理您的咨询记录</p>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 搜索和筛选 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="搜索对话记录..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 状态筛选 */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全部状态</option>
                <option value="active">进行中</option>
                <option value="completed">已完成</option>
                <option value="paused">已暂停</option>
              </select>
            </div>
          </div>
        </div>

        {/* 对话列表 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无对话记录</h3>
              <p className="mt-1 text-sm text-gray-500">开始与顾问对话后，记录将显示在这里</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {session.consultantName}
                        </h3>
                        {session.brand && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {session.brand}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {getStatusText(session.status)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {session.lastMessage}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatTime(session.startTime)}</span>
                        <span>{session.messageCount} 条消息</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {session.status === 'active' && (
                        <button
                          onClick={() => handleContinueChat(session)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          继续对话
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        查看详情
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 详情模态框 */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    对话详情
                  </h3>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">顾问</label>
                    <p className="text-gray-900">{selectedSession.consultantName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                    <p className="text-gray-900">{selectedSession.startTime.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">消息数量</label>
                    <p className="text-gray-900">{selectedSession.messageCount} 条</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status)}`}>
                      {getStatusText(selectedSession.status)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最后消息</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedSession.lastMessage}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  关闭
                </button>
                {selectedSession.status === 'active' && (
                  <button
                    onClick={() => {
                      handleContinueChat(selectedSession);
                      setSelectedSession(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    继续对话
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatHistory;