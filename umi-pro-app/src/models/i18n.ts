import { getLocale } from '@umijs/max';
import { useCallback, useState } from 'react';
import { fetchLocaleMessages } from '@/services/i18n';

/**
 * 远程国际化字典 store：只存远程下发的 JSON，与本地打包的字典分开管理。
 * - 本地字典：走 useIntl / FormattedMessage
 * - 远程字段：从这里读
 *   const { messages, loading, load } = useModel('i18n');
 *   messages['some.remote.key']
 */
export default function useI18nDict() {
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [locale, setLocale] = useState<string>(getLocale());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (lang?: string) => {
    const target = lang || getLocale();
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLocaleMessages(target);
      const dict = res?.data ?? {};
      setMessages(dict);
      setLocale(target);
      return dict;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { messages, locale, loading, error, load };
}
