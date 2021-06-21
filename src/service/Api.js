/*
 * @author: zhujunjie
 * @email: 1121883342@qq.com
 * @explain: api服务基础信息管理
 * @date: 2021/04/25 15:09
 */

import axios from 'axios';

axios.defaults.baseURL = window.apiConfig.API_BASE_URL;
axios.defaults.timeout = window.apiConfig.API_REQUEST_TIMEOUT;
