/*
  ** CommonChess canvas和dom版本相同的部分，如渲染结果列表，判断赢法等
 */
export default class CommonChess {
  constructor({
    rowNum = 15, // 一行棋数
    colNum = 15, // 一列棋数
    winCount = 5
  }) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.winnerDom = document.getElementById('winner');
    this.recordDom = document.getElementById('record');

    this.record = []; // 二维数组，免遍历 this.record[1][5] = 0,代表黑棋置棋于第一行第五列
    this.history = []; // 历史记录 
    this.step = 0; // 现在步数
    this.winCount = winCount; // 五子棋，六子棋，N子棋
    this.winner = null; // 赢家
    this.isRetracting = false; // 是否在悔棋状态
    this.retractHistory = []; // 记录悔棋步骤
  }

  // 生成用于游戏结果记录的二位数组
  generateRecord() {
    for (let i = 0; i < this.colNum; i += 1) {
      this.record[i] = [];
      for (let j = 0; j < this.rowNum; j += 1) {
        this.record[i][j] = 'empty';
      }
    }
  }

  // 增加记录
  addHistory(row, col) {
    this.record[row - 1][col - 1] = this.getRight();
    this.history.push({
      row,
      col,
      right: this.getRight()
    });
    this.renderHistoryPanel();
  }

  // 渲染记录面板
  renderHistoryPanel() {
    let historyStr = '';
    this.history.forEach((elem, index, arr) => {
      historyStr += `<li>${index} : ${elem.right === 0 ? '黑棋' : '白棋'} 落子 ${elem.row} ${elem.col}</li>`;
    });
    this.recordDom.innerHTML = historyStr;
  }

  // 重置棋盘
  restart() {
    this.record = [];
    this.step = 0;
    this.winner = null;
    this.history = [];
    this.initChessArea();
  }

  // 游戏结束，赛果通知
  resultNotice() {
    function removeClass(obj, cls) {
      const _obj = obj;
      if (new RegExp(cls).test(_obj.className)) {
        const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
        const _className = _obj.className.replace(reg, ' ');
        _obj.className = _className;
      }
    }

    const msg = this.getRight() === 0 ? '黑棋胜' : '白棋胜';
    this.winner = this.getRight();
    // 简易动画
    document.querySelector('.notice-panel .notice-bg').className += ' show';
    setTimeout(() => {
      removeClass(document.querySelector('.notice-panel .notice-bg'), 'show');
    }, 1000);
    alert(msg);
  }

  // 看是哪方下手
  getRight() {
    return this.step % 2 === 0 ? 0 : 1;
  }

  toastConfirm(msg) {
    notyf.confirm(msg);
  }

  toastAlert(msg) {
    notyf.alert(msg);
  }

  // 判断横向 （行不变，列变化）
  _judgeByHorizontal(row, col) {
    let count = 1; // 计数器
    const right = this.record[row - 1][col - 1]; // 当前这个点是黑还是白
    // 下方
    for (let i = col; i <= this.colNum; i += 1) {
      if (this.record[row - 1][i] === right) {
        count += 1;
      } else {
        break;
      }
    }
    // 上方
    for (let i = col - 2; i >= 0; i -= 1) {
      if (this.record[row - 1][i] === right) {
        count += 1;
      } else {
        break;
      }
    }
    if (count >= 5) {
      console.log('%c 横向赢了', 'color: red');
    }
    return count;
  }

  // 判断纵向 （行变化，列不变）
  _judgeByVertical(row, col) {
    let count = 1;
    const right = this.record[row - 1][col - 1];
    // 上方
    for (let i = row - 1; i > 0; i -= 1) {
      if (this.record[i - 1][col - 1] === right) {
        count += 1;
      } else {
        break;
      }
    }
    // 下方
    for (let i = row + 1; i <= this.rowNum; i += 1) {
      if (this.record[i - 1][col - 1] === right) {
        count += 1;
      } else {
        break;
      }
    }
    if (count >= 5) {
      console.log('%c 纵向赢了', 'color: red');
    }
    return count;
  }

  // 反斜线\判断
  _judgeBybacklash(row, col) {
    let count = 1;
    const right = this.record[row - 1][col - 1];
    // 如果位于左下方，右上方边缘位置，反斜线赢法是不存在的
    if (Math.abs(row - col) > this.rowNum + 1 - this.winCount) {
      return 0;
    }
    // 反斜线上方
    for (let x = row - 1, y = col - 1; x > 0 && y > 0; y, x -= 1) {
      if (this.record[x - 1][y - 1] === right) {
        count += 1;
      } else {
        break;
      }
      y -= 1;
    }
    // 反斜线下方
    for (let x = row + 1, y = col + 1; x <= 15 && y <= 15; x += 1) {
      if (this.record[x - 1][y - 1] === right) {
        count += 1;
      } else {
        break;
      }
      y += 1;
    }
    if (count >= 5) {
      console.log('%c 反斜线赢了', 'color: red');
    }
    return count;
  }

  // 正斜线判断
  _judgeBySlash(row, col) {
    let count = 1;
    const right = this.record[row - 1][col - 1];
    // 如果位于左上方，右下方边缘位置，正斜线赢法是不存在的
    if ((row + col < this.winCount + 1) || ((row > 15 + 1 - this.winCount) && (col > 15 + 1 - this.winCount))) {
      return 0;
    }
    // 正斜线上方
    for (let x = row - 1, y = col + 1; x > 0 && y <= 15; x -= 1) {
      if (this.record[x - 1][y - 1] === right) {
        count += 1;
      } else {
        break;
      }
      y += 1;
    }
    // 正斜线下方
    for (let x = row + 1, y = col - 1; x <= 15 && y > 0; x += 1) {
      if (this.record[x - 1][y - 1] === right) {
        count += 1;
      } else {
        break;
      }
      y -= 1;
    }
    if (count >= 5) {
      console.log('%c 正斜线赢了', 'color: red');
    }
    return count;
  }

  // 判断输赢（根据当前下的这一手判断）
  judgeWinner(row, col) {
    // 所有判断集中
    if (this._judgeByVertical(row, col) >= 5 ||
        this._judgeByHorizontal(row, col) >= 5 ||
        this._judgeBybacklash(row, col) >= 5 ||
        this._judgeBySlash(row, col) >= 5) {
      return true;
    }
    return false;
  }
}
