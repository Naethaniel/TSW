// $(() => {
//     const loginUser = (username, password) => {
//         $.ajax({
//             url: "/login",
//             type: "POST",
//             data: JSON.stringify({username, password}),
//             contentType: "application/json",
//         });
//     };
//
//     $('#loginButton').on('click', () => {
//         let username = $("input[title='user']").val();
//         let password = $("input[title='password']").val();
//         loginUser(username, password);
//     });
// });