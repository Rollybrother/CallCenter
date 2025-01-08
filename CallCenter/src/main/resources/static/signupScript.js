function checkId() {
    const id = document.getElementById('id').value;
    
    fetch(`/loginController/checkId?id=${id}`)
        .then(response => response.json())
        .then(data => {
            const resultElement = document.getElementById('checkIdResult');
            if (data.exists) {  // data.exists를 확인합니다.
                resultElement.textContent = '해당 아이디는 이미 사용중인 아이디입니다';
                resultElement.style.color = 'red';
                document.getElementById('signupButton').disabled = true;
            } else {
                resultElement.textContent = '사용 가능한 아이디입니다';
                resultElement.style.color = 'green';
                document.getElementById('signupButton').disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload = function() {
    // URL에서 쿼리 파라미터를 추출합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
        alert(message);
    }
};