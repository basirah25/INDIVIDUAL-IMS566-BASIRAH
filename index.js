const roleSelect = document.getElementById('roleSelect');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        function applyRoleCredentials(role) {
            if (role === 'boss') {
                usernameInput.value = 'boss';
                passwordInput.value = '1234';
            } else if (role === 'manager') {
                usernameInput.value = 'manager';
                passwordInput.value = '1234';
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            roleSelect.value = 'boss';
            applyRoleCredentials('boss');
        });

        roleSelect.addEventListener('change', function() {
            applyRoleCredentials(this.value);
        });

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const role = roleSelect.value;
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const errorAlert = document.getElementById('errorAlert');

            let isValid = false;

            if (role === 'manager' && username === 'manager' && password === '1234') {
                isValid = true;
            } else if (role === 'boss' && username === 'boss' && password === '1234') {
                isValid = true;
            }

            if (isValid) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', role);
                localStorage.setItem('username', username);
                window.location.href = 'dashboard.html';
            } else {
                errorAlert.classList.remove('d-none');
            }
        });