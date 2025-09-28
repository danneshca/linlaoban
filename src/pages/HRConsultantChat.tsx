import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';
import type { CozeConfig, CozeWebChatClient } from '../types/coze';
import '../types/coze'; // 导入全局类型声明

// 为Coze SDK添加必要的CSS样式
const cozeSDKStyles = `
  .coze-chat-container {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    background: white !important;
  }
  
  .coze-chat-container > div {
    width: 100% !important;
    height: 100% !important;
  }
  
  /* 确保Coze SDK的iframe或容器能够正确显示 */
  .coze-chat-container iframe,
  .coze-chat-container [class*="coze"],
  .coze-chat-container [id*="coze"] {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
    position: relative !important;
  }
  
  /* 隐藏可能的滚动条 */
  .coze-chat-container::-webkit-scrollbar {
    display: none;
  }
  
  .coze-chat-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;



const HRConsultantChat: React.FC = () => {
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatClient, setChatClient] = useState<CozeWebChatClient | null>(null);

  // 组件挂载时的调试日志和状态设置
  useEffect(() => {
    isMountedRef.current = true;
    
    // 注入CSS样式
    const styleElement = document.createElement('style');
    styleElement.textContent = cozeSDKStyles;
    styleElement.id = 'coze-sdk-styles-hr';
    document.head.appendChild(styleElement);
    
    console.log('=== HRConsultantChat 组件挂载 ===', {
      timestamp: new Date().toISOString(),
      isMounted: isMountedRef.current,
      hasContainer: !!chatContainerRef.current
    });
    
    return () => {
      console.log('=== HRConsultantChat 组件卸载开始 ===', {
        timestamp: new Date().toISOString(),
        hadChatClient: !!chatClient
      });
      isMountedRef.current = false;
      
      // 移除注入的CSS样式
      const existingStyle = document.getElementById('coze-sdk-styles-hr');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    // 添加全局错误处理器，忽略监控相关错误
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('mon.zijieapi.com')) {
        console.log('忽略监控数据收集错误:', event.message);
        event.preventDefault();
        return false;
      }
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && typeof event.reason === 'string' && event.reason.includes('mon.zijieapi.com')) {
        console.log('忽略监控数据收集Promise错误:', event.reason);
        event.preventDefault();
        return false;
      }
    };
    
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // 延迟初始化，确保DOM完全渲染
    const timer = setTimeout(() => {
      if (isMountedRef.current && chatContainerRef.current) {
        console.log('开始初始化人事顾问Coze聊天客户端...');
        initializeCozeChat();
      } else {
        console.log('组件未完全挂载，跳过初始化');
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // 单独的清理effect，确保组件卸载时正确清理
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      if (chatClient) {
        try {
          console.log('正在清理人事顾问Coze聊天客户端...');
          
          if (typeof chatClient.hideChatBot === 'function') {
            chatClient.hideChatBot();
          }
          
          if (typeof chatClient.unmount === 'function') {
            chatClient.unmount();
          }
          
          console.log('人事顾问Coze聊天客户端清理完成');
        } catch (error) {
          console.warn('清理聊天客户端时出错:', error);
        }
      }
    };
  }, [chatClient]);

  const initializeCozeChat = async () => {
    try {
      if (!isMountedRef.current) {
        console.log('组件已卸载，取消初始化');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      console.log('=== 人事顾问 Coze 聊天客户端初始化开始 ===');
      
      // 检查环境变量
      const token = import.meta.env.VITE_COZE_SAT_TOKEN;
      const botId = '7555030161654366235'; // 使用用户提供的人事顾问bot_id
      
      console.log('环境变量检查:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        botId: botId,
        nodeEnv: import.meta.env.MODE
      });
      
      if (!token) {
        throw new Error('VITE_COZE_SAT_TOKEN 环境变量未配置，请在 .env.local 文件中添加有效的 Coze SAT Token');
      }
      
      if (token.length < 10) {
        throw new Error('VITE_COZE_SAT_TOKEN 格式不正确，请检查 Token 是否完整');
      }
      
      console.log('开始等待 Coze SDK 加载...');
      
      await waitForCozeSDK();
      
      if (!isMountedRef.current) {
        console.log('组件在SDK加载过程中被卸载');
        return;
      }
      
      console.log('Coze SDK 加载完成，检查 DOM 容器...');
      
      if (!chatContainerRef.current) {
        throw new Error('聊天容器DOM元素未找到，请检查组件渲染状态');
      }
      
      if (!(chatContainerRef.current instanceof HTMLElement)) {
        throw new Error('el参数必须是有效的HTMLElement对象');
      }
      
      if (!document.contains(chatContainerRef.current)) {
        throw new Error('聊天容器未挂载到文档中，请等待组件完全渲染');
      }
      
      const containerRect = chatContainerRef.current.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.warn('聊天容器尺寸为0，可能影响SDK渲染，尝试等待容器完全渲染');
        await new Promise(resolve => setTimeout(resolve, 100));
        const newRect = chatContainerRef.current.getBoundingClientRect();
        if (newRect.width === 0 || newRect.height === 0) {
          console.warn('容器尺寸仍为0，但继续初始化SDK');
        }
      }
      
      const computedStyle = window.getComputedStyle(chatContainerRef.current);
      if (computedStyle.position === 'static') {
        console.log('设置容器为相对定位以支持SDK渲染');
        chatContainerRef.current.style.position = 'relative';
      }
      
      console.log('DOM 容器检查通过，容器信息:', {
        element: chatContainerRef.current.tagName,
        className: chatContainerRef.current.className,
        id: chatContainerRef.current.id,
        clientWidth: chatContainerRef.current.clientWidth,
        clientHeight: chatContainerRef.current.clientHeight,
        offsetWidth: chatContainerRef.current.offsetWidth,
        offsetHeight: chatContainerRef.current.offsetHeight,
        isConnected: chatContainerRef.current.isConnected,
        parentNode: !!chatContainerRef.current.parentNode,
        boundingRect: containerRect
      });

      // 配置人事顾问 Coze 客户端
      const config: CozeConfig = {
        config: {
          botId: botId, // 使用人事顾问的 bot_id
          isIframe: false,
          disableAnalytics: true,
          disableTelemetry: true,
        },
        auth: {
          type: 'token',
          token: token,
          onRefreshToken: async () => token,
        },
        userInfo: {
          id: '123',
          url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
          nickname: '人事咨询用户',
        },
        ui: {
          base: {
            icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
            layout: 'pc',
            zIndex: 100,
          },
          asstBtn: {
            isNeed: false,
          },
          header: {
            isShow: true,
            isNeedClose: false
          },
          chatBot: {
            el: chatContainerRef.current
          }
        },
        componentProps: {
          title: 'HR智能助手',
          uploadable: false,
          width: 1000,
          height: 600,
          isNeedAudio: true,
          isNeedFunctionCallMessage: true,
          isNeedAddNewConversation: true,
          layout: 'pc'
        },
      };
      
      console.log('正在初始化人事顾问Coze嵌入式聊天客户端，配置信息:', {
        botId: config.config.botId,
        layout: config.ui.base.layout,
        hasToken: !!config.auth.token,
        isIframe: config.config.isIframe,
        asstBtnDisabled: !config.ui.asstBtn.isNeed,
        componentProps: {
          title: config.componentProps?.title,
          uploadable: config.componentProps?.uploadable,
          width: config.componentProps?.width,
          height: config.componentProps?.height,
          hasContainer: !!config.componentProps?.el
        }
      });
      
      // 清理现有的聊天客户端（如果存在）
      if (chatClient) {
        try {
          if (typeof chatClient.hideChatBot === 'function') {
            chatClient.hideChatBot();
          }
          if (typeof chatClient.unmount === 'function') {
            chatClient.unmount();
          }
        } catch (e) {
          console.warn('清理现有客户端时出错:', e);
        }
      }
      
      // 添加网络错误监听器，忽略监控相关的网络错误
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes('mon.zijieapi.com')) {
          return Promise.reject(new Error('Monitoring disabled'));
        }
        return originalFetch.apply(this, args);
      };
      
      // 创建聊天客户端
      const client = new window.CozeWebSDK.WebChatClient(config);
      
      // 恢复原始的fetch函数
      window.fetch = originalFetch;
      
      if (!client) {
        throw new Error('Coze WebChatClient 实例创建失败');
      }
      
      console.log('人事顾问 Coze WebChatClient 实例创建成功:', {
        clientType: typeof client,
        hasShowChatBot: typeof client.showChatBot === 'function',
        hasHideChatBot: typeof client.hideChatBot === 'function',
        hasUnmount: typeof client.unmount === 'function',
        timestamp: new Date().toISOString()
      });
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (typeof client.showChatBot === 'function') {
        client.showChatBot();
        console.log('人事顾问聊天框已显示');
        
        setTimeout(() => {
          if (chatContainerRef.current) {
            const cozeElements = chatContainerRef.current.querySelectorAll('[class*="coze"], [id*="coze"], iframe');
            console.log('人事顾问 Coze SDK 元素检查:', {
              containerHasChildren: chatContainerRef.current.children.length > 0,
              cozeElementsFound: cozeElements.length,
              containerInnerHTML: chatContainerRef.current.innerHTML.length > 0 ? '有内容' : '无内容'
            });
            
            if (cozeElements.length === 0 && chatContainerRef.current.children.length === 0) {
              console.warn('警告：容器内未发现 Coze SDK 创建的元素，el 参数可能未正确配置');
            } else {
              console.log('✓ el 参数配置成功：人事顾问 Coze SDK 已在指定容器内创建聊天界面');
            }
          }
        }, 1000);
      } else {
        console.warn('showChatBot 方法不可用');
      }
      
      if (!isMountedRef.current) {
        console.log('组件在SDK初始化过程中被卸载，清理客户端');
        if (client) {
          try {
            if (typeof client.hideChatBot === 'function') {
              client.hideChatBot();
            }
            if (typeof client.unmount === 'function') {
              client.unmount();
            }
          } catch (e) {
            console.warn('清理临时客户端失败:', e);
          }
        }
        return;
      }
      
      setChatClient(client);
      
      console.log('=== 人事顾问 Coze 嵌入式聊天客户端初始化完成 ===');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      console.error('=== 人事顾问 Coze 聊天初始化失败 ===', {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('VITE_COZE_SAT_TOKEN')) {
        userFriendlyMessage = '配置错误：请检查 Coze SAT Token 是否正确配置';
      } else if (errorMessage.includes('DOM')) {
        userFriendlyMessage = '界面加载错误：请刷新页面重试';
      } else if (errorMessage.includes('CozeWebSDK')) {
        userFriendlyMessage = '服务连接错误：请检查网络连接或稍后重试';
      }
      
      if (isMountedRef.current) {
        setError(userFriendlyMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const waitForCozeSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.CozeWebSDK) {
        resolve();
        return;
      }

      let attempts = 0;
      const maxAttempts = 50;
      
      const checkSDK = () => {
        attempts++;
        if (window.CozeWebSDK) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Coze SDK 加载超时，请刷新页面重试'));
        } else {
          setTimeout(checkSDK, 100);
        }
      };
      
      checkSDK();
    });
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleRetry = () => {
    initializeCozeChat();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* 头部导航 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">返回首页</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👥</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">人事智能顾问</h1>
                  <p className="text-xs text-gray-500">HR 智能咨询服务</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 lg:py-12 max-w-7xl mx-auto w-full" style={{ minHeight: 'calc(100vh - 64px)', height: '800px', maxHeight: '85vh' }}>
        <div className="w-full max-w-sm sm:max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl h-full">
          {/* 聊天容器 */}
          <div 
            ref={chatContainerRef}
            id="coze-chat-container-hr"
            className="coze-chat-container relative w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200/50 overflow-hidden mx-auto"
            style={{ 
              height: '100%',
              minHeight: '700px',
              width: '100%',
              maxWidth: '1200px',
              position: 'relative',
              zIndex: 1,
              overflow: 'hidden',
              contain: 'layout style size'
            }}
          >
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">正在初始化人事咨询</h3>
                  <p className="text-gray-600">请稍候，正在为您连接人事智能顾问...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-center max-w-md mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">连接失败</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    重新连接
                  </button>
                </div>
              </div>
            )}

            {!isLoading && !error && chatClient && (
              <div className="absolute top-0 left-0 right-0 text-center py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200 z-20">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">人事咨询已就绪</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRConsultantChat;