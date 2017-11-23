// Load application styleSheets
import 'notyf/dist/notyf.min.css';
import '../assets/styles/index.scss';
import GameManager from './gameManager';

let gameManager = null;
if (document.getElementById('chess-container-canvas').getContext) {
  gameManager = new GameManager({ type: 'Canvas', model: 'Peo_Peo' });
} else {
  gameManager = new GameManager({ type: 'Dom', model: 'Peo_Peo' });
}

gameManager.initGame();
