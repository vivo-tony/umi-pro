import { request } from '@umijs/max';

// 后端国际化字典返回结构（按后端实际约定调整）
export interface I18nDictResult {
  success: boolean;
  data: Record<string, string>;
}

/**
 * 请求指定语言的国际化字典。
 * 例：GET /api/i18n/messages?locale=zh-CN
 */
export async function fetchLocaleMessages(
  locale: string,
  options?: Record<string, any>,
) {
  return request<I18nDictResult>('/api/i18n/messages', {
    method: 'GET',
    params: { locale },
    ...(options || {}),
  });
}
