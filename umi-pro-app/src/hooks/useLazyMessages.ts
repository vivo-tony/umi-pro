import { useEffect, useState } from 'react';
import { registerLocale } from '@/i18n/registerLocale';

/**
 * 语言包文件的标准结构：key 为语言（如 'zh-CN' / 'en-US'），值为该语言下的文案字典。
 */
export type LocaleMessages = Record<string, Record<string, string>>;

// 已加载过的 namespace 缓存，避免重复 import 和重复 addLocale
const loadedNamespaces = new Set<string>();

/**
 * 按页面按需加载语言包。
 *
 * 为什么不用 src/locales：umi 的 locale 插件会把 src/locales 下所有文件
 * 静态 import 进主包（首屏全量加载），语言文件一大首屏就慢。
 * 所以：src/locales 只放菜单/全局这类首屏必需且很小的文案；
 * 页面级大文案 co-located 在页面旁，用这个 hook 首次进入该页面时才动态加载。
 *
 * @param namespace 页面唯一标识，用于缓存
 * @param loader    返回页面语言包（含所有语言）的动态 import
 */
export function useLazyMessages(
  namespace: string,
  loader: () => Promise<{ default: LocaleMessages }>,
) {
  const [loaded, setLoaded] = useState(() => loadedNamespaces.has(namespace));

  useEffect(() => {
    if (loadedNamespaces.has(namespace)) {
      return;
    }
    let alive = true;
    loader().then(({ default: messagesByLocale }) => {
      if (!alive) {
        return;
      }
      // 一次性注册该 namespace 的所有语言，之后切换语言无需再加载
      Object.entries(messagesByLocale).forEach(([locale, messages]) => {
        registerLocale(locale, messages);
      });
      loadedNamespaces.add(namespace);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [namespace, loader]);

  return loaded;
}
