document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const sequentialSlider = document.getElementById('sequentialSlider');
    const integratedSlider = document.getElementById('integratedSlider');
    const comparisonSlider = document.getElementById('comparisonSlider');
    const radiationIcon = document.querySelector('.radiation-icon');
    const easterEgg = document.querySelector('.easter-egg');

    function updateSequentialTreatment(day, containerId = 'sequential') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const phase1 = container.querySelector('.phase1');
        const phase2 = container.querySelector('.phase2');
        const treatmentZone = phase1.querySelector('.treatment-zone');
        const boostZone = phase2 ? phase2.querySelector('.boost-zone') : null;
        const dayDisplay = container.querySelector('.day-display') || document.getElementById('comparisonDayDisplay');
        const explanation = container.querySelector('.treatment-explanation') || document.getElementById(`comparison${containerId.charAt(0).toUpperCase() + containerId.slice(1)}Explanation`);

        if (dayDisplay) dayDisplay.textContent = day;

        if (day <= 35) {
            phase1.classList.add('active');
            if (phase2) phase2.classList.remove('active');
            treatmentZone.classList.add('active-treatment');
            if (boostZone) boostZone.classList.remove('active-treatment');
            treatmentZone.style.opacity = Math.min(1, day / 35);
            if (explanation) explanation.textContent = `Ziua ${day}: Se administrează doza de bază pe întreaga zonă afectată. Scopul este reducerea tumorii și eliminarea celulelor canceroase microscopice.`;
        } else {
            phase1.classList.remove('active');
            if (phase2) phase2.classList.add('active');
            treatmentZone.classList.remove('active-treatment');
            if (boostZone) {
                boostZone.classList.add('active-treatment');
                boostZone.style.opacity = Math.min(1, (day - 35) / 7);
            }
            if (explanation) explanation.textContent = `Ziua ${day}: Faza de boost. Se concentrează o doză suplimentară pe zona tumorală sau patul tumoral pentru un control local mai bun.`;
        }
    }

    function updateIntegratedTreatment(day, containerId = 'integrated') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const treatmentZone = container.querySelector('.treatment-zone');
        const boostZone = container.querySelector('.boost-zone');
        const dayDisplay = container.querySelector('.day-display') || document.getElementById('comparisonDayDisplay');
        const explanation = container.querySelector('.treatment-explanation') || document.getElementById(`comparison${containerId.charAt(0).toUpperCase() + containerId.slice(1)}Explanation`);

        if (dayDisplay) dayDisplay.textContent = day;

        treatmentZone.classList.add('active-treatment');
        boostZone.classList.add('active-treatment');
        treatmentZone.style.opacity = Math.min(1, day / 35);
        boostZone.style.opacity = Math.min(1, day / 35);

        if (explanation) explanation.textContent = `Ziua ${day}: Se administrează simultan doza standard pe zona largă și doza de boost pe zona tumorală. Această abordare scurtează durata totală de tratament.`;
    }

    function createDoseChart(canvasId, treatmentType) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const labels = Array.from({length: 43}, (_, i) => i);
        const baseData = treatmentType === 'sequential' 
            ? labels.map(day => day <= 35 ? day * (50/35) : 50)
            : labels.map(day => day <= 35 ? day * (50/35) : 50);
        const boostData = treatmentType === 'sequential'
            ? labels.map(day => day > 35 ? (day - 35) * (16/7) : 0)
            : labels.map(day => day <= 35 ? day * (16/35) : 16);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Doza de bază',
                        data: baseData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false
                    },
                    {
                        label: 'Doza de boost',
                        data: boostData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Zile de tratament'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Doză (Gy)'
                        },
                        max: 66
                    }
                }
            }
        });
    }

    let comparisonChart;

    function createComparisonChart() {
        const canvas = document.getElementById('comparisonDoseChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Secvențial', 'Integrat'],
                datasets: [
                    {
                        label: 'Doza de bază',
                        data: [0, 0],
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    },
                    {
                        label: 'Doza de boost',
                        data: [0, 0],
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Doză (Gy)'
                        },
                        max: 66
                    }
                }
            }
        });
    }

    function updateComparisonChart(day) {
        if (!comparisonChart) return;

        const sequentialBaseData = day <= 35 ? day * (50/35) : 50;
        const sequentialBoostData = day > 35 ? (day - 35) * (16/7) : 0;
        const integratedBaseData = Math.min(day * (50/35), 50);
        const integratedBoostData = Math.min(day * (16/35), 16);

        comparisonChart.data.datasets[0].data = [sequentialBaseData, integratedBaseData];
        comparisonChart.data.datasets[1].data = [sequentialBoostData, integratedBoostData];
        comparisonChart.update();
    }

    function addTouchSupport(slider) {
        if (!slider) return;

        slider.addEventListener('touchstart', function(e) {
            e.preventDefault();
            slider.focus();
        });

        slider.addEventListener('touchmove', function(e) {
            var touch = e.touches[0];
            var rect = slider.getBoundingClientRect();
            var value = ((touch.clientX - rect.left) / rect.width) * parseInt(slider.max);
            slider.value = Math.round(value);
            var event = new Event('input');
            slider.dispatchEvent(event);
        });
    }

    if (tabBtns && tabContents) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const tabContent = document.getElementById(btn.dataset.tab);
                if (tabContent) tabContent.classList.add('active');
            });
        });
    }

    if (sequentialSlider) {
        sequentialSlider.addEventListener('input', function() {
            updateSequentialTreatment(parseInt(this.value));
        });
    }

    if (integratedSlider) {
        integratedSlider.addEventListener('input', function() {
            updateIntegratedTreatment(parseInt(this.value));
        });
    }

    if (comparisonSlider) {
        comparisonSlider.addEventListener('input', function() {
            const day = parseInt(this.value);
            updateSequentialTreatment(day, 'comparisonSequentialArea');
            updateIntegratedTreatment(day, 'comparisonIntegratedArea');
            updateComparisonChart(day);
        });
    }

    if (radiationIcon && easterEgg) {
        radiationIcon.addEventListener('click', function() {
            easterEgg.style.display = 'block';
            
            setTimeout(function() {
                easterEgg.style.display = 'none';
            }, 5000);
        });
    }

    // Inițializare
    createDoseChart('sequentialDoseChart', 'sequential');
    createDoseChart('integratedDoseChart', 'integrated');
    createComparisonChart();
    updateSequentialTreatment(0);
    updateIntegratedTreatment(0);
    updateSequentialTreatment(0, 'comparisonSequentialArea');
    updateIntegratedTreatment(0, 'comparisonIntegratedArea');

    // Adăugare suport touch pentru slidere
    addTouchSupport(sequentialSlider);
    addTouchSupport(integratedSlider);
    addTouchSupport(comparisonSlider);
});
