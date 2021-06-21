/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: mobxstore信息统一导出出口
 * @date: 2021/04/25 15:12
 */
import UserLoginStore from './userstore/user';

const userLoginStore = new UserLoginStore();

const stores = {
  userLoginStore,
};

export { stores };
