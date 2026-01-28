import type { ExperienceCategory } from '@/types/api';

export interface CategoryConfig {
  bg: string;
  icon: string;
  label: string;
}

export const CATEGORY_CONFIG: Record<ExperienceCategory, CategoryConfig> = {
  '고객 가치 지향': { bg: 'bg-icon-bg-1', icon: '/icons/category/icon-1.svg', label: '고객이해력' },
  '기술적 전문성': { bg: 'bg-icon-bg-2', icon: '/icons/category/icon-2.svg', label: '전문성' },
  '협력적 소통': { bg: 'bg-icon-bg-3', icon: '/icons/category/icon-3.svg', label: '소통력' },
  '주도적 실행력': { bg: 'bg-icon-bg-4', icon: '/icons/category/icon-4.svg', label: '실행력' },
  '논리적 분석력': { bg: 'bg-icon-bg-5', icon: '/icons/category/icon-5.svg', label: '분석력' },
  '창의적 문제해결': { bg: 'bg-icon-bg-6', icon: '/icons/category/icon-6.svg', label: '문제해결력' },
  '유연한 적응력': { bg: 'bg-icon-bg-7', icon: '/icons/category/icon-7.svg', label: '적응력' },
  '끈기있는 책임감': { bg: 'bg-icon-bg-8', icon: '/icons/category/icon-8.svg', label: '책임감' },
};

export const DEFAULT_CATEGORY = CATEGORY_CONFIG['고객 가치 지향'];

export function getCategoryConfig(category: string): CategoryConfig {
  return CATEGORY_CONFIG[category as ExperienceCategory] || DEFAULT_CATEGORY;
}
