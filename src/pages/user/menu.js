//  * icon  图标
//  * title 一级菜单
//  * display 是否显示菜单
//  * menus 菜单栏
//  * path路径  router 配置的

// 订单中心
const order = [
  {
    icon: "",
    title: "Order Centre",
    menus: [
      {
        icon: "",
        title: "My Orders",
        path: "MyOrder",
      },
      {
        icon: "",
        title: "My Address",
        path: "MyAddress",
      },
      // {
      //   icon: "",
      //   title: "AfterSale",
      //   path: "AfterSale",
      // },
    ],
    display: true,
  },
];

// 会员中心
const member = [
  {
    icon: "",
    title: "Member Centre",
    menus: [
      {
        icon: "",
        title: "Profile",
        path: "Profile",
      },
      // {
      //   icon: "",
      //   title: "AccountSafe",
      //   path: "AccountSafe",
      // },
      // {
      //   icon: "",
      //   title: "Messages",
      //   path: "MsgList",
      // },
      // {
      //   icon: "",
      //   title: "MyTracks",
      //   path: "MyTracks",
      // },

      // {
      //   icon: "",
      //   title: "Favorites",
      //   path: "Favorites",
      // },
      // {
      //   icon: "",
      //   title: "Distribution",
      //   path: "Distribution",
      // },
      // {
      //   icon: "",
      //   title: "Comment",
      //   path: "CommentList",
      // },
      // {
      //   icon: "",
      //   title: "complain",
      //   path: "ComplainList",
      // },
      // {
      //   icon: "",
      //   title: "Point",
      //   path: "Point",
      // },
    ],
    display: true,
  },
];

// 账户中心
const user = [
  {
    icon: "",
    title: "Account Centre",
    menus: [
      {
        icon: "",
        title: "My Coupons",
        path: "Coupons",
      },
      {
        icon: "",
        title: "Funds management",
        path: "MoneyManagement",
      },
    ],
    display: true,
  },
];

// 活动中心
// const activity = [{
//   icon: '',
//   title: '活动中心',
//   menus: [
//     // {
//     //   icon: '',
//     //   title: '拍卖活动',
//     //   path: 'MyOrder',
//     // },
//     // {
//     //   icon: '',
//     //   title: '夺宝奇兵',
//     //   path: 'MyOrder',
//     // },
//   ],
//   display: true
// }]

// 批发中心
// const wholesale = [
//   {
//     icon: '',
//     title: '批发中心',
//     menus: [
//       {
//         icon: '',
//         title: '我的采购单',
//         path: 'MyOrder',
//       },
//       {
//         icon: '',
//         title: '采购退货单',
//         path: 'MyOrder',
//       },
//       {
//         icon: '',
//         title: '我的求购单',
//         path: 'MyOrder',
//       },
//
//     ],
//     display: true
//   }
// ]

// 店铺
// const shop = [
//   {
//     icon: '',
//     title: '店铺管理',
//     menus: [
//       {
//         icon: '',
//         title: '店铺后台',
//         path: 'MyOrder',
//       },
//       {
//         icon: '',
//         title: '商家等级',
//         path: 'MyOrder',
//       },
//     ],
//     display: true
//   }
// ]
// wholesale[0], shop[0]
let menuList = [];
menuList.push(order[0]);

export default menuList;
