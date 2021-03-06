// const url = 'http://localhost:8000';
const url = 'https://manageattendance.herokuapp.com';

const navHeading = document.querySelector('.heading');
const logout = document.querySelector('.nav-logout');

// window.addEventListener('resize', (event) => {
//     location.reload();
// })

logout.addEventListener('click', (event) => {
    localStorage.removeItem('token');
    location.href = "../../index.html";
})

const navRecords = document.querySelector(".nav-record");
navRecords.addEventListener('click', (event) => {
    location.reload();
})

const params = new URLSearchParams(window.location.search); 
const subjectId = params.get('subjectid');

const getRecords = async () => {
    const subjectResponse = await fetch(`${url}/attendance/getsubjectdata/${subjectId}`, {
        method: "GET", 
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
    });
    const subjectData = await subjectResponse.json();

    if (!subjectResponse.ok){
        alert(subjectData.message);
        return;
    }

    const {data, attendance, total} = subjectData;
    const attendanceContainer = document.querySelector('.left');
    const addAttendance = document.querySelector('.add-attendance');
    const addForm = document.querySelector('.add-attendance-form');
    const form = document.querySelector('.mark-attendance-form');
    attendanceContainer.innerHTML = "";
    attendanceContainer.appendChild(addAttendance);
    attendanceContainer.appendChild(addForm);
    attendanceContainer.appendChild(form);
    const current_date = new Date();
    const date = `${current_date.getFullYear()}-${current_date.getMonth() + 1}-${current_date.getDate()}`;
    let CurrentDate = false;
    data.forEach(element => {
        const card = document.createElement('div');
        card.classList.add('attendance-card');
        card.innerHTML = `<img class = "attendance-delete-image" src = "../../assets/delete.png"/><br/>${element.date} <div id = ${element.id} class="attendance ${element.attendance}">${element.attendance}</div><img class = "edit-button" src="../../assets/edit-button.png">
        <form class = "edit-attendance-form invisible">
            <button class = "edit-attendance-button">Done</button>
            <select class = "edit-attendance-options Present">
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Holiday">Holiday</option>
            </select> 
        </form>`;
        attendanceContainer.appendChild(card);
        if (date === element.date){
            form.classList.add('invisible');
            CurrentDate = true;
        }
        const editButton = card.querySelector('.edit-button');
        const editAttendanceForm = card.querySelector('.edit-attendance-form');
        const editAttendenceOptions = card.querySelector('.edit-attendance-options');
        const editAttendanceButton = card.querySelector('.edit-attendance-button');
        editAttendenceOptions.value = element.attendance;
        editAttendenceOptions.classList.remove("Holiday");
        editAttendenceOptions.classList.remove("Present");
        editAttendenceOptions.classList.remove("Absent");
        editAttendenceOptions.classList.add(element.attendance);
        editButton.addEventListener('click', (event) => {
            editAttendanceForm.classList.toggle('invisible');
        })
        editAttendenceOptions.addEventListener('change', (event) => {
            editAttendenceOptions.classList.remove('Present');
            editAttendenceOptions.classList.remove('Absent');
            editAttendenceOptions.classList.remove('Holiday');
            editAttendenceOptions.classList.add(editAttendenceOptions.value);
        });
        editAttendanceButton.addEventListener('click', (event) => {
            event.preventDefault();
            fetch(`${url}/attendance/editattendancedata/${subjectId}`, {
                method: "PUT", 
                headers: {
                    "content-type": "application/json",
                    "authorization": localStorage.getItem('token')
                },
                body : JSON.stringify({id : element.id, attendance: editAttendenceOptions.value})
            }).then((res) => {
                res.json().then((resData) => {
                    if (!res.ok){
                        alert(resData.message);
                    }
                    else {
                        getRecords();
                    }
                })
            })
        });
        const deleteButton = card.querySelector('.attendance-delete-image');
        deleteButton.addEventListener('click', (event) => {
            const data = {id: element.id};
            fetch(`${url}/attendance/deleteattendance/${subjectId}`, {
                method: "DELETE", 
                headers: {
                    "content-type": "application/json",
                    "authorization": localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            }).then((res) => {
                res.json().then((resData) => {
                    if (!res.ok){
                        alert(resData.message);
                    }
                    else {
                        getRecords();
                    }
                })
            });
        });
    })
    if (CurrentDate === false){
        const timeTableResponse = await fetch(`${url}/timetable/gettimetable/${subjectId}`, {
            method: "GET", 
            headers: {
                "content-type": "application/json",
                "authorization": localStorage.getItem('token')
            },
        })
        const timeTableData = await timeTableResponse.json();
        if (!timeTableResponse.ok){
            alert(timeTableData.message);
            return;
        }
        const current_date = new Date();
        let day = current_date.getDay();
        if (day == 0){
            day = 7;
        }
        timeTableData.forEach((row) => {
            if (row.day === day){
                form.classList.remove('invisible');
            }
        })
    }
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart(){
        var data = google.visualization.arrayToDataTable([
            ['Attendance', 'Number of Days'],
            ['Present',     attendance],
            ['Absent',      total-attendance],
        ]);

        var options = {
            title: 'Attendance'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
    }
}

getRecords();

const addForm = document.querySelector('.add-attendance-form');
const AddButton = document.querySelector('.add-attendance');
AddButton.addEventListener('click', (event) => {
    addForm.classList.toggle('invisible');
});

const markAttendanceForm = document.querySelector('.mark-attendance-form');
const markAttendanceOption = markAttendanceForm.querySelector('.attendance-option');

markAttendanceOption.addEventListener('change', (event) => {
    markAttendanceOption.classList.remove('Present');
    markAttendanceOption.classList.remove('Absent');
    markAttendanceOption.classList.remove('Holiday');
    markAttendanceOption.classList.add(markAttendanceOption.value);
});

const markAttendanceButton = document.querySelector('.mark-attendance-button');
markAttendanceButton.addEventListener('click', (event) => {
    event.preventDefault();
    let date;
    const current_date = new Date();
    date = `${current_date.getFullYear()}-${current_date.getMonth() + 1}-${current_date.getDate()}`;
    const data = {
        date,
        attendance: markAttendanceOption.value
    };
    console.log(subjectId);
    fetch(`${url}/attendance/addattendance/${subjectId}`, {
        method: "POST", 
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }).then((res) => res.json().then((data) => {
        if (res.ok){
            getRecords();
        }
        else{
            alert(data.message);
        }
    }))
});

const addAttendanceForm = document.querySelector('.add-attendance-form');
const addAttendanceButton = document.querySelector('.add-attendance-button');
const addAttendanceOption = addAttendanceForm.querySelector('.attendance-option');
addAttendanceOption.addEventListener('change', (event) => {
    addAttendanceOption.classList.remove('Present');
    addAttendanceOption.classList.remove('Absent');
    addAttendanceOption.classList.remove('Holiday');
    addAttendanceOption.classList.add(addAttendanceOption.value);
});
addAttendanceButton.addEventListener('click', (event) => {
    event.preventDefault();
    const dateField = addAttendanceForm.querySelector('.add-date-field');
    const data = {
        date: dateField.value,
        attendance: addAttendanceOption.value
    };
    fetch(`${url}/attendance/addattendance/${subjectId}`, {
        method: "POST", 
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }).then((res) => res.json().then((data) => {
        if (res.ok){
            addForm.classList.add('invisible');
            getRecords();
        }
        else{
            alert(data.message);
        }
    }))
});