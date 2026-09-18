// 汇总所有语言包的 id，为 useTypedIntl 提供类型推导。
// 注意：新增语言包后要在这里补一行 import，才能被纳入 id 推导。
import type zhCN from '@/locales/zh-CN';
import type enUS from '@/locales/en-US';
import type access from '@/pages/Access/locales';

// 全局语言包是扁平结构：{ 'menu.home': '首页', ... }
type GlobalIds = keyof typeof zhCN | keyof typeof enUS;

// 页面级语言包是 { 'zh-CN': {...}, 'en-US': {...} } 结构，取各语言 key 的并集
type AccessIds =
  | keyof (typeof access)['zh-CN']
  | keyof (typeof access)['en-US'];

/** 所有已注册文案 id 的联合类型，formatMessage({ id }) 只能取这里面的值 */
export type MessageIds = GlobalIds | AccessIds;
