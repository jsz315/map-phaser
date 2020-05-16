var sudo = {
    data: [],
    mark: [],
    count: 0
};

//随机生成数独
var generate = function () {
    var arr = [];
    var i, j;
    for (i = 0; i < 9; i++) {
        arr[i] = [];
        for (j = 0; j < 9; j++) {
            arr[i][j] = 0;
        }
    }
    var res = fill(arr);
    var seed = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // var seed = 'ABCDEFGHI'.split('');
    seed.sort(function () {
        return 0.5 - Math.random()
    });
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            if (Math.random() > 1) {
                res.data[i][j] = '';
            } else {
                res.data[i][j] = seed[res.data[i][j] - 1];
            }
        }
    }
    return res.data;
}

//填充数独
var fill = function (arr) {
    arr = arr || generate();
    getSudo(arr);

    var count = 0; //填充次数
    var back = 0; //回溯次数
    var pos = sudo.mark[0][0] ? next(0, 0) : {
        x: 0,
        y: 0
    }; //数独遍历起始位置
    var num = false; //可填充数字
    while (pos) {
        count++; //计数
        num = numFill(pos.x, pos.y);
        if (!num) {
            back++;
            sudo.data[pos.x][pos.y] = 0;
            pos = prev(pos.x, pos.y);
        } else {
            sudo.data[pos.x][pos.y] = num;
            pos = next(pos.x, pos.y);
        }
    }
    sudo.count = count;
    console.log(count, back);
    return sudo;
};

//获取数独状态
var getSudo = function (arr) {
    for (var i = 0; i < 9; i++) {
        sudo.data[i] = [];
        sudo.mark[i] = [];
        for (var j = 0; j < 9; j++) {
            if (arr[i][j] > 0) {
                sudo.data[i][j] = arr[i][j];
                sudo.mark[i][j] = true;
            } else {
                sudo.data[i][j] = 0;
                sudo.mark[i][j] = false;
            }
        }
    }
};

//下一个空格位置
var next = function (x, y) {
    var i, j;
    for (j = y + 1; j < 9; j++) {
        if (!sudo.mark[x][j]) {
            return {
                x: x,
                y: j
            };
        }
    }
    for (i = x + 1; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            if (!sudo.mark[i][j]) {
                return {
                    x: i,
                    y: j
                };
            }
        }
    }
};

//回溯上一个空格位置
var prev = function (x, y) {
    var i, j;
    for (j = y - 1; j >= 0; j--) {
        if (!sudo.mark[x][j]) {
            return {
                x: x,
                y: j
            };
        }
    }
    for (i = x - 1; i >= 0; i--) {
        for (j = 8; j >= 0; j--) {
            if (!sudo.mark[i][j]) {
                return {
                    x: i,
                    y: j
                };
            }
        }
    }
};

//返回该位置可填的下一个数字
var numFill = function (x, y) {
    var arrNo = numValidNo(x, y) || [];
    for (var i = sudo.data[x][y] + 1; i <= 9; i++) {
        if (arrNo.indexOf(i) < 0) {
            return i;
        }
    }
    return false;
};

//返回一个数组，包含该位置所有已使用数字
var numValidNo = function (x, y) {
    var arrNo = [];
    var i, j;
    for (i = 0; i < 9; i++) {
        //获取元素所在行已填数字
        if (arrNo.indexOf(sudo.data[x][i]) < 0 && i !== y) {
            arrNo.push(sudo.data[x][i]);
        }
        //获取元素所在列已填数字
        if (arrNo.indexOf(sudo.data[i][y]) < 0 && i !== x) {
            arrNo.push(sudo.data[i][y]);
        }
    }
    //获取元素所在块已填数字
    for (i = parseInt(x / 3) * 3; i < parseInt(x / 3) * 3 + 3; i++) {
        for (j = parseInt(y / 3) * 3; j < parseInt(y / 3) * 3 + 3; j++) {
            if (arrNo.indexOf(sudo.data[i][j]) < 0 && i !== x && j !== y) {
                arrNo.push(sudo.data[i][j]);
            }
        }
    }
    return arrNo;
};


export default {
    generate: generate,
    fill: fill
}