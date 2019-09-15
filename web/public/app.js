$('#navbar').load('navbar.html');
$('#footer').load('footer.html');

const API_URL = 'http://localhost:5000/api';
// const API_URL = 'https://217464906-sit-209.now.sh';
const MQTT_URL = 'http://localhost:5001/send-command';
$.get(`${API_URL}/devices`)
.then(response => {
    response.forEach(device => {
        $('#devices tbody').append(`
            <tr>
                <td>${device.user}</td>
                <td>${device.name}</td>
            </tr>`
        );
    });
})
.catch(error => {
    console.error(`Error: ${error}`);
});

const userlist = JSON.parse(localStorage.getItem('userlist')) || [];

$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
        name,
        user,
        sensorData
    };
    $.post(`${API_URL}/devices`, body)
    .then(response => {
        location.href = '/';
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
});
   
$('#register').on('click', function () {
    const user = $('#user').val();
    const password = $('#password').val();
    const confirm = $('#confirm').val();
    if (password !== confirm) {
        return res.send('Password do not match');
    } else {
        $.post(`${API_URL}/registration`, {user, password})
        .then((response) => {
            if (response.success) {
                location.href = '/login';
            } else {
                console.log(response);
                $('#message').append(`<p class="alert alert-danger">${response}</p>`);
            }
        }
    )};
});
$('#login').on('click', () => {
    const user = $('#user').val();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, { user, password })
    .then((response) =>{
        if (response.success) {
            localStorage.setItem('token', response.token);
            location.href = '/';
    } else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
    });
});
   
const logout = () => {
    localStorage.removeItem('user');
    location.href = '/login';
    }
$('#send-command').on('click', function () {
    const command = $('#command').val();
    const deviceId = $('#deviceID').val();
    console.log(`command is: ${command}`);
    const body = {
        deviceId,
        command,
    };
    $.post(`${MQTT_URL}`, body)
});

// const currentUser = localStorage.getItem('user');
// if (currentUser) {
//     $.get(`${API_URL}/users/${currentUser}/devices`)
//     .then(response => {
//         response.forEach((device) => {
//             $('#devices tbody').append(`
//             <tr data-device-id=${device._id}>
//                 <td>${device.user}</td>
//                 <td>${device.name}</td>
//             </tr>`
//             );
//         });
//         $('#devices tbody tr').on('click', (e) => {
//             const deviceId = e.currentTarget.getAttribute('data-device-id');
//             $.get(`${API_URL}/devices/${deviceId}/device-history`)
//             .then(response => {
//                 response.map(sensorData => {
//                     $('#historyContent').append(`
//                     <tr>
//                         <td>${sensorData.ts}</td>
//                         <td>${sensorData.temp}</td>
//                         <td>${sensorData.loc.lat}</td>
//                         <td>${sensorData.loc.lon}</td>
//                     </tr>
//                     `);
//                 });
//                 $('#historyModal').modal('show');
//             });
//         });
//     })
//     .catch(error => {
//         console.error(`Error: ${error}`);
//     });
// } else {
//     const path = window.location.pathname;
//     if (path !== '/login') {
//     location.href = '/login';
//     }
// }




