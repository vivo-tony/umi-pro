module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  plugins: ['local-rules'],
  rules: {
    // 提交时强拦硬编码中文，src/locales 下的语言包放行
    'local-rules/no-hardcoded-chinese': ['error', { allow: ['src/locales'] }],
  },
};
