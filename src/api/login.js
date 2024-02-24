import request, { Method, buyerUrl } from "@/plugins/request.js";

// 获取邮件验证码
export function emailCode(params) {
  console.log(params, "--");
  return request({
    url: "/public/emailCode",
    method: Method.GET,
    needToken: false,
    params,
  });
}

// 通过邮箱验证码，修改密码
export function updatePwd(params) {
  return request({
    url: "/public/updatePwd",
    method: Method.POST,
    needToken: false,
    data: params,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 注册
 */
export function regist(params) {
  return request({
    url: "/public/signUp",
    method: Method.POST,
    needToken: false,
    data: params,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 邮箱密码登录
 */
export function login(params) {
  return request({
    url: "/public/signIn",
    method: Method.POST,
    needToken: false,
    data: params,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 获取用户信息
 */
export function getMemberMsg(params) {
  return request({
    url: "/buyer/passport/member",
    method: Method.GET,
    needToken: true,
    params,
  });
}
