$(() => {
    let previous;
    //pojedyncze klikniecie na komorke podswiela na zolto
    $('tr').on("click", function () {
        if (previous) {
            $(previous).removeClass("yellow");
            $(this).addClass("yellow");
            previous = $(this);
        }
        else {
            $(this).addClass("yellow");
            previous = $(this);
        }
    });
    //podwojne klikniecie na komorke daje pole textowe do zmiany
    $("td").dblclick(function () {
        $(this).replaceWith(`<input type ="text" value="${$(this).text()}">`)
    });
    $("input").keypress(function (e) {
        console.log(e);
        if (e.key === "Enter") {
            console.log("enter");
        }
        else {
            console.log("heh");
        }
    });
});




//zaznaczajac potem uzywajac strzalek mozna zmieniac pozycje wiersza