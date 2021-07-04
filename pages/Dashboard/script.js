// const url = 'http://localhost:8000';
const url = 'https://manageattendance.herokuapp.com';
const navAdd = document.querySelector('.nav-add');
const AddForm = document.querySelector('.nav-form-add');
const AddSubjectButton = document.querySelector('.add-subject-button');
const SubjectField = document.querySelector('.subject-field');
const logout = document.querySelector('.nav-logout');

const loadSubjects = () => {
    fetch(`${url}/subjects/getsubjects`, {
        method: "GET", 
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
    }).then((res) => {
        res.json().then((value) => {
            if (res.status == 200){
                if (value.length != 0){
                    const subjectCardContainer = document.querySelector('.subject-container');
                    subjectCardContainer.classList.remove('subject-container-empty');
                    subjectCardContainer.innerHTML = '';
                    value.forEach(element => {
                        const subjectCard = document.createElement('div');
                        subjectCard.classList.add('subject-card');
                        subjectCard.id = element.id;
                        subjectCard.innerHTML = `<div class="subject-heading"><a href="../../pages/Records/?subjectid=${element.id}">${element.name}</a></div>`
                        subjectCard.innerHTML = `<div class="subject-heading"><a href="../../pages/Records/?subjectid=${element.id}">${element.name}</a></div><img src = "../../assets/Delete.png" class = "delete-image">`
                        const deleteButton = subjectCard.querySelector('.delete-image');
                        deleteButton.addEventListener('click', (event) => {
                            fetch(`${url}/subjects/deletesubject/${subjectCard.id}`, {
                                method: "DELETE", 
                                headers: {
                                    "content-type": "application/json",
                                    "authorization": localStorage.getItem('token')
                                },
                            }).then((res) => {
                                res.json().then((value) => {
                                    if (res.status != 200) {
                                        alert(value.message);
                                        loadSubjects();
                                    }
                                    else{
                                        subjectCard.classList.add('invisible');
                                        loadSubjects();
                                    }
                                })
                            })
                            
                        })
                        subjectCardContainer.appendChild(subjectCard);
                    });
                }
                else {
                    const subjectCardContainer = document.querySelector('.subject-container');
                    subjectCardContainer.innerHTML = `Add Subjects to start tracking your attendance`;
                    subjectCardContainer.classList.add('subject-container-empty');
                }
            }
            else {
                alert(value.message);
            }
        })
    });
}

loadSubjects();

navAdd.addEventListener('click', (event) => {
    AddForm.classList.toggle('invisible');
});

AddSubjectButton.addEventListener('click', (event) => {     
    console.log(localStorage.getItem('token'));
    event.preventDefault();
    const data = {
        subject: SubjectField.value
    };
    fetch(`${url}/subjects/addsubject`, {
        method: "POST", 
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }).then((res) => {
        res.json().then((value) => {
            if (res.status == 200){
                SubjectField.value = '';
                AddForm.classList.toggle('invisible');
                loadSubjects();
            }
            else {
                alert(value.message);
            }
        })
    });
})

logout.addEventListener('click', (event) => {
    localStorage.removeItem('token');
    location.href = "../../index.html";
})