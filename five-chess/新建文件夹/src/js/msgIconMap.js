// 两个棋盘相同的提示
const msgIconMap = {
  OVERBUTSTEP: { type: 'alert', msg: '此局已经结束，请重置棋盘' },
  SAMEPOSITION: { type: 'alert', msg: '不能下重复位置哦' },
  OVERBUTRETRACT: { type: 'confirm', msg: '' }
};

export default msgIconMap;
