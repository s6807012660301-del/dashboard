const defaultConfig = {
    dashboard_title: 'Dashboard Overview',
    company_name: 'AdminPro'
  };

  // SDK Init
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (config) => {
        document.getElementById('dashboardTitle').textContent = config.dashboard_title || defaultConfig.dashboard_title;
        document.getElementById('companyName').textContent = config.company_name || defaultConfig.company_name;
      },
      mapToCapabilities: () => ({
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      }),
      mapToEditPanelValues: (config) => new Map([
        ['dashboard_title', config.dashboard_title || defaultConfig.dashboard_title],
        ['company_name', config.company_name || defaultConfig.company_name]
      ])
    });
  }

  // TABLE DATA
  const tableData = [
    { user: 'Alice Johnson', product: 'Laptop', amount: 1200, status: 'Completed', date: '2024-01-28' },
    { user: 'Bob Smith', product: 'Phone', amount: 800, status: 'Processing', date: '2024-01-27' },
    { user: 'Chris Brown', product: 'Tablet', amount: 600, status: 'Shipped', date: '2024-01-27' },
    { user: 'Daisy White', product: 'Monitor', amount: 300, status: 'Pending', date: '2024-01-26' },
    { user: 'Eric Davis', product: 'Keyboard', amount: 120, status: 'Completed', date: '2024-01-26' },
    { user: 'Fiona Miller', product: 'Mouse', amount: 60, status: 'Completed', date: '2024-01-25' },
  ];

  let originalData = [...tableData];
  let currentSort = { column: null, direction: 'asc' };

  // THEME TOGGLE
  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  }

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // SIDEBAR TOGGLE
  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
  }

  document.getElementById('searchInput').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('show');
  });

  // ACTIVE MENU
  function setActive(elem) {
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    elem.classList.add('active');
    document.getElementById('sidebar').classList.remove('show');
  }

  // RENDER TABLE
  function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = data.map(row => `
      <tr>
        <td>${row.user}</td>
        <td>${row.product}</td>
        <td>$${row.amount}</td>
        <td><span style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${row.status}</span></td>
        <td>${row.date}</td>
      </tr>
    `).join('');
  }

  // SEARCH FILTER
  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = originalData.filter(row =>
      row.user.toLowerCase().includes(query) ||
      row.product.toLowerCase().includes(query) ||
      row.status.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });

  // SORT TABLE
  function sortTable(column) {
    const indicators = {
      'user': document.getElementById('userSort'),
      'amount': document.getElementById('amountSort')
    };

    if (currentSort.column === column) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = column;
      currentSort.direction = 'asc';
    }

    Object.keys(indicators).forEach(key => {
      indicators[key].textContent = '';
    });

    if (indicators[column]) {
      indicators[column].textContent = currentSort.direction === 'asc' ? '↑' : '↓';
    }

    const sorted = [...originalData].sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        return currentSort.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return currentSort.direction === 'asc' ? valA - valB : valB - valA;
    });

    originalData = sorted;
    renderTable(sorted);
  }

  // REFRESH DATA
  function refreshData() {
    const btn = document.getElementById('refreshBtn');
    btn.classList.add('spin-on-click');

    // Update KPIs
    document.getElementById('revenue').textContent = '$' + (Math.floor(Math.random() * 40000) + 30000).toLocaleString();
    document.getElementById('orders').textContent = (Math.floor(Math.random() * 1000) + 800).toLocaleString();
    document.getElementById('users').textContent = (Math.floor(Math.random() * 3000) + 2000).toLocaleString();
    document.getElementById('conversion').textContent = (Math.random() * 5 + 1).toFixed(2) + '%';

    // Update chart
    generateChart();

    setTimeout(() => btn.classList.remove('spin-on-click'), 600);
  }

  // GENERATE CHART
  function generateChart() {
    const container = document.getElementById('barsContainer');
    container.innerHTML = '';
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    days.forEach((day, i) => {
      const height = Math.random() * 80 + 20;
      const barWrapper = document.createElement('div');
      barWrapper.style.display = 'flex';
      barWrapper.style.flexDirection = 'column';
      barWrapper.style.alignItems = 'center';
      barWrapper.style.flex = '1';
      barWrapper.innerHTML = `
        <div class="bar" style="height: ${height}%"></div>
        <div class="bar-label">${day}</div>
      `;
      container.appendChild(barWrapper);
    });
  }

  // AUTO REFRESH KPIs EVERY 5 SECONDS
  setInterval(() => {
    document.getElementById('revenue').textContent = '$' + (Math.floor(Math.random() * 40000) + 30000).toLocaleString();
    document.getElementById('orders').textContent = (Math.floor(Math.random() * 1000) + 800).toLocaleString();
    document.getElementById('users').textContent = (Math.floor(Math.random() * 3000) + 2000).toLocaleString();
    document.getElementById('conversion').textContent = (Math.random() * 5 + 1).toFixed(2) + '%';
    generateChart();
  }, 5000);

  // INIT
  renderTable(tableData);
  generateChart();

 function renderChart() {
  const container = document.getElementById("barsContainer");
  if (!container) return;

  // prevent double render
  if (container.children.length > 0) return;

  const revenueData = [120, 180, 90, 220, 160, 200, 140];
  const maxValue = Math.max(...revenueData);

  revenueData.forEach(value => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = (value / maxValue * 100) + "%";
    container.appendChild(bar);
  });
}

document.addEventListener("DOMContentLoaded", renderChart);

function refreshData() {
  // update numbers only
  document.getElementById("revenue").textContent = "$49,200";
  document.getElementById("orders").textContent = "1,301";
  document.getElementById("users").textContent = "3,912";
  document.getElementById("conversion").textContent = "4.31%";

  // 🔥 re-attach chart if DOM was rebuilt
  renderChart();
}

setInterval(refreshData, 5000);