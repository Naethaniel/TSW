const lista = [
    {no: 1, name: 'Wiga'},
    {no: 2, name: 'Paterna'},
    {no: 3, name: 'Etira'},
    {no: 4, name: 'Emandorissa'},
    {no: 5, name: 'Patria'},
    {no: 6, name: 'Galacja'},
    {no: 7, name: 'Paeksa'},
    {no: 8, name: 'Pilastra'},
    {no: 9, name: 'Elfira'},
    {no: 10, name: 'Fanabella'},
    {no: 11, name: 'Pustynna Noc'},
    {no: 12, name: 'Gratena'},
    {no: 13, name: 'Matahna'},
    {no: 14, name: 'Panetta'},
    {no: 15, name: 'Baklava'},
    {no: 16, name: 'Piera'},
    {no: 17, name: 'Wersa'},
    {no: 18, name: 'Atanda'},
    {no: 19, name: 'Escalada'},
    {no: 20, name: 'Faworyta'},
    {no: 21, name: 'Angelina'},
    {no: 22, name: 'Kalahari'},
    {no: 23, name: 'Godaiva'},
    {no: 24, name: 'Alamina'},
    {no: 25, name: 'Piacolla'},
    {no: 26, name: 'Wieża Bajek'}
];

document.addEventListener('readystatechange', event => {
    let previous;
    if (event.target.readyState === "interactive") {
        insertList();
        insertOutputField();
        insertListEvent();
        insertTabEvent();
        insertInputCheck();
        buttonSaveEvent();
    }

    function insertList() {
        let list = document.getElementById("lista");
        lista.forEach((elem) => {
            let entry = document.createElement("li");
            entry.appendChild(document.createTextNode(elem.name));
            list.appendChild(entry);
        });
    }

    function insertOutputField() {
        let div = document.getElementById("wyniki");
        let element = document.createElement("p");
        element.setAttribute("id", "output");
        element.appendChild(document.createTextNode("0.00"));
        div.appendChild(element);
    }

    function insertListEvent() {
        let previousBox;
        document.getElementById("lista").addEventListener("click", e => {
            if (e.target && e.target.nodeName === "LI") {
                //yellow background
                if (previous) previous.className = "";
                e.target.className = "yellow";
                previous = e.target;
                //append box before fields
                if (previousBox) previousBox.remove();
                let box = document.createElement("p");
                box.setAttribute("class", "blueBox");
                box.appendChild(document.createTextNode(e.target.innerHTML));
                previousBox = box;
                document.getElementById("zawodnik").prepend(box);
                //load from object

            }
        });
    }

    function insertTabEvent() {
        document.getElementById("wyniki").addEventListener("keydown", e => {
            if (e.target && e.keyCode === 9) {
                e.preventDefault();
                e.stopPropagation();
                if (e.shiftKey) {
                    let next = e.target.parentNode.previousElementSibling.getElementsByClassName(e.target.className);
                    if (next[0] !== undefined) {
                        next[0].focus();
                    }
                } else {
                    let next = e.target.parentNode.nextElementSibling.getElementsByClassName(e.target.className);
                    if (next[0] !== undefined) {
                        next[0].focus();
                    }
                }
            }
        });
    }

    function insertInputCheck() {
        let inputs = document.querySelectorAll("input");
        inputs.forEach((elem) => {
            elem.addEventListener("input", e => {
                let reg = new RegExp("[0-9]+");
                if (reg.test(e.target.value) === false) {
                    e.target.value = "";
                }
                if (e.target.value.length > 2) e.target.value = e.target.value.slice(0, 2);
            });
        });
    }

        function buttonSaveEvent(){
            let button = document.getElementById("guzik");
            button.addEventListener("click", e => {
                let inputs = document.querySelectorAll("input");
                }
            )
        }


});


