const form = document.querySelector('form');
const modal = document.getElementById('successModal');
const closeBtn = document.getElementById('closeModal');
const modalName = document.getElementById('modalName');
const modalEmail = document.getElementById('modalEmail');

const canvas = document.getElementById('slashCanvas');
const ctx = canvas.getContext('2d');

// サイドバー開閉処理
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const leftSidebar = document.getElementById('leftSidebar');

toggleSidebarBtn.addEventListener('click', function () {
    leftSidebar.classList.toggle('collapsed');
});

// 音声ファイルのURL（実際の環境に合わせて変更可）
const soundUrl = 'sword-slash1.mp3';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameValue = document.getElementById('name').value.trim();
    const emailValue = document.getElementById('email').value.trim();

    if (nameValue === "" || emailValue === "") {
        alert("お名前と電子メールを正しく入力してください。");
        return;
    }

    modalName.textContent = nameValue;
    modalEmail.textContent = emailValue;

    triggerComboSlash();
});

function triggerComboSlash() {
    canvas.style.display = 'block';

    const slashes = [
        { sX: -50, sY: canvas.height * 0.1, eX: canvas.width + 50, eY: canvas.height * 0.4 },
        { sX: canvas.width + 50, sY: canvas.height * 0.2, eX: -50, eY: canvas.height * 0.6 },
        { sX: -50, sY: canvas.height * 0.4, eX: canvas.width + 50, eY: canvas.height * 0.8 },
        { sX: canvas.width + 50, sY: canvas.height * 0.5, eX: -50, eY: canvas.height * 0.9 }
    ];

    const slashDuration = 120;
    const delayBetweenSlashes = 150;

    function clearScreen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawSlash(slash, index) {
        const startTime = performance.now();

        const audio = new Audio(soundUrl);
        audio.play().catch(() => { }); // 再生エラー回避

        document.body.classList.add('screen-shake');

        function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / slashDuration, 1);

            const currentX = slash.sX + (slash.eX - slash.sX) * progress;
            const currentY = slash.sY + (slash.eY - slash.sY) * progress;

            // 外側のオーラ（金色系へ変更）
            ctx.beginPath();
            ctx.moveTo(slash.sX, slash.sY);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = 'rgba(197, 160, 89, 0.5)';
            ctx.lineWidth = 32 * (1 - progress * 0.4);
            ctx.lineCap = 'round';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#c5a059';
            ctx.stroke();

            // 内側の白刃
            ctx.beginPath();
            ctx.moveTo(slash.sX, slash.sY);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';
            ctx.stroke();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                document.body.classList.remove('screen-shake');

                if (index === slashes.length - 1) {
                    setTimeout(() => {
                        clearScreen();
                        canvas.style.display = 'none';
                        modal.style.display = 'flex';
                    }, 300);
                }
            }
        }
        requestAnimationFrame(animate);
    }

    slashes.forEach((slash, i) => {
        setTimeout(() => {
            if (i > 0) ctx.fillStyle = 'rgba(255,255,255,0.1)';
            drawSlash(slash, i);
        }, i * delayBetweenSlashes);
    });
}

function closeModalWithSound() {
    const sheatheSound = new Audio('sword-sheathe.mp3');
    sheatheSound.play().catch(() => { });

    setTimeout(() => {
        modal.style.display = 'none';
    }, 600);
}

closeBtn.addEventListener('click', function () {
    closeModalWithSound();
});

window.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModalWithSound();
    }
});
