import { addLocale } from '@umijs/max';

/**
 * 注册/合并一段文案到指定语言（umi 国际化）。
 * addLocale 的第三个参数（momentLocale / antd）运行时可选，但 umi 生成的类型
 * 把它标成了必填，这里统一透传空对象并收敛 cast。
 */
export function registerLocale(
  locale: string,
  messages: Record<string, string>,
) {
  addLocale(locale, messages, {} as any);
}
