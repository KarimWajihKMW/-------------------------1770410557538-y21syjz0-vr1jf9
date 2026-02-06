console.log('Akwadra Super Builder Initialized');

document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
    if (card) {
        card.addEventListener('click', () => {
            console.log('تم النقر على البطاقة!');
            alert('أهلاً بك في عالم البناء بدون كود!');
        });
    }

    const chartCanvas = document.getElementById('candlestickChart');
    let financialChart;

    if (chartCanvas && window.Chart) {
        if (window['chartjs-chart-financial']) {
            const { CandlestickController, OhlcController, FinancialElement } = window['chartjs-chart-financial'];
            Chart.register(CandlestickController, OhlcController, FinancialElement);
        }

        const baseData = [
            { x: new Date('2024-05-20'), o: 118, h: 128, l: 115, c: 122 },
            { x: new Date('2024-05-21'), o: 122, h: 132, l: 120, c: 129 },
            { x: new Date('2024-05-22'), o: 130, h: 137, l: 128, c: 133 },
            { x: new Date('2024-05-23'), o: 133, h: 140, l: 130, c: 134 },
            { x: new Date('2024-05-24'), o: 134, h: 142, l: 132, c: 140 },
            { x: new Date('2024-05-27'), o: 141, h: 148, l: 138, c: 143 },
            { x: new Date('2024-05-28'), o: 143, h: 150, l: 140, c: 145 },
            { x: new Date('2024-05-29'), o: 145, h: 153, l: 142, c: 149 },
            { x: new Date('2024-05-30'), o: 150, h: 156, l: 148, c: 152 },
            { x: new Date('2024-05-31'), o: 152, h: 158, l: 149, c: 150 },
            { x: new Date('2024-06-03'), o: 150, h: 162, l: 148, c: 158 },
            { x: new Date('2024-06-04'), o: 159, h: 165, l: 154, c: 162 },
            { x: new Date('2024-06-05'), o: 163, h: 170, l: 160, c: 166 },
            { x: new Date('2024-06-06'), o: 167, h: 174, l: 164, c: 172 },
            { x: new Date('2024-06-07'), o: 172, h: 179, l: 170, c: 175 }
        ];

        const datasetByRange = {
            day: baseData.slice(-5),
            week: baseData.slice(-10),
            month: baseData
        };

        const ctx = chartCanvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 320);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        gradient.addColorStop(1, 'rgba(14, 116, 144, 0.05)');

        financialChart = new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [
                    {
                        label: 'مؤشر أكوادرا',
                        data: datasetByRange.week,
                        borderColor: gradient,
                        color: {
                            up: '#34d399',
                            down: '#fb7185',
                            unchanged: '#94a3b8'
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15,23,42,0.9)',
                        titleColor: '#fff',
                        bodyColor: '#cbd5f5',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                const { o, h, l, c } = context.raw || {};
                                return `فتح ${o} | أعلى ${h} | أدنى ${l} | إغلاق ${c}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: 'rgba(148,163,184,0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: 'rgba(148,163,184,0.1)'
                        }
                    }
                }
            }
        });

        const timeframeButtons = document.querySelectorAll('.timeframe-btn');
        timeframeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                timeframeButtons.forEach((b) => b.classList.remove('active-range'));
                button.classList.add('active-range');
                const range = button.dataset.range || 'week';
                if (financialChart) {
                    financialChart.data.datasets[0].data = datasetByRange[range] || datasetByRange.week;
                    financialChart.update();
                }
            });
        });
        const defaultBtn = document.querySelector('.timeframe-btn[data-range="week"]');
        if (defaultBtn) {
            defaultBtn.click();
        }
    }

    const toast = document.getElementById('tradeToast');
    let toastTimeout;

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    };

    document.querySelectorAll('.trade-form').forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const type = form.dataset.type === 'sell' ? 'بيع' : 'شراء';
            const symbol = form.querySelector('select[name="symbol"]')?.value || 'رمز غير معروف';
            const quantity = form.querySelector('input[name="quantity"]')?.value || 0;
            const price = form.querySelector('input[name="price"]')?.value || 0;
            showToast(`تم إرسال أمر ${type} لـ ${quantity} سهم من ${symbol} بسعر ${price}$`);
            form.reset();
            form.querySelectorAll('.quick-amount').forEach((btn) => btn.classList.remove('active-amount', 'sell-mode'));
        });
    });

    document.querySelectorAll('.quick-amount').forEach((button) => {
        button.addEventListener('click', () => {
            const form = button.closest('form');
            const input = form?.querySelector('input[name="quantity"]');
            if (!input) return;
            input.value = button.dataset.amount || input.value;
            const isSell = form?.dataset.type === 'sell';
            const className = isSell ? 'sell-mode' : '';
            form.querySelectorAll('.quick-amount').forEach((btn) => btn.classList.remove('active-amount', 'sell-mode'));
            button.classList.add('active-amount');
            if (className) {
                button.classList.add(className);
            }
        });
    });

    const watchlistItems = document.querySelectorAll('.watch-item');
    const portfolioValueEl = document.getElementById('portfolioValue');
    const valueTrendEl = document.getElementById('valueTrend');
    const lastSyncEl = document.getElementById('lastSync');
    let portfolioValue = 186250;

    const randomizeWatchlist = () => {
        watchlistItems.forEach((item) => {
            const base = parseFloat(item.getAttribute('data-base')) || 100;
            const direction = Math.random() > 0.45 ? 1 : -1;
            const delta = +(Math.random() * 4).toFixed(2);
            const newPrice = Math.max(5, base + direction * delta);
            item.setAttribute('data-base', newPrice.toFixed(2));

            const priceEl = item.querySelector('[data-field="price"]');
            const changeEl = item.querySelector('[data-field="change"]');
            const volumeEl = item.querySelector('[data-field="volume"]');
            const sparkEl = item.querySelector('[data-field="spark"]');

            const changePct = ((direction * delta) / base * 100).toFixed(2);
            if (priceEl) {
                priceEl.textContent = `$${newPrice.toFixed(2)}`;
                priceEl.classList.toggle('text-emerald-300', changePct >= 0);
                priceEl.classList.toggle('text-rose-300', changePct < 0);
            }
            if (changeEl) {
                changeEl.textContent = `${changePct > 0 ? '+' : ''}${changePct}%`;
                changeEl.classList.toggle('text-emerald-400', changePct >= 0);
                changeEl.classList.toggle('text-rose-400', changePct < 0);
            }
            if (volumeEl) {
                const newVolume = (Math.random() * 4 + 1).toFixed(2);
                volumeEl.textContent = `${newVolume}M`;
            }
            if (sparkEl) {
                sparkEl.style.width = `${50 + Math.random() * 45}%`;
            }
        });

        portfolioValue += Math.random() * 160 - 80;
        if (portfolioValueEl) {
            portfolioValueEl.textContent = `$${Math.round(portfolioValue).toLocaleString('en-US')}`;
        }
        if (valueTrendEl) {
            const dayChange = (Math.random() * 2 - 1).toFixed(2);
            valueTrendEl.textContent = `${dayChange >= 0 ? '+' : ''}${dayChange}% اليوم`;
            valueTrendEl.classList.toggle('text-emerald-300', dayChange >= 0);
            valueTrendEl.classList.toggle('text-rose-300', dayChange < 0);
        }
        if (lastSyncEl) {
            const now = new Date();
            lastSyncEl.textContent = now.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    randomizeWatchlist();
    setInterval(randomizeWatchlist, 5000);
});
