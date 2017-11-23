import DomChess from './DomChess';
import CanvasChess from './CanvasChess';


export default class GameManager {
  constructor({
    type = 'Canvas',
    model = 'Peo_Com'
  }) {
    this.type = type; // Canvas or Dom 模式
    this.model = model;
    this.record = []; // 记录
    // 按钮
    this.restartBtn = document.querySelector('.restart');
    this.retractBtn = document.querySelector('.retract');
    this.unRetractBtn = document.querySelector('.unRetract');
    this.changeModelBtn = document.querySelector('.changeModel');
  }

  initGame() {
    if (this.type === 'Canvas') {
      this.$container = document.getElementById('chess-container-canvas');
      document.getElementById('chess-container-canvas').style.display = 'block';
      document.getElementById('chess-container-dom').style.display = 'none';
    } else {
      this.$container = document.getElementById('chess-container-dom');
      document.getElementById('chess-container-dom').style.display = 'block';
      document.getElementById('chess-container-canvas').style.display = 'none';
    }
    this.$chess = this.type === 'Canvas' ? new CanvasChess({}) : new DomChess({});
    // 绘制棋盘
    this.$chess.initChessArea();
    this.eventBind();
  }

  // 按键事件
  eventBind() {
    // 重置棋盘
    this.restartBtn.onclick = (event) => {
      this.$chess.restart();
    };
    // 悔棋
    this.retractBtn.onclick = (event) => {
      this.$chess.retractChess();
    };
    // 撤销悔棋
    this.unRetractBtn.onclick = (event) => {
      this.$chess.unRetract();
    };
    // 切换模式
    this.changeModelBtn.onclick = (event) => {
      this.type = this.type === 'Canvas' ? 'Dom' : 'Canvas';
      this.initGame();
    };
  }
}
