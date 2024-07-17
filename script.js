document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const phaseBtns = document.querySelectorAll('.phase-btn');
    const phases = document.querySelectorAll('#sequential .phase');
    const radiationIcon = document.querySelector('.radiation-icon');
    const easterEgg = document.querySelector('.easter-egg');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    phaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            phaseBtns.forEach(b => b.classList.remove('active'));
            phases.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.querySelector(`#sequential .${btn.dataset.phase}`).classList.add('active');
        });
    });

    radiationIcon.addEventListener('click', function() {
        easterEgg.style.display = 'block';
        
        setTimeout(function() {
            easterEgg.style.display = 'none';
        }, 5000);
    });
});
