const url = "http://localhost:8000";
// const url = 'https://manageattendance.herokuapp.com';
const signupButton = document.querySelector('.signup-button');
const firstnameField = document.querySelector('.firstname-field');
const lastnameField = document.querySelector('.lastname-field');
const emailField = document.querySelector('.email-field');
const passwordField = document.querySelector('.password-field');
const initialHeight = window.innerHeight;


signupButton.addEventListener("click", (event) =>  {
    event.preventDefault();
    const data = {
        firstname: firstnameField.value,
        lastname: lastnameField.value,
        email: emailField.value,
        password: passwordField.value
    }
    fetch(`${url}/auth/signup`, {
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

window.addEventListener('resize', (event) => {
    document.documentElement.style.setProperty('overflow', 'auto')
    const metaViewport = document.querySelector('meta[name=viewport]')
    metaViewport.setAttribute('content', 'height=' + initialHeight + 'px, width=device-width, initial-scale=1.0');
});