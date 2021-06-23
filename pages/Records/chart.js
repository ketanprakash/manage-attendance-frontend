google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Attendance', 'Hours per Day'],
        ['Present',     30],
        ['Absent',      30],
    ]);

    var options = {
        title: 'Attendance'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
}