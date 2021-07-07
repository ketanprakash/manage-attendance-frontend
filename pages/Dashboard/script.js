const url = 'http://localhost:8000';
// const url = 'https://manageattendance.herokuapp.com';
const navAdd = document.querySelector('.nav-add');
const AddForm = document.querySelector('.nav-form-add');
const AddSubjectButton = document.querySelector('.add-subject-button');
const SubjectField = document.querySelector('.subject-field');
const logout = document.querySelector('.nav-logout');
const initialHeight = window.innerHeight;

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
                        subjectCard.innerHTML = `<div class = "subject-clickable"><div class="subject-heading"><a href="../../pages/Records/?subjectid=${element.id}">${element.name}</a></div></div><div class = "set-time-table">Time Table</div><img src = "../../assets/bin.svg" class = "delete-image"><form class = 'time-table invisible'>
                        <div class="option">
                            <input type = "checkbox" name = "Monday" value = 1><label for = "Monday">Monday</label>
                        </div>
                        <div class="option">
                            <input type = "checkbox" name = "Tuesday" value = 2><label for = "Tuesday">Tuesday</label>
                        </div>
                        <div class="option">
                            <input type = "checkbox" name = "Wednesday" value = 3><label for = "Wednesday">Wednesday</label>
                        </div>
                        <div class="option">
                            <input type = "checkbox" name = "Thursday" value = 4><label for = "Thursday">Thursday</label>
                        </div>
                        <div class="option">
                            <input type = "checkbox" name = "Friday" value = 5><label for = "Friday">Friday</label>
                        </div>
                        <div class="option">
                            <input type = "checkbox" name = "Saturday" value = 6><label for = "Saturday">Saturday</label>
                        </div>
                        <div class="option">
                            <input type = "checkbox" name = "Sunday" value = 7><label for = "Sunday">Sunday</label>
                        </div>
                        <button class = "time-table-button">Set Time Table</button>
                        </form>`
                        const timeTableButton = subjectCard.querySelector('.set-time-table');
                        const timeTableForm = subjectCard.querySelector('.time-table');
                        const timeTableFormButton = subjectCard.querySelector('.time-table-button');
                        timeTableButton.addEventListener('click', (event) => {
                            timeTableForm.classList.toggle('invisible');
                        })
                        const checkbox = timeTableForm.querySelectorAll('input');
                        fetch(`${url}/timetable/gettimetable/${element.id}`, {
                            method: "GET", 
                            headers: {
                                "content-type": "application/json",
                                "authorization": localStorage.getItem('token')
                            },
                        }).then((res) => {
                            res.json().then((data) => {
                                data.forEach((row) => {
                                    checkbox[row.day - 1].checked = true;
                                })
                            })
                        })
                        timeTableFormButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            let timetable = [];
                            checkbox.forEach((cb) => {
                                if (cb.checked){
                                    timetable.push(parseInt(cb.value, 10));
                                }
                            })
                            console.log(timetable);
                            fetch(`${url}/timetable/addtimetable/${element.id}`, {
                                method: "POST", 
                                headers: {
                                    "content-type": "application/json",
                                    "authorization": localStorage.getItem('token')
                                },
                                body: JSON.stringify({ timetable })
                            }).then((res) => {
                                res.json().then((value) => {
                                    if (res.status != 200){
                                        alert(value.message);
                                    }
                                })
                            });
                            timeTableForm.classList.toggle('invisible');
                            loadSubjects();
                        })
                        const deleteButton = subjectCard.querySelector('.delete-image');
                        const subjectClickable = subjectCard.querySelector('.subject-clickable');
                        subjectClickable.addEventListener('click', () => {
                            location.href = `../../pages/Records/?subjectid=${element.id}`
                        })
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

window.addEventListener('resize', (event) => {
    document.documentElement.style.setProperty('overflow', 'auto')
    const metaViewport = document.querySelector('meta[name=viewport]')
    metaViewport.setAttribute('content', 'height=' + initialHeight + 'px, width=device-width, initial-scale=1.0');
});