const BASE_URL = 'https://inai-col1.fishrungames.com';

async function checkApplication() {
    const studentId = document.getElementById('studentId').value.trim();
    const buildingId = document.getElementById('buildingId').value.trim();
    const roomId = document.getElementById('roomId').value.trim();

    const resultDiv = document.getElementById('result');
    const submitButton = document.querySelector('button');

    resultDiv.className = '';
    resultDiv.style.display = 'none';

    submitButton.disabled = true;
    submitButton.innerText = 'Проверка...';

    try {
        let student = null;
        let building = null;
        let room = null;

        if (studentId !== "0" && studentId !== "") {
            const response = await fetch(`${BASE_URL}/students/${studentId}`);

            if (!response.ok) {
                showResult(false, 'Отказ: Студент с таким ID не найден.');
                return;
            }

            student = await response.json();
        }

        if (buildingId !== "0" && buildingId !== "") {
            if (buildingId === "1") {
                showResult(false, 'Отказ: Первый корпус предназначен только для преподавателей.');
                return;
            }

            const response = await fetch(`${BASE_URL}/buildings/${buildingId}`);

            if (!response.ok) {
                showResult(false, 'Отказ: Корпус не найден.');
                return;
            }

            building = await response.json();
        }

        if (roomId !== "0" && roomId !== "") {
            const response = await fetch(`${BASE_URL}/rooms/${roomId}`);

            if (!response.ok) {
                showResult(false, 'Отказ: Комната не найдена.');
                return;
            }

            room = await response.json();
        }

        if (student !== null && !student.resident) {
            showResult(
                false,
                `Отказ: Студент ${student.name || ''} не является иногородним.`
            );
            return;
        }

        if (building !== null) {
            const isForStudents =
                building.isForStudents ??
                building.is_for_students ??
                building.student;

            if (isForStudents === false) {
                showResult(false, 'Отказ: Корпус не предназначен для студентов.');
                return;
            }
        }

        if (room !== null && room.available === false) {
            showResult(false, 'Отказ: Комната занята другими студентами.');
            return;
        }

        showResult(true, 'Всё ок! Заявка одобрена, заселение разрешено.');

    } catch (error) {
        showResult(false, 'Отказ: Ошибка связи с сервером.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = 'Проверить заявку';
    }
}

function showResult(isSuccess, message) {
    const resultDiv = document.getElementById('result');

    resultDiv.innerText = message;
    resultDiv.className = isSuccess ? 'success' : 'error';
    resultDiv.style.display = 'block';
}