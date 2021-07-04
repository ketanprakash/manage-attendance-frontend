const url = "http://localhost:8000";
// const url = 'https://manageattendance.herokuapp.com';
const signinButton = document.querySelector('.signin-button');
const emailField = document.querySelector('.email-field');
const passwordField = document.querySelector('.password-field');

signinButton.addEventListener("click", (event) =>  {
    event.preventDefault();
    const data = {
        email: emailField.value,
        password: passwordField.value
    }
    fetch(`${url}/auth/signin`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((res) => {
        console.log("ok");
        res.json().then((data) => {
            if (res.status == 200){
                console.log(data);
                localStorage.setItem('token', data.token);
                window.location.href = "../Dashboard/index.html";
            }
            else{
                alert(data.message);
            }
        });
    });
})