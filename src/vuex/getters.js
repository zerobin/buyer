/*
 * @Date: 2023-11-19 13:06:03
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-12 20:54:32
 */
const getters = {
  getCartList: (state) => state.cartList,
  cartNum: (state) => {
    let num = 0;
    state.cartList.forEach((element) => {
      num += element.quantity;
    });
    return num.toFixed(2);
  },
  priceTotal: (state) => {
    let total = 0;
    state.cartList.forEach((element) => {
      total += element.quantity * element.amount;
    });
    return total.toFixed(2);
  },
  checkedTotal: (state) => {
    let total = 0;
    state.cartList.forEach((element) => {
      if (element.checked) {
        total += element.quantity * element.amount;
      }
    });
    return total.toFixed(2);
  },
};
export default getters;
