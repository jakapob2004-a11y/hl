// ---------------------------
// ค่า Emission Factor
// ---------------------------

const EF_FUEL = {
  diesel: 2.68,
  gasoline: 2.31,
  gasohol95: 2.20,
  gasohol91: 2.18
};

const EF_LPG = 3.0;
const EF_WASTEWATER = 0.7;
const EF_ELECTRICITY = 0.5;
const EF_WATER = 0.35;
const EF_PAPER = 1.3;
const EF_WASTE = 1.0;

// เก็บข้อมูลรายเดือน
let monthlyRecords = [];

// ---------------------------
// ฟังก์ชันคำนวณ
// ---------------------------

function calcVehicleEmission(fuelType, liters) {
  const ef = EF_FUEL[fuelType] || 0;
  return liters * ef;
}

function calcLPGEmission(kg) {
  return kg * EF_LPG;
}

function calcWastewaterEmission(m3) {
  return m3 * EF_WASTEWATER;
}

function calcElectricityEmission(kWh) {
  return kWh * EF_ELECTRICITY;
}

function calcWaterEmission(m3) {
  return m3 * EF_WATER;
}

function calcPaperEmission(kg) {
  return kg * EF_PAPER;
}

function calcWasteEmission(kg) {
  return kg * EF_WASTE;
}

// ---------------------------
// ฟังก์ชันสร้างกราฟแท่งแนวตั้ง (Stacked Bar Chart)
// ---------------------------
function createVerticalBarChart() {
  if (monthlyRecords.length === 0) {
    return '<p style="text-align: center; color: #999;">ยังไม่มีข้อมูลรายเดือน</p>';
  }

  const maxTotal = Math.max(...monthlyRecords.map(r => r.total));
  const chartHeight = 400;
  const barWidth = 60;
  const gap = 20;
  const totalWidth = monthlyRecords.length * (barWidth + gap) + 100;

  let chartHTML = `
    <div style="margin: 20px 0;">
      <h4>📊 กราฟแท่งเปรียบเทียบรายเดือน (Stacked Bar Chart)</h4>
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; overflow-x: auto;">
        <svg width="${totalWidth}" height="${chartHeight + 80}" style="min-width: 100%;">
          
          <!-- Grid Lines และ Labels -->
          ${[0, 0.25, 0.5, 0.75, 1].map(pct => `
            <line x1="50" y1="${20 + chartHeight * pct}" 
                  x2="${totalWidth - 20}" y2="${20 + chartHeight * pct}" 
                  stroke="#e0e0e0" stroke-width="1" stroke-dasharray="5,5"/>
            <text x="5" y="${20 + chartHeight * pct + 5}" 
                  font-size="12" fill="#666" text-anchor="start">
              ${(maxTotal * (1 - pct)).toFixed(0)}
            </text>
          `).join('')}
          
          <!-- Y-axis -->
          <line x1="50" y1="20" x2="50" y2="${20 + chartHeight}" 
                stroke="#333" stroke-width="2"/>
          
          <!-- X-axis -->
          <line x1="50" y1="${20 + chartHeight}" 
                x2="${totalWidth - 20}" y2="${20 + chartHeight}" 
                stroke="#333" stroke-width="2"/>
          
          <!-- แท่งกราฟ -->
          ${monthlyRecords.map((record, index) => {
            const x = 70 + index * (barWidth + gap);
            const maxHeight = chartHeight - 20;
            
            const height1 = (record.scope1 / maxTotal) * maxHeight;
            const height2 = (record.scope2 / maxTotal) * maxHeight;
            const height3 = (record.scope3 / maxTotal) * maxHeight;
            const totalHeight = height1 + height2 + height3;
            
            const y1 = 20 + chartHeight - totalHeight;
            const y2 = y1 + height1;
            const y3 = y2 + height2;
            
            return `
              <!-- Scope 3 (บน) -->
              <rect x="${x}" y="${y1}" 
                    width="${barWidth}" height="${height3}" 
                    fill="#4CAF50" stroke="#fff" stroke-width="2">
                <title>Scope 3: ${record.scope3.toFixed(2)} kg</title>
              </rect>
              
              <!-- Scope 2 (กลาง) -->
              <rect x="${x}" y="${y2}" 
                    width="${barWidth}" height="${height2}" 
                    fill="#FF9800" stroke="#fff" stroke-width="2">
                <title>Scope 2: ${record.scope2.toFixed(2)} kg</title>
              </rect>
              
              <!-- Scope 1 (ล่าง) -->
              <rect x="${x}" y="${y3}" 
                    width="${barWidth}" height="${height1}" 
                    fill="#2196F3" stroke="#fff" stroke-width="2">
                <title>Scope 1: ${record.scope1.toFixed(2)} kg</title>
              </rect>
              
              <!-- ค่ารวมด้านบน -->
              <text x="${x + barWidth/2}" y="${y1 - 5}" 
                    font-size="12" font-weight="bold" fill="#333" text-anchor="middle">
                ${record.total.toFixed(0)}
              </text>
              
              <!-- ชื่อเดือน -->
              <text x="${x + barWidth/2}" y="${20 + chartHeight + 20}" 
                    font-size="12" fill="#666" text-anchor="middle">
                ${record.month.split('/')[0]}
              </text>
              <text x="${x + barWidth/2}" y="${20 + chartHeight + 35}" 
                    font-size="11" fill="#999" text-anchor="middle">
                ${record.month.split('/')[1]}
              </text>
            `;
          }).join('')}
          
          <!-- Y-axis Label -->
          <text x="10" y="15" font-size="12" font-weight="bold" fill="#666">
            kgCO2e
          </text>
        </svg>
        
        <!-- Legend -->
        <div style="margin-top: 20px; text-align: center;">
          <span style="display: inline-block; margin: 0 15px;">
            <span style="display: inline-block; width: 20px; height: 20px; background: #2196F3; margin-right: 5px; vertical-align: middle; border: 1px solid #ccc;"></span>
            Scope 1 (การปล่อยโดยตรง)
          </span>
          <span style="display: inline-block; margin: 0 15px;">
            <span style="display: inline-block; width: 20px; height: 20px; background: #FF9800; margin-right: 5px; vertical-align: middle; border: 1px solid #ccc;"></span>
            Scope 2 (ไฟฟ้า)
          </span>
          <span style="display: inline-block; margin: 0 15px;">
            <span style="display: inline-block; width: 20px; height: 20px; background: #4CAF50; margin-right: 5px; vertical-align: middle; border: 1px solid #ccc;"></span>
            Scope 3 (การปล่อยทางอ้อม)
          </span>
        </div>
      </div>
    </div>
  `;

  return chartHTML;
}

