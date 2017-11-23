import Notyf from 'notyf';
import CommonChess from './CommonChess';

const notyf = new Notyf();

export default class CanvasChess extends CommonChess {
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
    this.chessArea = document.getElementById('chess-container-canvas');
    this.context = null;

    this.winnerDom = document.getElementById('winner');
    this.recordDom = document.getElementById('record');
  }

  initChessArea() {
    this.chessArea.style.display = 'block';
    this.context = this.chessArea.getContext('2d');
    this.context.fillStyle = '#fff';
    this.context.strokeStyle = '#efefef';
    this.context.clearRect(0, 0, 450, 450);
    this.context.beginPath();
    this.context.fillRect(0, 0, 450, 450);
    for (let i = 0; i < this.rowNum; i += 1) {
      // 竖线
      this.context.moveTo(15 + (i * 30), 15);
      this.context.lineTo(15 + (i * 30), 435);
      this.context.stroke();
    }
    for (let i = 0; i < this.colNum; i += 1) {
      // 横线
      this.context.moveTo(15, 15 + (i * 30));
      this.context.lineTo(435, 15 + (i * 30));
      this.context.stroke();
    }
    this.generateRecord();
    this.initChess();
  }

  initChess() {
    this.chessArea.onclick = (event) => {
      // 棋盘结束
      if (this.winner !== null) {
        notyf.alert('此局已经结束，请重置棋盘');
        return;
      }
      const positonRow = Math.floor((event.offsetX / 30) + 1);
      const positonCol = Math.floor((event.offsetY / 30) + 1);
      if (this.record[positonRow - 1][positonCol - 1] !== 'empty') {
        notyf.alert('不能下重复位置哦');
        return;
      }
      this.renderChessStep(positonRow, positonCol, this.getRight());
      // 记录
      this.addHistory(positonRow, positonCol);
      // 因为可能是悔棋状态后落子，所以需要取消悔棋状态，并且清空悔棋记录
      this.isRetracting = false;
      this.retractHistory = [];
      if (this.judgeWinner(+positonRow, +positonCol)) {
        this.resultNotice();
      }
      this.step += 1;
    };
  }

  // 落子渲染
  renderChessStep(row, col, right) {
    this.context.beginPath();
    this.context.arc(15 + ((row - 1) * 30), 15 + ((col - 1) * 30), 12, 0, 2 * Math.PI);
    const color = right === 0 ? '#000' : '#D1D1D1';
    this.context.fillStyle = color;
    this.context.fill();
    this.context.closePath();
  }

  // 清除落子渲染（悔棋渲染）
  renderCleanChessStep(row, col, right) {
    // 清除画布
    this.context.clearRect((row - 1) * 30, (col - 1) * 30, 30, 30);
    // 重建画布
    this.context.fillStyle = '#fff';
    this.context.strokeStyle = '#efefef';
    this.context.fillRect((row - 1) * 30, (col - 1) * 30, 30, 30);
    // 竖
    this.context.beginPath();
    this.context.moveTo(((row - 1) * 30) + 15, (col - 1) * 30);
    this.context.lineTo((row - 1) * 30 + 15, ((col - 1) * 30) + 30);
    // 横
    this.context.moveTo((row - 1) * 30, ((col - 1) * 30) + 15);
    this.context.lineTo(((row - 1) * 30) + 30, ((col - 1) * 30) + 15);
    this.context.strokeStyle = '#efefef';
    this.context.stroke();
    this.context.closePath();
  }

  // 悔棋
  retractChess() {
    if (this.winner === null && this.history.length) {
      const { row, col, right } = this.history[this.history.length - 1];
      this.renderCleanChessStep(row, col, right);
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
      this.renderChessStep(row, col, right);
      this.step += 1;
      this.renderHistoryPanel();
    }
  }
}
