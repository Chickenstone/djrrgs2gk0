import cloudbase from '@cloudbase/js-sdk';

// 这里需要替换为您在腾讯云开发控制台创建的真实环境 ID (env-id)
const ENV_ID = import.meta.env.VITE_CLOUDBASE_ENV_ID || 'your-env-id';

// 初始化 CloudBase
export const app = cloudbase.init({
  env: ENV_ID
});

// 导出常用的服务实例
export const auth = app.auth({
  persistence: 'local'
});

export const db = app.database();

// 辅助函数：匿名登录（用于游客浏览）
export const signInAnonymously = async () => {
  const loginState = await auth.getLoginState();
  if (!loginState) {
    await auth.anonymousAuthProvider().signIn();
    console.log('已匿名登录腾讯云开发');
  }
};
