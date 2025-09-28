// Coze Web SDK 类型定义

// 声明全局 CozeWebSDK 类型
declare global {
  interface Window {
    CozeWebSDK: {
      WebChatClient: new (config: CozeConfig) => CozeWebChatClient;
    };
  }
}

export interface CozeConfig {
  config: {
    bot_id?: string;
    botId?: string;
    isIframe?: boolean;
    disableAnalytics?: boolean;
    disableTelemetry?: boolean;
  };
  componentProps?: {
    title?: string;
    uploadable?: boolean;
    width?: string | number;
    height?: string | number;
    el?: HTMLElement;
    isNeedAudio?: boolean;
    isNeedFunctionCallMessage?: boolean;
    isNeedAddNewConversation?: boolean;
    layout?: 'pc' | 'mobile';
  };
  auth: {
    type: 'token';
    token: string;
    onRefreshToken: () => string | Promise<string>;
  };
  userInfo?: {
    id: string;
    url: string;
    nickname: string;
  };
  ui?: {
    base?: {
      icon?: string;
      layout?: 'pc' | 'mobile';
      zIndex?: number;
    };
    asstBtn?: {
      isNeed?: boolean;
    };
    header?: {
      isShow?: boolean;
      isNeedClose?: boolean;
    };
    chatBot?: {
      el?: HTMLElement;
    };
  };
}

export interface CozeWebChatClient {
  showChatBot: () => void;
  hideChatBot: () => void;
  unmount: () => void;
}