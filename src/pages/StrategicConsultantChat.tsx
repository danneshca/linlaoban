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



const StrategicConsultantChat: React.FC = () => {
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true); // 组件挂载状态标志
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatClient, setChatClient] = useState<CozeWebChatClient | null>(null);

  // 组件挂载时的调试日志和状态设置
  useEffect(() => {
    // 确保挂载标志为true
    isMountedRef.current = true;
    
    // 注入CSS样式
    const styleElement = document.createElement('style');
    styleElement.textContent = cozeSDKStyles;
    styleElement.id = 'coze-sdk-styles';
    document.head.appendChild(styleElement);
    
    console.log('=== StrategicConsultantChat 组件挂载 ===', {
      timestamp: new Date().toISOString(),
      isMounted: isMountedRef.current,
      hasContainer: !!chatContainerRef.current
    });
    
    return () => {
      console.log('=== StrategicConsultantChat 组件卸载开始 ===', {
        timestamp: new Date().toISOString(),
        hadChatClient: !!chatClient
      });
      // 标记组件已卸载
      isMountedRef.current = false;
      
      // 移除注入的CSS样式
      const existingStyle = document.getElementById('coze-sdk-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  useEffect(() => {
    // 设置组件挂载状态
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
      // 双重检查组件挂载状态
      if (isMountedRef.current && chatContainerRef.current) {
        console.log('开始初始化Coze聊天客户端...');
        initializeCozeChat();
      } else {
        console.log('组件未完全挂载，跳过初始化');
      }
    }, 300); // 增加延迟到300ms，确保组件完全稳定

    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []); // 移除chatClient依赖，避免重复初始化

  // 单独的清理effect，确保组件卸载时正确清理
  useEffect(() => {
    return () => {
      // 标记组件已卸载
      isMountedRef.current = false;
      
      // 组件卸载时清理聊天客户端
      if (chatClient) {
        try {
          console.log('正在清理Coze聊天客户端...');
          
          // 隐藏聊天框
          if (typeof chatClient.hideChatBot === 'function') {
            chatClient.hideChatBot();
          }
          
          // 使用正确的unmount方法
          if (typeof chatClient.unmount === 'function') {
            chatClient.unmount();
          }
          
          console.log('Coze聊天客户端清理完成');
        } catch (error) {
          console.warn('清理聊天客户端时出错:', error);
        }
      }
    };
  }, [chatClient]); // 依赖chatClient，确保在客户端变化时重新设置清理函数

  const initializeCozeChat = async () => {
    try {
      // 检查组件是否仍然挂载
      if (!isMountedRef.current) {
        console.log('组件已卸载，取消初始化');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      console.log('=== Coze 聊天客户端初始化开始 ===');
      
      // 使用硬编码的 token
      const token = 'sat_P9aesxbg2IKXyDuS70T9ArcaaERxCV2adE7EEtOgbs0ju3BVZ3TDh57JKHjQ4ZBP';
      const botId = '7554346454786113571';
      
      console.log('Token 检查:', {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        botId: botId,
        nodeEnv: import.meta.env.MODE
      });
      
      if (!token) {
        throw new Error('Coze SAT Token 未配置');
      }
      
      if (token.length < 10) {
        throw new Error('Coze SAT Token 格式不正确，请检查 Token 是否完整');
      }
      
      console.log('开始等待 Coze SDK 加载...');
      
      // 等待 Coze SDK 加载
      await waitForCozeSDK();
      
      // 再次检查组件挂载状态
      if (!isMountedRef.current) {
        console.log('组件在SDK加载过程中被卸载');
        return;
      }
      
      console.log('Coze SDK 加载完成，检查 DOM 容器...');
      
      // 根据 Coze Web SDK 官方文档，严格验证 el 参数的容器元素
      if (!chatContainerRef.current) {
        throw new Error('聊天容器DOM元素未找到，请检查组件渲染状态');
      }
      
      // 验证容器是否为有效的 HTMLElement（根据官方文档要求）
      if (!(chatContainerRef.current instanceof HTMLElement)) {
        throw new Error('el参数必须是有效的HTMLElement对象');
      }
      
      // 检查DOM容器是否已挂载到文档中
      if (!document.contains(chatContainerRef.current)) {
        throw new Error('聊天容器未挂载到文档中，请等待组件完全渲染');
      }
      
      // 检查容器是否可见且具有有效尺寸
      const containerRect = chatContainerRef.current.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.warn('聊天容器尺寸为0，可能影响SDK渲染，尝试等待容器完全渲染');
        // 等待一小段时间让容器完全渲染
        await new Promise(resolve => setTimeout(resolve, 100));
        const newRect = chatContainerRef.current.getBoundingClientRect();
        if (newRect.width === 0 || newRect.height === 0) {
          console.warn('容器尺寸仍为0，但继续初始化SDK');
        }
      }
      
      // 确保容器具有正确的样式属性以支持 Coze SDK
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
        boundingRect: containerRect,
        computedStyles: {
          position: computedStyle.position,
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          overflow: computedStyle.overflow
        }
      });

      // 配置 Coze 客户端 - 嵌入式模式，禁用悬浮球和监控
      // 根据 Coze Web SDK 官方文档优化 el 参数配置
      const config: CozeConfig = {
        config: {
          botId: botId, // 使用配置的 bot_id
          isIframe: false, // 设置为非iframe模式
          disableAnalytics: true, // 禁用分析和监控数据收集
          disableTelemetry: true, // 禁用遥测数据
        },
        auth: {
          type: 'token',
          token: token,
          onRefreshToken: async () => token, // 异步返回token
        },
        userInfo: {
          id: '123',
          url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
          nickname: '战略咨询用户',
        },
        ui: {
          base: {
            icon: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
            layout: 'pc',
            zIndex: 100,
          },
          asstBtn: {
            isNeed: false, // 禁用悬浮球
          },
          header: {
            isShow: true,
            isNeedClose: false
          },
          chatBot: {
            el: chatContainerRef.current // 根据官方文档，el参数应该在ui.chatBot中
          }
        },
        componentProps: {
          title: '林老板智能助手',
          uploadable: false,
          width: 1000,
          height: 600,
          isNeedAudio: true, // 支持语音输入
          isNeedFunctionCallMessage: true, // 显示插件工具调用信息
          isNeedAddNewConversation: true, // 显示新建会话按钮
          layout: 'pc' // 明确指定PC布局
        },
      };
      
      console.log('正在初始化Coze嵌入式聊天客户端，配置信息:', {
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
          hasContainer: !!config.componentProps?.el,
          containerElement: config.componentProps?.el?.tagName,
          containerDimensions: {
            width: config.componentProps?.el?.clientWidth,
            height: config.componentProps?.el?.clientHeight
          },
          isNeedAudio: config.componentProps?.isNeedAudio,
          isNeedFunctionCallMessage: config.componentProps?.isNeedFunctionCallMessage,
          isNeedAddNewConversation: config.componentProps?.isNeedAddNewConversation
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
          // 忽略监控数据收集请求
          return Promise.reject(new Error('Monitoring disabled'));
        }
        return originalFetch.apply(this, args);
      };
      
      // 创建聊天客户端
      const client = new window.CozeWebSDK.WebChatClient(config);
      
      // 恢复原始的fetch函数
      window.fetch = originalFetch;
      
      // 验证客户端实例
      if (!client) {
        throw new Error('Coze WebChatClient 实例创建失败');
      }
      
      console.log('Coze WebChatClient 实例创建成功:', {
        clientType: typeof client,
        hasShowChatBot: typeof client.showChatBot === 'function',
        hasHideChatBot: typeof client.hideChatBot === 'function',
        hasUnmount: typeof client.unmount === 'function',
        timestamp: new Date().toISOString()
      });
      
      // 等待一小段时间确保SDK完全初始化
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 显示聊天框（因为禁用了悬浮球，需要手动显示）
      if (typeof client.showChatBot === 'function') {
        client.showChatBot();
        console.log('聊天框已显示');
        
        // 验证 el 参数配置是否生效：检查容器内是否有 Coze SDK 创建的元素
        setTimeout(() => {
          if (chatContainerRef.current) {
            const cozeElements = chatContainerRef.current.querySelectorAll('[class*="coze"], [id*="coze"], iframe');
            console.log('Coze SDK 元素检查:', {
              containerHasChildren: chatContainerRef.current.children.length > 0,
              cozeElementsFound: cozeElements.length,
              containerInnerHTML: chatContainerRef.current.innerHTML.length > 0 ? '有内容' : '无内容'
            });
            
            if (cozeElements.length === 0 && chatContainerRef.current.children.length === 0) {
              console.warn('警告：容器内未发现 Coze SDK 创建的元素，el 参数可能未正确配置');
            } else {
              console.log('✓ el 参数配置成功：Coze SDK 已在指定容器内创建聊天界面');
            }
          }
        }, 1000); // 等待1秒让SDK完全渲染
      } else {
        console.warn('showChatBot 方法不可用');
      }
      
      // 最终检查组件和DOM状态
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
      
      console.log('=== Coze 嵌入式聊天客户端初始化完成 ===');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      console.error('=== Coze 聊天初始化失败 ===', {
        error: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
      
      // 根据错误类型提供更具体的错误信息
      let userFriendlyMessage = errorMessage;
      if (errorMessage.includes('VITE_COZE_SAT_TOKEN')) {
        userFriendlyMessage = '配置错误：请检查 Coze SAT Token 是否正确配置';
      } else if (errorMessage.includes('DOM')) {
        userFriendlyMessage = '界面加载错误：请刷新页面重试';
      } else if (errorMessage.includes('CozeWebSDK')) {
        userFriendlyMessage = '服务连接错误：请检查网络连接或稍后重试';
      }
      
      // 只在组件仍然挂载时更新错误状态
      if (isMountedRef.current) {
        setError(userFriendlyMessage);
      }
    } finally {
      // 只在组件仍然挂载时更新加载状态
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
      const maxAttempts = 50; // 5秒超时
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🎯</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">公司战略顾问</h1>
                  <p className="text-xs text-gray-500">AI 智能咨询服务</p>
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
            id="coze-chat-container"
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">正在初始化智能咨询</h3>
                  <p className="text-gray-600">请稍候，正在为您连接公司战略顾问...</p>
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
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    重新连接
                  </button>
                </div>
              </div>
            )}

            {!isLoading && !error && chatClient && (
              <div className="absolute top-0 left-0 right-0 text-center py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 z-20">
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">智能咨询已就绪</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicConsultantChat;