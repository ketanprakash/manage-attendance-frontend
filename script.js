window.addEventListener('load', (event) => {
    if (localStorage.getItem('token')){
        location.href = "./pages/Dashboard/index.html";
    }
})