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
  let loginState = null;
  try {
    loginState = await auth.getLoginState();
  } catch (error: any) {
    // @cloudbase/js-sdk 存在一个已知的 bug：当未登录（本地无 credentials）时，
    // 获取登录状态会抛出 "Cannot read properties of null (reading 'scope')" 的错误。
    // 如果是这个错误，说明用户当前未登录，我们捕获它并继续执行后续的匿名登录。
    if (error && error.message && error.message.includes('scope')) {
      console.warn('捕获到 SDK 登录状态 scope 报错，这通常意味着当前未登录。');
      loginState = null;
    } else {
      throw error; // 如果是其他未知错误，继续抛出
    }
  }

  if (!loginState) {
    try {
      await auth.anonymousAuthProvider().signIn();
      console.log('已匿名登录腾讯云开发');
    } catch (signInErr) {
      console.error('匿名登录失败，请检查云开发控制台是否开启了“匿名登录”：', signInErr);
      throw signInErr;
    }
  }
};