// ---------------------------
// กราฟแท่งเปรียบเทียบแยก Scope
// ---------------------------
function createGroupedBarChart() {
  if (monthlyRecords.length === 0) return '';

  const maxValue = Math.max(
    ...monthlyRecords.map(r => Math.max(r.scope1, r.scope2, r.scope3))
  );
  
  const chartHeight = 350;
  const barWidth = 25;
  const groupWidth = barWidth * 3 + 20;
  const gap = 30;
  const totalWidth = monthlyRecords.length * (groupWidth + gap) + 100;

  let chartHTML = `
    <div style="margin: 20px 0;">
      <h4>📊 กราฟแท่งเปรียบเทียบแยกตาม Scope (Grouped Bar Chart)</h4>
      <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; overflow-x: auto;">
        <svg width="${totalWidth}" height="${chartHeight + 80}">
          
          <!-- Grid Lines -->
          ${[0, 0.25, 0.5, 0.75, 1].map(pct => `
            <line x1="50" y1="${20 + chartHeight * pct}" 
                  x2="${totalWidth - 20}" y2="${20 + chartHeight * pct}" 
                  stroke="#e0e0e0" stroke-width="1" stroke-dasharray="5,5"/>
            <text x="5" y="${20 + chartHeight * pct + 5}" 
                  font-size="12" fill="#666">
              ${(maxValue * (1 - pct)).toFixed(0)}
            </text>
          `).join('')}
          
          <!-- Axes -->
          <line x1="50" y1="20" x2="50" y2="${20 + chartHeight}" 
                stroke="#333" stroke-width="2"/>
          <line x1="50" y1="${20 + chartHeight}" 
                x2="${totalWidth - 20}" y2="${20 + chartHeight}" 
                stroke="#333" stroke-width="2"/>
          
          <!-- กลุ่มแท่ง -->
          ${monthlyRecords.map((record, index) => {
            const x = 70 + index * (groupWidth + gap);
            const maxHeight = chartHeight - 40;
            
            const height1 = (record.scope1 / maxValue) * maxHeight;
            const height2 = (record.scope2 / maxValue) * maxHeight;
            const height3 = (record.scope3 / maxValue) * maxHeight;
            
            return `
              <!-- Scope 1 -->
              <rect x="${x}" 
                    y="${20 + chartHeight - height1}" 
                    width="${barWidth}" height="${height1}" 
                    fill="#2196F3" opacity="0.9">
                <title>Scope 1: ${record.scope1.toFixed(2)} kg</title>
              </rect>
              <text x="${x + barWidth/2}" 
                    y="${20 + chartHeight - height1 - 3}" 
                    font-size="10" fill="#333" text-anchor="middle">
                ${height1 > 20 ? record.scope1.toFixed(0) : ''}
              </text>
              
              <!-- Scope 2 -->
              <rect x="${x + barWidth + 5}" 
                    y="${20 + chartHeight - height2}" 
                    width="${barWidth}" height="${height2}" 
                    fill="#FF9800" opacity="0.9">
                <title>Scope 2: ${record.scope2.toFixed(2)} kg</title>
              </rect>
              <text x="${x + barWidth + 5 + barWidth/2}" 
                    y="${20 + chartHeight - height2 - 3}" 
                    font-size="10" fill="#333" text-anchor="middle">
                ${height2 > 20 ? record.scope2.toFixed(0) : ''}
              </text>
              
              <!-- Scope 3 -->
              <rect x="${x + barWidth*2 + 10}" 
                    y="${20 + chartHeight - height3}" 
                    width="${barWidth}" height="${height3}" 
                    fill="#4CAF50" opacity="0.9">
                <title>Scope 3: ${record.scope3.toFixed(2)} kg</title>
              </rect>
              <text x="${x + barWidth*2 + 10 + barWidth/2}" 
                    y="${20 + chartHeight - height3 - 3}" 
                    font-size="10" fill="#333" text-anchor="middle">
                ${height3 > 20 ? record.scope3.toFixed(0) : ''}
              </text>
              
              <!-- ชื่อเดือน -->
              <text x="${x + groupWidth/2}" y="${20 + chartHeight + 20}" 
                    font-size="12" fill="#666" text-anchor="middle">
                ${record.month}
              </text>
            `;
          }).join('')}
          
          <text x="10" y="15" font-size="12" font-weight="bold" fill="#666">
            kgCO2e
          </text>
        </svg>
        
        <div style="margin-top: 20px; text-align: center;">
          <span style="display: inline-block; margin: 0 15px;">
            <span style="display: inline-block; width: 20px; height: 20px; background: #2196F3; margin-right: 5px; vertical-align: middle;"></span>
            Scope 1
          </span>
          <span style="display: inline-block; margin: 0 15px;">
            <span style="display: inline-block; width: 20px; height: 20px; background: #FF9800; margin-right: 5px; vertical-align: middle;"></span>
            Scope 2
          </span>
          <span style="display: inline-block; margin: 0 15px;">
            <span style="display: inline-block; width: 20px; height: 20px; background: #4CAF50; margin-right: 5px; vertical-align: middle;"></span>
            Scope 3
          </span>
        </div>
      </div>
    </div>
  `;

  return chartHTML;
}

