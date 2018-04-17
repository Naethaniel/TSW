$(() => {
    let previous;
    let flag = false;
    //pojedyncze klikniecie na komorke podswiela na zolto
    $('tbody tr').on("click", function () {
        if (previous) {
            $(previous).removeClass("yellow");
            $(this).addClass("yellow");
            previous = $(this);
            flag = true;
        }
        else {
            $(this).addClass("yellow");
            previous = $(this);
            flag = true;
        }
    });
//zaznaczajac potem uzywajac strzalek mozna zmieniac pozycje wiersza
    $('body').keydown(function (e) {
        if (e.which === 38 && flag) {
            $(previous).after($(previous).prev());
        }
        else if (e.which === 40 && previous) {
            $(previous).before($(previous).next());
        }
    });

    //podwojne klikniecie na komorke daje pole textowe do zmiany
    //po enterze zapisuje zmiane w tabeli
    $("tr td").keypress(function (e) {
        if (e.key === "Enter") {
            let text = this.childNodes[0].value;
            $(this).text("");
            $(this).append(`${text}`);
        }
    }).on("dblclick", function () {
        let temp = $(this).text();
        $(this).text("");
        $(this).append(`<input type ="text" value="${temp}">`);
    });
});

