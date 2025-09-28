import { Consultant, ConsultantCategory, BRANDS } from '../types/consultant';

// 顾问服务数据
export const consultants: Consultant[] = [
  // 单一版本顾问
  {
    id: 'strategy-001',
    name: '公司战略顾问',
    type: 'strategy',
    description: '专业的企业战略规划与发展咨询服务',
    expertise: ['战略规划', '市场分析', '竞争策略', '商业模式设计'],
    botId: '7554346454786113571'
  },
  {
    id: 'hr-001',
    name: '人事顾问',
    type: 'hr',
    description: '人力资源管理与组织发展专家',
    expertise: ['招聘策略', '绩效管理', '薪酬设计', '组织架构'],
    botId: '7555030161654366235'
  },
  {
    id: 'stock-001',
    name: '股票顾问',
    type: 'stock',
    description: '专业的股票投资分析与建议服务',
    expertise: ['技术分析', '基本面分析', '风险控制', '投资策略'],
    botId: '7554346454786113571'
  },

  // 颜泡泡品牌顾问
  {
    id: 'finance-yanpaopao',
    name: '财务顾问 - 颜泡泡',
    type: 'finance',
    brand: BRANDS.YANPAOPAO,
    description: '颜泡泡品牌专属财务管理顾问',
    expertise: ['财务规划', '成本控制', '投资分析', '税务筹划'],
    botId: '7554346454786113571'
  },
  {
    id: 'marketing-yanpaopao',
    name: '营销顾问 - 颜泡泡',
    type: 'marketing',
    brand: BRANDS.YANPAOPAO,
    description: '颜泡泡品牌营销策略专家',
    expertise: ['品牌策略', '数字营销', '内容营销', '用户增长'],
    botId: '7554346454786113571'
  },
  {
    id: 'development-yanpaopao',
    name: '开发顾问 - 颜泡泡',
    type: 'development',
    brand: BRANDS.YANPAOPAO,
    description: '颜泡泡技术开发与产品创新顾问',
    expertise: ['技术架构', '产品开发', '项目管理', '技术选型'],
    botId: '7554346454786113571'
  },
  {
    id: 'advertising-yanpaopao',
    name: '广告顾问 - 颜泡泡',
    type: 'advertising',
    brand: BRANDS.YANPAOPAO,
    description: '颜泡泡广告投放与创意策划专家',
    expertise: ['广告策略', '创意设计', '媒体投放', '效果优化'],
    botId: '7554346454786113571'
  },
  {
    id: 'sales-yanpaopao',
    name: '销售顾问 - 颜泡泡',
    type: 'sales',
    brand: BRANDS.YANPAOPAO,
    description: '颜泡泡销售策略与渠道管理顾问',
    expertise: ['销售策略', '渠道管理', '客户关系', '业绩提升'],
    botId: '7554346454786113571'
  },
  {
    id: 'service-yanpaopao',
    name: '用户服务顾问 - 颜泡泡',
    type: 'service',
    brand: BRANDS.YANPAOPAO,
    description: '颜泡泡用户体验与服务优化专家',
    expertise: ['用户体验', '服务流程', '客户满意度', '问题解决'],
    botId: '7554346454786113571'
  },

  // 宠小妹品牌顾问
  {
    id: 'finance-chongxiaomei',
    name: '财务顾问 - 宠小妹',
    type: 'finance',
    brand: BRANDS.CHONGXIAOMEI,
    description: '宠小妹品牌专属财务管理顾问',
    expertise: ['财务规划', '成本控制', '投资分析', '税务筹划'],
    botId: '7554346454786113571'
  },
  {
    id: 'marketing-chongxiaomei',
    name: '营销顾问 - 宠小妹',
    type: 'marketing',
    brand: BRANDS.CHONGXIAOMEI,
    description: '宠小妹品牌营销策略专家',
    expertise: ['品牌策略', '数字营销', '内容营销', '用户增长'],
    botId: '7554346454786113571'
  },
  {
    id: 'development-chongxiaomei',
    name: '开发顾问 - 宠小妹',
    type: 'development',
    brand: BRANDS.CHONGXIAOMEI,
    description: '宠小妹技术开发与产品创新顾问',
    expertise: ['技术架构', '产品开发', '项目管理', '技术选型'],
    botId: '7554346454786113571'
  },
  {
    id: 'advertising-chongxiaomei',
    name: '广告顾问 - 宠小妹',
    type: 'advertising',
    brand: BRANDS.CHONGXIAOMEI,
    description: '宠小妹广告投放与创意策划专家',
    expertise: ['广告策略', '创意设计', '媒体投放', '效果优化'],
    botId: '7554346454786113571'
  },
  {
    id: 'sales-chongxiaomei',
    name: '销售顾问 - 宠小妹',
    type: 'sales',
    brand: BRANDS.CHONGXIAOMEI,
    description: '宠小妹销售策略与渠道管理顾问',
    expertise: ['销售策略', '渠道管理', '客户关系', '业绩提升'],
    botId: '7554346454786113571'
  },
  {
    id: 'service-chongxiaomei',
    name: '用户服务顾问 - 宠小妹',
    type: 'service',
    brand: BRANDS.CHONGXIAOMEI,
    description: '宠小妹用户体验与服务优化专家',
    expertise: ['用户体验', '服务流程', '客户满意度', '问题解决'],
    botId: '7554346454786113571'
  },

  // 玥星球品牌顾问
  {
    id: 'finance-yuexingqiu',
    name: '财务顾问 - 玥星球',
    type: 'finance',
    brand: BRANDS.YUEXINGQIU,
    description: '玥星球品牌专属财务管理顾问',
    expertise: ['财务规划', '成本控制', '投资分析', '税务筹划'],
    botId: '7554346454786113571'
  },
  {
    id: 'marketing-yuexingqiu',
    name: '营销顾问 - 玥星球',
    type: 'marketing',
    brand: BRANDS.YUEXINGQIU,
    description: '玥星球品牌营销策略专家',
    expertise: ['品牌策略', '数字营销', '内容营销', '用户增长'],
    botId: '7554346454786113571'
  },
  {
    id: 'development-yuexingqiu',
    name: '开发顾问 - 玥星球',
    type: 'development',
    brand: BRANDS.YUEXINGQIU,
    description: '玥星球技术开发与产品创新顾问',
    expertise: ['技术架构', '产品开发', '项目管理', '技术选型'],
    botId: '7554346454786113571'
  },
  {
    id: 'advertising-yuexingqiu',
    name: '广告顾问 - 玥星球',
    type: 'advertising',
    brand: BRANDS.YUEXINGQIU,
    description: '玥星球广告投放与创意策划专家',
    expertise: ['广告策略', '创意设计', '媒体投放', '效果优化'],
    botId: '7554346454786113571'
  },
  {
    id: 'sales-yuexingqiu',
    name: '销售顾问 - 玥星球',
    type: 'sales',
    brand: BRANDS.YUEXINGQIU,
    description: '玥星球销售策略与渠道管理顾问',
    expertise: ['销售策略', '渠道管理', '客户关系', '业绩提升'],
    botId: '7554346454786113571'
  },
  {
    id: 'service-yuexingqiu',
    name: '用户服务顾问 - 玥星球',
    type: 'service',
    brand: BRANDS.YUEXINGQIU,
    description: '玥星球用户体验与服务优化专家',
    expertise: ['用户体验', '服务流程', '客户满意度', '问题解决'],
    botId: '7554346454786113571'
  }
];

