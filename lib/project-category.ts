const translations: Record<string, string> = {
  'AI 产品设计': 'AI Product Design',
  '电商视觉设计': 'E-commerce Visual Design',
  '品牌视觉设计': 'Brand Visual Design',
  '前端开发': 'Frontend Development',
  'SaaS 产品': 'SaaS Product',
  '创意实验': 'Creative Experiment',
};

export function getProjectCategoryEn(category: string) {
  return translations[category] ?? category;
}
