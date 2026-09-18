'use strict';

/**
 * 本地 ESLint 规则（配合 eslint-plugin-local-rules 使用）。
 * 在这里维护项目自定义规则，.eslintrc.js 里通过 local-rules/xxx 引用。
 */

// 直接产生 UI 的全局函数：alert('...') / confirm('...')
const DEFAULT_UI_CALLEES = ['alert', 'confirm', 'prompt'];

// UI 组件的典型方法名：message.success / notification.error / toast 等
const DEFAULT_UI_METHODS = [
  'success',
  'error',
  'warning',
  'warn',
  'info',
  'loading',
  'open',
  'confirm',
];

// 典型 UI 字段名：{ title: '...', placeholder: '...' }（pro-table 列、表单、Modal 等）
const DEFAULT_UI_PROPS = [
  'title',
  'subTitle',
  'label',
  'placeholder',
  'text',
  'message',
  'content',
  'description',
  'tooltip',
  'tip',
  'okText',
  'cancelText',
  'confirmTitle',
  'successText',
  'emptyText',
];

module.exports = {
  /**
   * 禁止在 UI 上下文硬编码中文文案，强制走国际化。
   * 只匹配「会被渲染给用户」的字符串：
   *   - JSX 文本 / JSX 属性 / JSX 表达式里的字符串
   *   - UI 组件方法调用参数（message.success / alert 等）
   *   - UI 字段的对象属性值（{ title, placeholder, message ... }）
   * 普通变量赋值、数组、console、正则、非 UI 字段等一律放过。
   * 默认跳过路径中包含 /locales/ 或文件名形如 locales.* 的语言包文件。
   */
  'no-hardcoded-chinese': {
    meta: {
      type: 'suggestion',
      docs: {
        description:
          '禁止在 UI 上下文硬编码中文，未国际化文案请使用 useIntl / FormattedMessage',
      },
      messages: {
        hardcoded:
          '检测到 UI 中硬编码中文“{{text}}”，请使用 useIntl / FormattedMessage 做国际化',
      },
      schema: [
        {
          type: 'object',
          properties: {
            // 额外放行的路径片段（除了默认的 locales 目录）
            allow: { type: 'array', items: { type: 'string' } },
            // 追加的 UI 字段名
            uiProps: { type: 'array', items: { type: 'string' } },
            // 追加的 UI 方法名
            uiMethods: { type: 'array', items: { type: 'string' } },
            // 追加的直接 UI 函数名
            uiCallees: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
      ],
    },
    create(context) {
      // Windows 下 getFilename 返回反斜杠路径，统一成正斜杠保证 includes 判断稳定
      const filename = context.getFilename().replace(/\\/g, '/');
      const basename = filename.split('/').pop() || '';
      const opts = context.options[0] || {};

      // 语言包里的中文是合法的：排除 locales/ 目录，以及 co-located 的 locales.ts 等文件
      const isLocaleFile =
        filename.includes('/locales/') || /^locales\.[cm]?[jt]sx?$/.test(basename);
      const allow = opts.allow || [];
      if (isLocaleFile || allow.some((seg) => filename.includes(seg))) {
        return {};
      }

      const UI_PROPS = new Set([...DEFAULT_UI_PROPS, ...(opts.uiProps || [])]);
      const UI_METHODS = new Set([
        ...DEFAULT_UI_METHODS,
        ...(opts.uiMethods || []),
      ]);
      const UI_CALLEES = new Set([
        ...DEFAULT_UI_CALLEES,
        ...(opts.uiCallees || []),
      ]);

      const CJK = /[一-龥]/;

      const report = (node, text) => {
        context.report({
          node,
          messageId: 'hardcoded',
          data: { text: text.slice(0, 20) },
        });
      };

      // 判断字符串是否处于「会渲染给用户」的上下文
      function isUIString(node) {
        // 1. JSX：title="删除"、{'删除'}、<div>你好</div>（JSXText 单独处理）
        let p = node.parent;
        while (p && p.type === 'JSXExpressionContainer') {
          p = p.parent;
        }
        if (
          p &&
          (p.type === 'JSXAttribute' ||
            p.type === 'JSXElement' ||
            p.type === 'JSXFragment')
        ) {
          return true;
        }

        // 2. 对象属性值：{ title: '删除', placeholder: '请输入' }
        if (p && p.type === 'Property' && p.value === node) {
          const key = p.key;
          const keyName = key && (key.name || key.value);
          if (typeof keyName === 'string' && UI_PROPS.has(keyName)) {
            return true;
          }
        }

        // 3. 函数调用参数：message.success('删除成功')、alert('x')
        if (
          p &&
          p.type === 'CallExpression' &&
          Array.isArray(p.arguments) &&
          p.arguments.includes(node)
        ) {
          const callee = p.callee;
          if (!callee) return false;
          if (callee.type === 'Identifier') {
            return UI_CALLEES.has(callee.name);
          }
          if (callee.type === 'MemberExpression') {
            const prop = callee.property;
            const methodName = prop && (prop.name || prop.value);
            return typeof methodName === 'string' && UI_METHODS.has(methodName);
          }
        }

        return false;
      }

      return {
        // 字符串字面量：'xxx'、"xxx"、JSX 属性 title="xxx"
        Literal(node) {
          if (typeof node.value !== 'string') return;
          if (CJK.test(node.value) && isUIString(node)) {
            report(node, node.value);
          }
        },
        // 模板字符串里的静态部分：`删除 ${name}`
        TemplateLiteral(node) {
          const text = node.quasis.map((q) => q.value.raw).join('');
          if (CJK.test(text) && isUIString(node)) {
            report(node, text);
          }
        },
        // JSX 标签之间的纯文本：<div>删除</div>，一定是 UI
        JSXText(node) {
          if (CJK.test(node.value)) {
            report(node, node.value);
          }
        },
      };
    },
  },
};
