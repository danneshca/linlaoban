// Coze Web SDK 服务
import type { CozeConfig, CozeWebChatClient } from '../types/coze';
import '../types/coze'; // 导入全局类型声明

class CozeService {
  private static instance: CozeService;
  private chatClient: CozeWebChatClient | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): CozeService {
    if (!CozeService.instance) {
      CozeService.instance = new CozeService();
    }
    return CozeService.instance;
  }

  // 初始化 Coze SDK
  public initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      // 检查 SDK 是否已加载
      if (typeof window !== 'undefined' && window.CozeWebSDK) {
        this.isInitialized = true;
        resolve();
      } else {
        // 等待 SDK 加载
        const checkSDK = () => {
          if (window.CozeWebSDK) {
            this.isInitialized = true;
            resolve();
          } else {
            setTimeout(checkSDK, 100);
          }
        };
        checkSDK();
      }
    });
  }

  // 启动与指定顾问的对话
  public async startConsultation(consultantId: string, consultantName: string): Promise<void> {
    try {
      // 验证只有公司战略顾问才能使用AI对话功能
      if (consultantId !== 'strategy-001') {
        throw new Error(`${consultantName} 暂不支持AI对话功能`);
      }

      await this.initialize();

      const token = import.meta.env.VITE_COZE_SAT_TOKEN;
      if (!token) {
        throw new Error('Coze SAT Token 未配置');
      }

      // 创建新的聊天客户端实例
      const config: CozeConfig = {
        config: {
          botId: '7554346454786113571', // 使用用户提供的 bot_id
          isIframe: false,
          disableAnalytics: true,
          disableTelemetry: true,
        },
        componentProps: {
          title: `${consultantName} - 智能咨询`,
          uploadable: false,
          layout: 'pc',
        },
        auth: {
          type: 'token',
          token: token,
          onRefreshToken: () => token,
        },
        userInfo: {
          id: '123',
          url: 'https://lf-coze-web-cdn.coze.cn/obj/coze-web-cn/obric/coze/favicon.1970.png',
          nickname: '咨询用户',
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
            isNeedClose: false,
          },
        },
      };

      // 创建聊天客户端
      this.chatClient = new window.CozeWebSDK.WebChatClient(config);
      
      console.log(`已启动与 ${consultantName} 的对话咨询`);
    } catch (error) {
      console.error('启动咨询对话失败:', error);
      throw error;
    }
  }

  // 检查 SDK 是否可用
  public isSDKAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.CozeWebSDK;
  }

  // 获取当前聊天客户端
  public getChatClient(): CozeWebChatClient | null {
    return this.chatClient;
  }
}

// 导出单例实例
export const cozeService = CozeService.getInstance();
export default cozeService;