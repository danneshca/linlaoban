import React, { useState } from 'react';

interface SettingsData {
  name: string;
  email: string;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    name: '用户',
    email: 'user@example.com',
    notifications: true,
    theme: 'light',
    language: 'zh',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState<SettingsData>(settings);

  const handleSave = () => {
    setSettings(tempSettings);
    setIsEditing(false);
    // 这里可以添加保存到本地存储或服务器的逻辑
    console.log('设置已保存:', tempSettings);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof SettingsData, value: any) => {
    setTempSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 页面头部 */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">个人设置</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">管理您的账户和偏好设置</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 个人信息部分 */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">个人信息</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  编辑
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempSettings.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{settings.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempSettings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{settings.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* 偏好设置部分 */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">偏好设置</h2>
            
            <div className="space-y-6">
              {/* 通知设置 */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">推送通知</h3>
                  <p className="text-sm text-gray-500">接收系统通知和更新提醒</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEditing ? tempSettings.notifications : settings.notifications}
                    onChange={(e) => isEditing && handleInputChange('notifications', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* 主题设置 */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">主题</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'auto'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => isEditing && handleInputChange('theme', theme)}
                      disabled={!isEditing}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        (isEditing ? tempSettings.theme : settings.theme) === theme
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">
                          {theme === 'light' && '☀️'}
                          {theme === 'dark' && '🌙'}
                          {theme === 'auto' && '🔄'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {theme === 'light' && '浅色'}
                          {theme === 'dark' && '深色'}
                          {theme === 'auto' && '自动'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 语言设置 */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">语言</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(['zh', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => isEditing && handleInputChange('language', lang)}
                      disabled={!isEditing}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        (isEditing ? tempSettings.language : settings.language) === lang
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {lang === 'zh' ? '中文' : 'English'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;