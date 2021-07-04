// const url = 'http://localhost:8000';
const url = 'https://manageattendance.herokuapp.com';
const navHeading = document.querySelector('.heading');
const logout = document.querySelector('.nav-logout');

window.addEventListener('resize', (event) => {
    location.reload();
})

logout.addEventListener('click', (event) => {
    localStorage.removeItem('token');
    location.href = "../../index.html";
})

const params = new URLSearchParams(window.location.search); 
const subjectId = params.get('subjectid');

const attendanceOption = document.querySelector('.attendance-option');

attendanceOption.addEventListener('change', (event) => {
    attendanceOption.classList.remove('Present');
    attendanceOption.classList.remove('Absent');
    attendanceOption.classList.remove('Holiday');
    attendanceOption.classList.add(attendanceOption.value);
});

const getRecords = () => {
    fetch(`${url}/attendance/getsubjectdata/${subjectId}`, {
        method: "GET", 
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
    }).then(res => res.json().then((attendanceData) => {
        if (res.status == 200){
            const {data, attendance, total, percentage} = attendanceData;
            const attendanceContainer = document.querySelector('.left');
            const form = document.querySelector('.mark-attendance-form');
            attendanceContainer.innerHTML = "";
            attendanceContainer.appendChild(form);
            const current_date = new Date();
            const date = `${current_date.getFullYear()}-${current_date.getMonth() + 1}-${current_date.getDate()}`;
            let CurrentDate = false;
            data.forEach(element => {
                let dayType; 
                if (element.holiday){
                    dayType = "Holiday";
                }
                else if (element.attendance){
                    dayType = "Present";
                }
                else {
                    dayType = "Absent";
                }
                
                const card = document.createElement('div');
                card.classList.add('attendance-card');
                card.innerHTML = `${element.date} <div id = ${element.id} class="attendance ${dayType}">${dayType}</div><img class = "edit-button" src="../../assets/edit-button.png">
                <form class = "edit-attendance-form invisible">
                    <button class = "edit-attendance-button">Edit</button>
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
                editAttendenceOptions.value = dayType;
                editAttendenceOptions.classList.remove("Holiday");
                editAttendenceOptions.classList.remove("Present");
                editAttendenceOptions.classList.remove("Absent");
                editAttendenceOptions.classList.add(dayType);
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
                    let holiday, attendance;
                    if (editAttendenceOptions.value == "Present"){
                        holiday = false;
                        attendance = true;
                    }
                    if (editAttendenceOptions.value == "Absent"){
                        holiday = false;
                        attendance = false;
                    }
                    if (editAttendenceOptions.value == "Holiday"){
                        holiday = true;
                        attendance = false;
                    }
                    console.log(holiday, attendance);
                    fetch(`${url}/attendance/editattendancedata/${subjectId}`, {
                        method: "PUT", 
                        headers: {
                            "content-type": "application/json",
                            "authorization": localStorage.getItem('token')
                        },
                        body : JSON.stringify({id : element.id, holiday, attendance})
                    }).then((res) => {
                        res.json().then((resData) => {
                            if (res.status != 200){
                                alert(resData.message);
                            }
                            else {
                                getRecords();
                            }
                        })
                    })
                });
            });
            if (CurrentDate === false){
                form.classList.remove('invisible');
            }
            console.log(total);
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
        else{
            alert(attendanceData.message);
        }
    }))  
}

getRecords();

const markAttendanceButton = document.querySelector('.mark-attendance-button');
markAttendanceButton.addEventListener('click', (event) => {
    event.preventDefault();
    let attendance, holiday;
    if (attendanceOption.value === 'Present'){
        attendance = true;
        holiday = false;
    }
    else if (attendanceOption.value === 'Absent'){
        attendance = false;
        holiday = false;
    }
    else {
        attendance = false;
        holiday = true;
    }
    const data = {
        holiday, 
        attendance
    };
    console.log(subjectId);
    fetch(`${url}/attendance/markattendance/${subjectId}`, {
        method: "POST", 
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }).then((res) => res.json().then((data) => {
        if (res.status === 200){
            getRecords();
        }
        else{
            alert(data.message);
        }
    }))
});