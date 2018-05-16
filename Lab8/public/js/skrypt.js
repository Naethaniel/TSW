/*jshint jquery: true, devel: true */
$(() => {

    const sendRequest = (size, dim, max) => {
        $.ajax({
            url: "/play",
            type: "POST",
            data: JSON.stringify({size, dim, max}),
            contentType: "application/json",
            complete: handleMarkResponse
        });
    };

    const handleMarkResponse = (json) => {
        if (json.status === 200) {
            $("body").text("");
            $("body").append(`<p>${json.responseText}</p>`);
            let size = json.responseJSON.size;
            for (let i = 0; i < size; i++) {
                $("body").append(`<input type="text" title="${i}"/><br/>`);
            }
        }
    };

    $("body #send").on("click", (e) => {
        e.preventDefault();
        sendRequest($("#size").val(), $("#dim").val(), $("#max").val());
    });
});
