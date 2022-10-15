const config = {
    normal: { //普通管理员
        "/": { view: true, title: "首页" },
        "/adminuser": {
            view: false,
            add: false,
            update: false,
            del: false,
            title: "后端管理",
        },
        "/users": { view: true, title: "会员管理" },
        "/product": {
            view: true,
            add: false,
            update: false,
            del: false,
            title: "商品管理",
        },
        "/order": { view: true, update: true, title: "订单管理" },
    },
    admin: { //超级管理员
        "/": { view: true, title: "首页" },
        "/adminuser": {
            view: true,
            add: true,
            update: true,
            del: true,
            title: "后端管理",
        },
        "/users": { view: true },
        "/product": {
            view: true,
            add: true,
            update: true,
            del: true,
            title: "商品管理",
        },
        "/order": { view: true, update: true, title: "订单管理" },
    },
}

export default config
