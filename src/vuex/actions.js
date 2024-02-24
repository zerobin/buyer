/*
 * @Date: 2023-11-19 13:06:03
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-18 07:16:51
 */

// 购物车添加商品
export const ADD_PRODUCT = ({ commit, state }, data) => {
  let list = state.cartList;
  let index = list.findIndex((item) => {
    return item.goodsId === data.goodsId && item.skuId === data.skuId;
  });
  if (index > -1) {
    list[index].quantity = +list[index].quantity + +data.quantity;
    list[index].amount = +list[index].amount + +data.amount;
  } else {
    list.push(data);
  }
  commit("SET_CARTLIST", list);
};
// 删除指定goodsid和skuid商品
export const DELETE_PRODUCT = ({ commit, state }, { goodsId, skuId }) => {
  let list = state.cartList;
  let index = list.findIndex((item) => {
    return item.goodsId === goodsId && item.skuId === skuId;
  });
  if (index > -1) {
    list.splice(index, 1);
  }
  console.log(list, "===");
  commit("SET_CARTLIST", list);
};
// 清空购物车
export const DELETE_ALL_PRODUCT = ({ commit, state }) => {
  commit("SET_CARTLIST", []);
};

// 更新指定goodsid 和skuid 商品
export const UPDATE_CARTLIST_CHECKED = (
  { commit, state },
  { data, type = "single", status = true }
) => {
  let list = state.cartList;
  if (type === "single") {
    let index = list.findIndex((item) => {
      return item.goodsId === data.goodsId && item.skuId === data.skuId;
    });
    if (index > -1) {
      list[index].checked = status;
    }
  } else {
    list.forEach((item) => {
      item.checked = status;
    });
  }
  commit("SET_CARTLIST", list);
};

export const UPDATE_PRODUCT = ({ commit, state }, data) => {
  let list = state.cartList;
  let index = list.findIndex((item) => {
    return +item.goodsId === +data.goodsId && +item.skuId === +data.skuId;
  });
  debugger;
  if (index > -1) {
    list[index] = Object.assign(list[index], data);
  }
  commit("SET_CARTLIST", list);
};
