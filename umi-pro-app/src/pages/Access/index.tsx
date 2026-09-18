import { PageContainer } from '@ant-design/pro-components';
import { Access, getLocale, setLocale, useAccess } from '@umijs/max';
import { Button } from 'antd';
import { useLazyMessages } from '@/hooks/useLazyMessages';
import { useTypedIntl } from '@/i18n/useTypedIntl';

const loadAccessMessages = () => import('./locales');

const AccessPage: React.FC = () => {
  const access = useAccess();
  const intl = useTypedIntl();
  const loaded = useLazyMessages('access', loadAccessMessages);

  const isZh = getLocale().startsWith('zh');
  // realReload 传 false，语言切换不整页刷新，靠 LANG_CHANGE_EVENT 触发重渲染
  const switchLocale = () => setLocale(isZh ? 'en-US' : 'zh-CN', false);
  // 语言名用母语展示是 i18n 惯例，不随语言翻译（非 UI 上下文，规则不会误报）
  const switchLabel = isZh ? 'English' : '中文';

  return (
    <PageContainer
      ghost
      header={{
        title: loaded ? intl.formatMessage({ id: 'access.title' }) : '…',
        extra: (
          <Button onClick={switchLocale}>{switchLabel}</Button>
        ),
      }}
    >
      <Access accessible={access.canSeeAdmin}>
        <Button>
          {loaded ? intl.formatMessage({ id: 'access.onlyAdmin' }) : '…'}
        </Button>
        <div>
          {intl.formatMessage({ id: 'access.onlyAdmin' })}
        </div>
      </Access>
    </PageContainer>
  );
};

export default AccessPage;