// ---------------------------
// ตารางสรุป
// ---------------------------
function createSummaryTable() {
  if (monthlyRecords.length === 0) return '';

  const totalScope1 = monthlyRecords.reduce((sum, r) => sum + r.scope1, 0);
  const totalScope2 = monthlyRecords.reduce((sum, r) => sum + r.scope2, 0);
  const totalScope3 = monthlyRecords.reduce((sum, r) => sum + r.scope3, 0);
  const grandTotal = totalScope1 + totalScope2 + totalScope3;

  const avgScope1 = totalScope1 / monthlyRecords.length;
  const avgScope2 = totalScope2 / monthlyRecords.length;
  const avgScope3 = totalScope3 / monthlyRecords.length;
  const avgTotal = grandTotal / monthlyRecords.length;

  return `
    <div style="margin: 20px 0;">
      <h4>📋 ตารางสรุปรายเดือน</h4>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">เดือน</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Scope 1 (kg)</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Scope 2 (kg)</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Scope 3 (kg)</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">รวม (kg)</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${monthlyRecords.map((record, index) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><strong>${record.month}</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right; background: #e3f2fd;">${record.scope1.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right; background: #fff3e0;">${record.scope2.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right; background: #e8f5e9;">${record.scope3.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${record.total.toFixed(2)}</strong></td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                  <button onclick="deleteMonth(${index})" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                    🗑️ ลบ
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #fff9c4; font-weight: bold;">
              <td style="border: 1px solid #ddd; padding: 8px;">รวมทั้งหมด</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${totalScope1.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${totalScope2.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${totalScope3.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${grandTotal.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px;"></td>
            </tr>
            <tr style="background: #e8f5e9;">
              <td style="border: 1px solid #ddd; padding: 8px;">ค่าเฉลี่ย/เดือน</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${avgScope1.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${avgScope2.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${avgScope3.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${avgTotal.toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px;"></td>
            </tr>
            <tr style="background: #e1f5fe;">
              <td style="border: 1px solid #ddd; padding: 8px;">รวมต่อปี (ประมาณ)</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${(avgScope1 * 12).toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${(avgScope2 * 12).toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${(avgScope3 * 12).toFixed(2)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>${(avgTotal * 12).toFixed(2)}</strong> (${(avgTotal * 12 / 1000).toFixed(3)} ตัน)</td>
              <td style="border: 1px solid #ddd; padding: 8px;"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

// ---------------------------
// เพิ่มข้อมูลรายเดือน
// ---------------------------
function addMonthlyData() {
  const monthInput = document.getElementById('monthInput').value;
  const yearInput = document.getElementById('yearInput').value;
  
  if (!monthInput || !yearInput) {
    alert('❌ กรุณาเลือกเดือนและปี');
    return;
  }

  const monthName = `${monthInput}/${yearInput}`;
  
  if (monthlyRecords.some(r => r.month === monthName)) {
    alert('❌ มีข้อมูลเดือนนี้แล้ว กรุณาเลือกเดือนอื่น');
    return;
  }

  const fuelType = document.getElementById('fuelType').value;
  const fuel = parseFloat(document.getElementById('fuelAmount').value) || 0;
  const lpg = parseFloat(document.getElementById('lpgAmount').value) || 0;
  const wastewater = parseFloat(document.getElementById('wastewaterAmount').value) || 0;
  const elec = parseFloat(document.getElementById('electricityAmount').value) || 0;
  const water = parseFloat(document.getElementById('waterAmount').value) || 0;
  const paper = parseFloat(document.getElementById('paperAmount').value) || 0;
  const waste = parseFloat(document.getElementById('wasteAmount').value) || 0;

  const scope1_vehicle = calcVehicleEmission(fuelType, fuel);
  const scope1_lpg = calcLPGEmission(lpg);
  const scope1_wastewater = calcWastewaterEmission(wastewater);
  const scope1_total = scope1_vehicle + scope1_lpg + scope1_wastewater;

  const scope2_total = calcElectricityEmission(elec);

  const scope3_water = calcWaterEmission(water);
  const scope3_paper = calcPaperEmission(paper);
  const scope3_waste = calcWasteEmission(waste);
  const scope3_total = scope3_water + scope3_paper + scope3_waste;

  monthlyRecords.push({
    month: monthName,
    scope1: scope1_total,
    scope2: scope2_total,
    scope3: scope3_total,
    total: scope1_total + scope2_total + scope3_total,
    details: { fuelType, fuel, lpg, wastewater, elec, water, paper, waste }
  });

  monthlyRecords.sort((a, b) => {
    const [monthA, yearA] = a.month.split('/');
    const [monthB, yearB] = b.month.split('/');
    return (yearA + monthA).localeCompare(yearB + monthB);
  });

  displayResults();
  clearInputs();
  
  alert(`✅ เพิ่มข้อมูล ${monthName} เรียบร้อย`);
}

// ---------------------------
// ลบเดือน
// ---------------------------
function deleteMonth(index) {
  if (confirm(`❓ ต้องการลบข้อมูล ${monthlyRecords[index].month} หรือไม่?`)) {
    monthlyRecords.splice(index, 1);
    displayResults();
  }
}

// ---------------------------
// แสดงผล
// ---------------------------
function displayResults() {
  const outputEl = document.getElementById('output');
  
  if (monthlyRecords.length === 0) {
    outputEl.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #999;">
        <div style="font-size: 48px; margin-bottom: 10px;">📊</div>
        <h3>ยังไม่มีข้อมูล</h3>
        <p>กรุณากรอกข้อมูลและกดปุ่ม "เพิ่มข้อมูลรายเดือน"</p>
      </div>
    `;
    return;
  }

  outputEl.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="color: #1976d2; margin-top: 0;">📈 สรุปการปล่อยก๊าซเรือนกระจกรายเดือน</h3>
      
      ${createSummaryTable()}
      
      ${createVerticalBarChart()}
      
      ${createGroupedBarChart()}
      
      <div style="text-align: center; margin-top: 30px;">
        <button onclick="clearAllData()" style="background: #f44336; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; margin: 5px;">
          🗑️ ลบข้อมูลทั้งหมด
        </button>
        <button onclick="exportAllToCSV()" style="background: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; margin: 5px;">
          💾 Export CSV
        </button>
      </div>
    </div>
  `;
}

// ---------------------------
// ลบข้อมูลทั้งหมด
// ---------------------------
function clearAllData() {
  if (confirm('❓ ต้องการลบข้อมูลทั้งหมดหรือไม่?')) {
    monthlyRecords = [];
    displayResults();
    alert('✅ ลบข้อมูลทั้งหมดเรียบร้อย');
  }
}

// ---------------------------
// ล้าง Input
// ---------------------------
function clearInputs() {
  document.getElementById('fuelAmount').value = '';
  document.getElementById('lpgAmount').value = '';
  document.getElementById('wastewaterAmount').value = '';
  document.getElementById('electricityAmount').value = '';
  document.getElementById('waterAmount').value = '';
  document.getElementById('paperAmount').value = '';
  document.getElementById('wasteAmount').value = '';
}

// ---------------------------
// Export CSV
// ---------------------------
function exportAllToCSV() {
  if (monthlyRecords.length === 0) {
    alert('❌ ไม่มีข้อมูลให้ Export');
    return;
  }

  let csv = '\ufeffเดือน,Scope 1 (kg),Scope 2 (kg),Scope 3 (kg),รวม (kg)\n';
  
  monthlyRecords.forEach(record => {
    csv += `${record.month},${record.scope1.toFixed(2)},${record.scope2.toFixed(2)},${record.scope3.toFixed(2)},${record.total.toFixed(2)}\n`;
  });

  const totalScope1 = monthlyRecords.reduce((sum, r) => sum + r.scope1, 0);
  const totalScope2 = monthlyRecords.reduce((sum, r) => sum + r.scope2, 0);
  const totalScope3 = monthlyRecords.reduce((sum, r) => sum + r.scope3, 0);
  const grandTotal = totalScope1 + totalScope2 + totalScope3;

  csv += `\nรวมทั้งหมด,${totalScope1.toFixed(2)},${totalScope2.toFixed(2)},${totalScope3.toFixed(2)},${grandTotal.toFixed(2)}\n`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `carbon_monthly_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  alert('✅ Export ข้อมูลเรียบร้อย');
}

// ---------------------------
// Event Listeners
// ---------------------------
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ โหลดเสร็จแล้ว');
  
  const addBtn = document.getElementById('addMonthBtn');
  if (addBtn) {
    addBtn.addEventListener('click', addMonthlyData);
  }

  // สร้าง dropdown เดือน
  const monthSelect = document.getElementById('monthInput');
  const months = [
    '01-ม.ค.', '02-ก.พ.', '03-มี.ค.', '04-เม.ย.', '05-พ.ค.', '06-มิ.ย.', 
    '07-ก.ค.', '08-ส.ค.', '09-ก.ย.', '10-ต.ค.', '11-พ.ย.', '12-ธ.ค.'
  ];
  
  months.forEach(month => {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  // สร้าง dropdown ปี
  const yearSelect = document.getElementById('yearInput');
  const currentYear = new Date().getFullYear() + 543;
  for (let year = currentYear - 5; year <= currentYear + 1; year++) {
    const option =document.createElement('option');
    option.value = year;
    option.textContent = year;
    if (year === currentYear) option.selected = true;
    yearSelect.appendChild(option);
  }

  displayResults();
});