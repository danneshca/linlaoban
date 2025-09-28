// 顾问服务类型定义
export interface Consultant {
  id: string;
  name: string;
  type: ConsultantType;
  brand?: string; // 品牌标识：颜泡泡、宠小妹、玥星球
  description: string;
  expertise: string[];
  avatar?: string;
  botId?: string; // 对应的Coze Bot ID
}

export type ConsultantType = 
  | 'strategy' // 公司战略顾问
  | 'hr' // 人事顾问
  | 'stock' // 股票顾问
  | 'finance' // 财务顾问
  | 'marketing' // 营销顾问
  | 'development' // 开发顾问
  | 'advertising' // 广告顾问
  | 'sales' // 销售顾问
  | 'service'; // 用户服务顾问

export interface ConsultantCategory {
  type: ConsultantType;
  title: string;
  icon: string;
  consultants: Consultant[];
}

// 品牌配置
export const BRANDS = {
  YANPAOPAO: '颜泡泡',
  CHONGXIAOMEI: '宠小妹',
  YUEXINGQIU: '玥星球'
} as const;

export type Brand = typeof BRANDS[keyof typeof BRANDS];