// $(() => {
//     const registerUser = (username, password, password2) => {
//         $.ajax({
//             url: "/register",
//             type: "POST",
//             data: JSON.stringify({username, password, password2}),
//             contentType: "application/json",
//             dataType: "json"
//         });
//     };
//
//     $('#registerButton').on('click', () => {
//         let username = $("input[title='username']").val();
//         let password = $("input[title='password']").val();
//         let password2 = $("input[title='password2']").val();
//         registerUser(username, password, password2);
//     });
// });