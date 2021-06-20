const navAdd = document.querySelector('.nav-add');
const AddForm = document.querySelector('.nav-form-add');

navAdd.addEventListener('click', (event) => {
    AddForm.classList.toggle('invisible');
})
