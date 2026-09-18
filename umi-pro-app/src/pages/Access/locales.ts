import type { LocaleMessages } from '@/hooks/useLazyMessages';

// 页面级文案：随页面懒加载，不进首屏主包
// 用 satisfies 而非显式标注，否则索引签名会抹掉字面量 key，导致 id 无法类型推导
const messages = {
  'zh-CN': {
    'access.title': '权限示例',
    'access.onlyAdmin': '只有 Admin 可以看到这个按钮',
  },
  'en-US': {
    'access.title': 'Access Example',
    'access.onlyAdmin': 'Only Admin can see this button',
  },
} satisfies LocaleMessages;

export default messages;
