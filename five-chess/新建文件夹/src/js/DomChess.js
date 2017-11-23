import Notyf from 'notyf';
import CommonChess from './CommonChess';
import msgIconMap from './msgIconMap';

const notyf = new Notyf();

export default class DomChess extends CommonChess {
  constructor({
    rowNum = 15, // 一行棋数
    colNum = 15, // 一列棋数
    winCount = 5
  }) {
    super({
      rowNum,
      colNum,
      winCount
    });

    this.chessArea = document.getElementById('virtual-chess-con');
    this.realChessArea = document.getElementById('real-chess-con');
  }

  // 渲染棋盘
  initChessArea() {
    const { rowNum, colNum } = this;
    this.chessArea.innerHTML = '';
    this.chessArea.style.width = `${(colNum - 1) * 30}px`;
    this.chessArea.style.height = `${(rowNum - 1) * 30}px`;
    for (let i = 0; i < colNum - 1; i += 1) {
      const isFirstRow = i === 0 ? 'firstRow' : '';
      for (let j = 0; j < rowNum - 1; j += 1) {
        const isFirstCol = j === 0 ? 'firstCol' : '';
        const child = document.createElement('div');
        child.setAttribute('class', `child-con ${isFirstRow} ${isFirstCol}`);
        this.chessArea.append(child);
      }
    }
    this.initChess();
    this.generateRecord();
  }

  // 绘制所有隐藏棋子
  initChess() {
    const { rowNum, colNum } = this;
    this.realChessArea.innerHTML = '';
    this.realChessArea.style.width = `${(colNum - 1) * 30 + 14 * 2}px`;
    this.realChessArea.style.height = `${(rowNum - 1) * 30 + 14 * 2}px`;
    for (let i = 0; i <= colNum - 1; i += 1) {
      for (let j = 0; j <= rowNum - 1; j += 1) {
        const child = document.createElement('div');
        child.setAttribute('class', `real-chess real-chess-${i + 1}-${j + 1}`);
        child.setAttribute('rowNum', i + 1);
        child.setAttribute('colNum', j + 1);
        this.realChessArea.appendChild(child);
        child.onclick = (event) => {
          // 棋盘结束
          if (this.winner !== null) {
            notyf[msgIconMap.OVERBUTSTEP.type](msgIconMap.OVERBUTSTEP.msg);
            return;
          }
          const positonRow = event.target.getAttribute('rowNum');
          const positonCol = event.target.getAttribute('colNum');
          // 重复位置
          if (this.record[positonRow - 1][positonCol - 1] !== 'empty') {
            notyf[msgIconMap.SAMEPOSITION.type](msgIconMap.SAMEPOSITION.msg);
            return;
          }
          // 落子显示
          this.renderChessStep(positonRow, positonCol, this.getRight());
          // 记录
          this.addHistory(positonRow, positonCol);
          // 因为可能是悔棋状态后落子，所以需要取消悔棋状态，并且清空悔棋记录
          this.isRetracting = false;
          this.retractHistory = [];
          // 判断是否存在五连线
          if (this.judgeWinner(+positonRow, +positonCol)) {
            this.resultNotice();
          }
          this.step += 1;
        };
      }
    }
  }

  // 落子渲染
  renderChessStep(row, col, right) {
    const domName = `real-chess-${row}-${col}`;
    const className = right === 0 ? ' show-black' : ' show-white';
    document.getElementsByClassName(domName)[0].className += className;
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

  // 悔棋
  retractChess() {
    function removeClass(obj, cls) {
      const _obj = obj;
      if (new RegExp(cls).test(_obj.className)) {
        const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
        const _className = _obj.className.replace(reg, ' ');
        _obj.className = _className;
      }
    }

    if (this.winner === null && this.history.length) {
      const { row, col, right } = this.history[this.history.length - 1];
      const prevRealChessDom = document.querySelector(`.real-chess-${row}-${col}`);
      const needRemoveClass = right === 0 ? 'show-black' : 'show-white';
      removeClass(prevRealChessDom, needRemoveClass);
      this.record[row - 1][col - 1] = 'empty';
      this.step -= 1;
      this.isRetracting = true;
      this.retractHistory.push(this.history.pop());
      this.renderHistoryPanel();
    } else if (this.winner !== null) {
      notyf.confirm('都结束了，你才来悔棋？开始下一局吧~');
    } else {
      notyf.alert('都还没开始下，怎么悔棋呢？');
    }
  }

  // 撤销悔棋
  unRetract() {
    if (this.isRetracting && this.retractHistory.length) {
      this.history.push(this.retractHistory.pop());
      const { row, col, right } = this.history[this.history.length - 1];
      console.log('撤销悔棋', row, col, right);
      const domName = `real-chess-${row}-${col}`;
      const className = right === 0 ? ' show-black' : ' show-white';
      document.getElementsByClassName(domName)[0].className += className;
    }
  }
}