// 按类型分组的顾问数据
export const consultantCategories: ConsultantCategory[] = [
  {
    type: 'strategy',
    title: '公司战略顾问',
    icon: '🎯',
    consultants: consultants.filter(c => c.type === 'strategy')
  },
  {
    type: 'hr',
    title: '人事顾问',
    icon: '👥',
    consultants: consultants.filter(c => c.type === 'hr')
  },
  {
    type: 'stock',
    title: '股票顾问',
    icon: '📈',
    consultants: consultants.filter(c => c.type === 'stock')
  },
  {
    type: 'finance',
    title: '财务顾问',
    icon: '💰',
    consultants: consultants.filter(c => c.type === 'finance')
  },
  {
    type: 'marketing',
    title: '营销顾问',
    icon: '📢',
    consultants: consultants.filter(c => c.type === 'marketing')
  },
  {
    type: 'development',
    title: '开发顾问',
    icon: '💻',
    consultants: consultants.filter(c => c.type === 'development')
  },
  {
    type: 'advertising',
    title: '广告顾问',
    icon: '🎨',
    consultants: consultants.filter(c => c.type === 'advertising')
  },
  {
    type: 'sales',
    title: '销售顾问',
    icon: '🤝',
    consultants: consultants.filter(c => c.type === 'sales')
  },
  {
    type: 'service',
    title: '用户服务顾问',
    icon: '🎧',
    consultants: consultants.filter(c => c.type === 'service')
  }
];

// 获取指定类型的顾问
export const getConsultantsByType = (type: string) => {
  return consultants.filter(consultant => consultant.type === type);
};

// 获取指定品牌的顾问
export const getConsultantsByBrand = (brand: string) => {
  return consultants.filter(consultant => consultant.brand === brand);
};

// 根据ID获取顾问
export const getConsultantById = (id: string) => {
  return consultants.find(consultant => consultant.id === id);
};