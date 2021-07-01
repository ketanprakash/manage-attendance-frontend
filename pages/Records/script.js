const url = 'http://localhost:8000';
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

const getRecords = () => {
    fetch(`${url}/attendance/getsubjectdata/${subjectId}`, {
        method: "GET", 
        headers: {
            "content-type": "application/json",
            "authorization": localStorage.getItem('token')
        },
    }).then(res => res.json().then((attendanceData) => {
        const {data, attendance, total} = attendanceData;
        const attendanceContainer = document.querySelector('.left');
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
            card.innerHTML = `${element.date} <div class="attendance ${dayType}">${dayType}</div>`;
            attendanceContainer.appendChild(card);
        });
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
    }))  
}

getRecords();

