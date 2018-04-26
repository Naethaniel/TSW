document.addEventListener('readystatechange', event => {
    if (event.target.readyState === "interactive") {
        initLoader();
        addListeners();
    }

    function initLoader() {
        let text = document.querySelectorAll(".bd");
        text.forEach((element) => {
            element.style.display = "none";
            element.visible = "hidden";
        })
    }

    function addListeners() {
        let headers = document.querySelectorAll(".hd");
        headers = Array.from(headers);
        headers.forEach(element => {
            element.addEventListener("click", event => {
                console.log(event);
                if (event.target.nextElementSibling.style.display === "block") {
                    event.target.nextElementSibling.style.display = "none";
                    event.target.nextElementSibling.visible = "hidden";
                } else {
                    event.target.nextElementSibling.style.display = "block";
                    event.target.nextElementSibling.visible = "visible";
                }
            });
            element.addEventListener("mouseover", event => {
                if (event.target.nextElementSibling.visible === "hidden") {
                    event.target.nextElementSibling.style.display = "block";
                }
            });
            element.addEventListener("mouseout", event => {
                if (event.target.nextElementSibling.visible === "hidden") {
                    event.target.nextElementSibling.style.display = "none";
                }
            });
        });
    }
});







