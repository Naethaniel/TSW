//jshint node: true, esversion: 6
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

    req.session = game;
    res.send(`Sucessfully created new game with parameters: size: ${size} dim: ${dim} max: ${max} answer: ${game.answer}`);
};

const markAnswer = (req, res) => {
    if (req.session.game.answer.length !== req.body.move.length) {
        res.send("Move must have the same length");
    }
    let move = req.body.move;
    let code = req.session.game.answer;
    let response = {
        black: 0,
        white: 0
    };
    //czarne
    let kodCopy = [...code];
    kodCopy.forEach((item, index) => {
        if (req.body.move[index] === item) {
            response.black++;
            delete kodCopy[index];
            delete move[index];
        }
    });

    //biale
    let kruch = {};
    let kkod = {};

    kodCopy.forEach((item) => {
        if (kkod[item]) {
            kkod[item]++;
        }
        else {
            kkod[item] = 1;
        }
    });

    move.forEach((item) => {
        if (kruch[item]) {
            kruch[item]++;
        }
        else {
            kruch[item] = 1;
        }
    });

    Object.keys(kkod).forEach((element) => {
        if (kruch[element]) {
            if (kruch[element] >= element) {
                response.white += kkod[element];
            }
            else {
                response.white += kruch[element];
            }
        }
    });

    res.send(response.biale);
};

module.exports = {
    newGame,
    markAnswer
};