import { useIntl } from '@umijs/max';
import type { ReactNode } from 'react';
import type { MessageIds } from './messages';

type IntlShape = ReturnType<typeof useIntl>;

type Values = Record<string, unknown>;

type TypedDescriptor = {
  id: MessageIds;
  description?: string | object;
  defaultMessage?: string;
};

export type TypedIntl = Omit<
  IntlShape,
  'formatMessage' | 'formatHTMLMessage'
> & {
  formatMessage: (descriptor: TypedDescriptor, values?: Values) => string;
  formatHTMLMessage: (descriptor: TypedDescriptor, values?: Values) => ReactNode;
};

/**
 * 带 id 类型推导的 useIntl：formatMessage({ id }) 里的 id 只能是字典里已有的 key，
 * IDE 会自动补全，拼错在编译期报错。
 * （react-intl v3 无法通过模块增强收窄 id，故用包装器实现，用法不变）
 */
export function useTypedIntl(): TypedIntl {
  return useIntl() as TypedIntl;
}
