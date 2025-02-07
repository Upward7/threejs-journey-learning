const path = require('path');
module.exports = {
    output: {
        publicPath: "/threejs-outcomes/", // 自己GitHub上的仓库名称
        path: path.resolve("./docs"),
        clean: true
    }
}