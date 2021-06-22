/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: mobxstore信息统一导出出口
 * @date: 2021/04/25 15:12
 */
import UserLoginStore from './userstore/user';
import GroupStore from './groupstore/group';

const userLoginStore = new UserLoginStore();
const groupStore = new GroupStore();

const stores = {
  userLoginStore,
  groupStore,
};

export { stores };
