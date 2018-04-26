const newGame = (req, res) => {
    let size = req.body.size;
    let dim = req.body.dim;
    let max = req.body.max;

  if (dim === undefined) dim = 9;
    if (size === undefined) size = 5;
    if (max === undefined) max = 0;

    let game = {
        size,
        dim,
        max,
        answer: []
    };
    for (let i = 0; i < size; i++) {
        game.answer[i] = Math.floor(Math.random() * (dim - 1) + 1);
    }
    req.session.game = game;
    res.send(game);
};

const markAnswer = (req, res) => {
  let game = req.session.game;
  let move = req.body.move;
  if (game !== undefined || move !== undefined) {
    if (game.answer.length !== move.length) {
      res.send("Move must have the same length");
    } else {
      let code = game.answer;
      let mark = {
        black: 0,
        white: 0
      };
      //black
      let kodCopy = [...code];
      kodCopy.forEach((item, index) => {
        if (req.body.move[index] === item) {
          mark.black++;
          delete kodCopy[index];
          delete move[index];
        }
      });

      //white
      let moveCode = {};
      let codeCode = {};

      kodCopy.forEach((item) => {
        if (codeCode[item]) {
          codeCode[item]++;
        }
        else {
          codeCode[item] = 1;
        }
      });

      move.forEach((item) => {
        if (moveCode[item]) {
          moveCode[item]++;
        }
        else {
          moveCode[item] = 1;
        }
      });

      Object.keys(codeCode).forEach((element) => {
        if (moveCode[element]) {
          if (moveCode[element] >= element) {
            mark.white += codeCode[element];
          }
          else {
            mark.white += moveCode[element];
          }
        }
      });
      console.log(mark);
      res.send(mark);
    }
  }
};

module.exports = {
    newGame,
    markAnswer
};