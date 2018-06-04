//TODO: SAVE ACTUAL STATUS OF THE GAME TO THE SESSION
$(() => {
  let size;
  let max;
  //0 -> unlimited
  let counter = 0;
  let move = [];
  const sendPlay = (size, dim, max) => {
        $.ajax({
            url: "/play",
            type: "POST",
            data: JSON.stringify({size, dim, max}),
            contentType: "application/json",
          complete: handleGameResponse
        });
    };

  const sendMark = (move) => {
    $.ajax({
      url: "/mark",
      type: "POST",
      data: JSON.stringify({move}),
      contentType: "application/json",
      complete: handleMarkResponse
    });
  };

  const handleGameResponse = (json) => {
        if (json.status === 200) {
          //remove elements
          $('label').remove();
          $('input').remove();
          $('button').remove();
          $('br').remove();

          //show history div
          $('p').show();

          console.log(json.responseText);
          $("body").append(`<div id="inputs"></div>`);
          size = json.responseJSON.size;
          max = json.responseJSON.max;
            for (let i = 0; i < size; i++) {
              $("#inputs").append(`<input type="text" id="${i}"/>`);
            }
            $("#inputs").append(`<br/>`);
          $("body").append(`<button id="mark" type="button">Oceń</button>`);

          $("body #mark").on("click", () => {

            for (let i = 0; i < size; i++) {
              move.push($(`#${i}`).val());
            }

            if(max === 0){
              counter = 9999;
            }

            if(parseInt(counter) === parseInt(max)){
              $('body').text('Przekroczono maksymalna ilosc ruchow. Koniec gry');
            }else{
              counter++;
              sendMark(move);
            }
          });
        }
    };

  const handleMarkResponse = (json) => {
    let answer = json.responseJSON;

    //remove inputs
    $('input').remove();

    if (json.status === 200) {
      $('div#moveHistory').append(`<p>Ruch: ${move}</p>`);
      move = [];
      $("div#moveHistory").append(`<p>Wynik: Białe:${answer.white} Czarne:${answer.black}</p>`);
      $('p').show();

      if (answer.white === size) {
        $('button').remove();
        $("body").append(`<p>Koniec gry. Wygrałeś</p>`);
      } else {
        $("body").append(`</br>`);
        for (let i = 0; i < size; i++) {
          $("#inputs").append(`<input type="text" id="${i}"/>`);
        }
      }
    }
  };

  $("body #send").on("click", () => {
    sendPlay($("#size").val(), $("#dim").val(), $("#max").val());
    });

});
