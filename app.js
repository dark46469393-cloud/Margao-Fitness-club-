(() => {
  // Application State
  const state = {
    selectedMonth: "2026-11",
    selectedClass: "ALL",
    searchQuery: "",
    growthPoints: [],
    attendanceBars: []
  };

  // DOM References
  const els = {
    monthFilter: document.getElementById("monthFilter"),
    classFilter: document.getElementById("classFilter"),
    resetClassBtn: document.getElementById("resetClassBtn"),
    exportCsvBtn: document.getElementById("exportCsvBtn"),
    memberSearch: document.getElementById("memberSearch"),
    kpiActiveValue: document.getElementById("kpiActiveValue"),
    kpiActiveTrend: document.getElementById("kpiActiveTrend"),
    kpiActiveSub: document.getElementById("kpiActiveSub"),
    kpiJoinersValue: document.getElementById("kpiJoinersValue"),
    kpiJoinersSub: document.getElementById("kpiJoinersSub"),
    kpiAttendanceValue: document.getElementById("kpiAttendanceValue"),
    kpiAttendanceSub: document.getElementById("kpiAttendanceSub"),
    kpiRevenueValue: document.getElementById("kpiRevenueValue"),
    kpiRevenueSub: document.getElementById("kpiRevenueSub"),
    growthChartSub: document.getElementById("growthChartSub"),
    classChartSub: document.getElementById("classChartSub"),
    growthCanvas: document.getElementById("growthCanvas"),
    attendanceCanvas: document.getElementById("attendanceCanvas"),
    growthTooltip: document.getElementById("growthTooltip"),
    attendanceTooltip: document.getElementById("attendanceTooltip"),
    membersTableBody: document.getElementById("membersTableBody"),
    tableSummary: document.getElementById("tableSummary")
  };

  // Formatters
  const formatINR = (amount) =>
    "₹" + Number(amount).toLocaleString("en-IN");

  const getMonthEndDate = (monthKey) => {
    const [year, month] = monthKey.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return `${monthKey}-${String(lastDay).padStart(2, "0")}`;
  };

  const getMonthStartDate = (monthKey) => `${monthKey}-01`;

  const daysBetween = (dateA, dateB) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((new Date(dateB) - new Date(dateA)) / msPerDay);
  };

  // Core Filtering & Metric Aggregation
  function getFilteredData() {
    const { selectedMonth, selectedClass, searchQuery } = state;

    // 1. Class-filtered members
    const classMembers = GYM_DATA.members.filter(
      (m) => selectedClass === "ALL" || m.primaryClass === selectedClass
    );

    // 2. Active & Period Members
    let periodMembers;
    let activeCount;
    let prevActiveCount;

    if (selectedMonth === "ALL") {
      periodMembers = classMembers.filter(
        (m) => m.expiryDate >= GYM_DATA.referenceDate
      );
      activeCount = periodMembers.length;
      const juneEnd = getMonthEndDate("2026-06");
      prevActiveCount = classMembers.filter(
        (m) => m.joinDate <= juneEnd && m.expiryDate >= getMonthStartDate("2026-06")
      ).length;
    } else {
      const mStart = getMonthStartDate(selectedMonth);
      const mEnd = getMonthEndDate(selectedMonth);
      periodMembers = classMembers.filter(
        (m) => m.joinDate <= mEnd && m.expiryDate >= mStart
      );
      activeCount = periodMembers.length;

      const idx = GYM_DATA.months.findIndex((m) => m.key === selectedMonth);
      if (idx > 0) {
        const prevKey = GYM_DATA.months[idx - 1].key;
        prevActiveCount = classMembers.filter(
          (m) =>
            m.joinDate <= getMonthEndDate(prevKey) &&
            m.expiryDate >= getMonthStartDate(prevKey)
        ).length;
      } else {
        prevActiveCount = activeCount;
      }
    }

    // 3. New Joiners in selected month (or entire 6-month window)
    const newJoiners = classMembers.filter((m) =>
      selectedMonth === "ALL"
        ? m.joinDate >= "2026-06-01" && m.joinDate <= "2026-11-30"
        : m.joinDate.startsWith(selectedMonth)
    );

    // 4. Revenue in selected month (or all 6 months)
    const paidRecords = classMembers.filter((m) =>
      selectedMonth === "ALL" ? true : m.paymentMonth === selectedMonth
    );
    const totalRevenue = paidRecords.reduce((sum, m) => sum + m.feePaid, 0);

    // 5. Attendance records
    const filteredAttendance = GYM_DATA.attendance.filter((rec) => {
      const matchMonth =
        selectedMonth === "ALL" || rec.month === selectedMonth;
      const matchClass =
        selectedClass === "ALL" || rec.className === selectedClass;
      return matchMonth && matchClass;
    });

    const totalCheckIns = filteredAttendance.reduce(
      (sum, r) => sum + r.checkIns,
      0
    );
    const totalCapacity = filteredAttendance.reduce(
      (sum, r) => sum + r.capacity,
      0
    );
    const attendanceRate =
      totalCapacity > 0 ? Math.round((totalCheckIns / totalCapacity) * 100) : 0;

    // 6. Monthly series for Growth Line Chart (respects selectedClass)
    const growthSeries = GYM_DATA.months.map((mObj) => {
      const mStart = getMonthStartDate(mObj.key);
      const mEnd = getMonthEndDate(mObj.key);
      const active = classMembers.filter(
        (m) => m.joinDate <= mEnd && m.expiryDate >= mStart
      ).length;
      const joined = classMembers.filter((m) =>
        m.joinDate.startsWith(mObj.key)
      ).length;
      return { ...mObj, active, joined };
    });

    // 7. Class attendance series for Bar Chart (respects selectedMonth)
    const barSeries = GYM_DATA.classes.map((cls) => {
      const recs = GYM_DATA.attendance.filter(
        (r) =>
          r.className === cls &&
          (selectedMonth === "ALL" || r.month === selectedMonth)
      );
      const checkIns = recs.reduce((s, r) => s + r.checkIns, 0);
      const capacity = recs.reduce((s, r) => s + r.capacity, 0);
      const pct = capacity > 0 ? Math.round((checkIns / capacity) * 100) : 0;
      return { className: cls, checkIns, capacity, pct };
    });

    // 8. Table rows: include expiring/recently expired members in scope, sorted by expiryDate ASC
    const q = searchQuery.trim().toLowerCase();
    const tableMembers = classMembers
      .filter((m) => {
        if (selectedMonth !== "ALL") {
          const mStart = getMonthStartDate(selectedMonth);
          const mEnd = getMonthEndDate(selectedMonth);
          const inScope = m.joinDate <= mEnd && m.expiryDate >= mStart;
          if (!inScope) return false;
        }
        if (!q) return true;
        return (
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.plan.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));

    return {
      activeCount,
      prevActiveCount,
      newJoinersCount: newJoiners.length,
      totalRevenue,
      transactionCount: paidRecords.length,
      attendanceRate,
      totalCheckIns,
      totalCapacity,
      growthSeries,
      barSeries,
      tableMembers
    };
  }

  // Update KPI Cards
  function renderKPIs(data) {
    els.kpiActiveValue.textContent = data.activeCount;
    const diff = data.activeCount - data.prevActiveCount;
    const pctChange =
      data.prevActiveCount > 0
        ? ((diff / data.prevActiveCount) * 100).toFixed(1)
        : "0.0";
    els.kpiActiveTrend.textContent = `${diff >= 0 ? "+" : ""}${pctChange}%`;
    els.kpiActiveTrend.className = `badge ${diff >= 0 ? "badge-up" : "badge-danger"}`;
    els.kpiActiveSub.textContent =
      state.selectedMonth === "ALL"
        ? "Currently active as of Nov 2026"
        : `Active during ${state.selectedMonth}`;

    els.kpiJoinersValue.textContent = data.newJoinersCount;
    els.kpiJoinersSub.textContent =
      state.selectedClass === "ALL"
        ? "Across all fitness programs"
        : `Enrolled in ${state.selectedClass}`;

    els.kpiAttendanceValue.textContent = `${data.attendanceRate}%`;
    els.kpiAttendanceSub.textContent = `${data.totalCheckIns.toLocaleString("en-IN")} / ${data.totalCapacity.toLocaleString("en-IN")} slots`;

    els.kpiRevenueValue.textContent = formatINR(data.totalRevenue);
    els.kpiRevenueSub.textContent = `From ${data.transactionCount} paid invoice${data.transactionCount === 1 ? "" : "s"}`;

    els.resetClassBtn.hidden = state.selectedClass === "ALL";
  }

  // Retina-ready Canvas Setup
  function prepareCanvas(canvas) {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  }

  // Chart 1: Pure Canvas Line Chart (Membership Growth)
  function drawGrowthChart(series) {
    const { ctx, width, height } = prepareCanvas(els.growthCanvas);
    ctx.clearRect(0, 0, width, height);

    const pad = { top: 20, right: 20, bottom: 34, left: 40 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const maxVal = Math.max(...series.map((s) => s.active), 10);
    const yMax = Math.ceil(maxVal / 5) * 5 + 5;
    const gridLines = 4;

    // Horizontal Grid & Y Labels
    ctx.font = "11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= gridLines; i++) {
      const val = Math.round((yMax / gridLines) * i);
      const y = pad.top + chartH - (val / yMax) * chartH;

      ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.fillText(val, pad.left - 8, y);
    }

    // Compute coordinates
    const stepX = series.length > 1 ? chartW / (series.length - 1) : chartW / 2;
    state.growthPoints = series.map((item, i) => {
      const x = pad.left + i * stepX;
      const yActive = pad.top + chartH - (item.active / yMax) * chartH;
      const yJoined = pad.top + chartH - (item.joined / yMax) * chartH;
      return { ...item, x, yActive, yJoined };
    });

    // Area gradient under Active Members line
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, "rgba(16, 185, 129, 0.28)");
    grad.addColorStop(1, "rgba(16, 185, 129, 0.0)");

    ctx.beginPath();
    state.growthPoints.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.yActive);
      else ctx.lineTo(pt.x, pt.yActive);
    });
    const lastPt = state.growthPoints[state.growthPoints.length - 1];
    const firstPt = state.growthPoints[0];
    ctx.lineTo(lastPt.x, pad.top + chartH);
    ctx.lineTo(firstPt.x, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw Active Members Line
    ctx.beginPath();
    state.growthPoints.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.yActive);
      else ctx.lineTo(pt.x, pt.yActive);
    });
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // Draw New Joiners Line (Dashed Amber)
    ctx.beginPath();
    ctx.setLineDash([5, 4]);
    state.growthPoints.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.yJoined);
      else ctx.lineTo(pt.x, pt.yJoined);
    });
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Points & X-axis Labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    state.growthPoints.forEach((pt) => {
      const isSelected = pt.key === state.selectedMonth;

      // Active dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.yActive, isSelected ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? "#34d399" : "#10b981";
      ctx.fill();
      if (isSelected) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Joined dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.yJoined, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = "#f59e0b";
      ctx.fill();

      // X-axis month label
      ctx.fillStyle = isSelected ? "#f1f5f9" : "#94a3b8";
      ctx.font = isSelected ? "bold 11px sans-serif" : "11px sans-serif";
      ctx.fillText(pt.short, pt.x, pad.top + chartH + 10);
    });
  }

  // Chart 2: Pure Canvas Bar Chart (Attendance by Class)
  function drawAttendanceChart(barSeries) {
    const { ctx, width, height } = prepareCanvas(els.attendanceCanvas);
    ctx.clearRect(0, 0, width, height);

    const pad = { top: 20, right: 16, bottom: 42, left: 42 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const maxCheckIns = Math.max(...barSeries.map((b) => b.checkIns), 50);
    const yMax = Math.ceil(maxCheckIns / 100) * 100;
    const gridLines = 4;

    ctx.font = "11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= gridLines; i++) {
      const val = Math.round((yMax / gridLines) * i);
      const y = pad.top + chartH - (val / yMax) * chartH;

      ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.fillText(val, pad.left - 8, y);
    }

    const slotW = chartW / barSeries.length;
    const barW = Math.min(42, slotW * 0.56);
    state.attendanceBars = [];

    barSeries.forEach((item, i) => {
      const x = pad.left + i * slotW + (slotW - barW) / 2;
      const barH = (item.checkIns / yMax) * chartH;
      const y = pad.top + chartH - barH;

      const isSelected = state.selectedClass === item.className;
      const isDimmed =
        state.selectedClass !== "ALL" && state.selectedClass !== item.className;

      // Rounded top bar
      ctx.save();
      ctx.fillStyle = isSelected
        ? "#10b981"
        : isDimmed
        ? "rgba(56, 189, 248, 0.25)"
        : "#38bdf8";

      const r = Math.min(6, barW / 2);
      ctx.beginPath();
      ctx.moveTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + barH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Percentage label above bar
      ctx.fillStyle = isDimmed ? "#64748b" : "#e2e8f0";
      ctx.font = "bold 10.5px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(`${item.pct}%`, x + barW / 2, y - 4);

      // X-axis class label (abbreviated on narrow screens)
      ctx.fillStyle = isSelected ? "#10b981" : "#94a3b8";
      ctx.font = isSelected ? "bold 11px sans-serif" : "11px sans-serif";
      ctx.textBaseline = "top";
      const label =
        width < 430 && item.className === "Strength Training"
          ? "Strength"
          : item.className;
      ctx.fillText(label, x + barW / 2, pad.top + chartH + 10);

      state.attendanceBars.push({
        ...item,
        x,
        y,
        w: barW,
        h: barH
      });
    });
  }

  // Render Expiring Memberships Table
  function renderTable(members) {
    els.tableSummary.textContent = `Showing ${members.length} member${members.length === 1 ? "" : "s"} sorted by expiry date`;

    if (members.length === 0) {
      els.membersTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; color:#94a3b8; padding:24px;">
            No memberships match the active filter criteria.
          </td>
        </tr>`;
      return;
    }

    els.membersTableBody.innerHTML = members
      .map((m) => {
        const daysLeft = daysBetween(GYM_DATA.referenceDate, m.expiryDate);
        let statusBadge;
        if (daysLeft < 0) {
          statusBadge = `<span class="badge badge-danger">Expired (${Math.abs(daysLeft)}d ago)</span>`;
        } else if (daysLeft <= 15) {
          statusBadge = `<span class="badge badge-warn">Expiring in ${daysLeft}d</span>`;
        } else {
          statusBadge = `<span class="badge badge-up">Active (${daysLeft}d left)</span>`;
        }

        return `
          <tr>
            <td class="mono">${m.id}</td>
            <td><strong>${m.name}</strong></td>
            <td>${m.primaryClass}</td>
            <td>${m.plan}</td>
            <td class="mono">${m.expiryDate}</td>
            <td>${formatINR(m.feePaid)}</td>
            <td>${statusBadge}</td>
          </tr>
        `;
      })
      .join("");
  }

  // Export Filtered Table Data to CSV
  function exportFilteredCSV() {
    const { tableMembers } = getFilteredData();
    const headers = [
      "Member ID",
      "Name",
      "Primary Class",
      "Plan",
      "Join Date",
      "Expiry Date",
      "Fee Paid (INR)",
      "Payment Month",
      "Status"
    ];

    const rows = tableMembers.map((m) => {
      const daysLeft = daysBetween(GYM_DATA.referenceDate, m.expiryDate);
      const status =
        daysLeft < 0
          ? "Expired"
          : daysLeft <= 15
          ? `Expiring in ${daysLeft} days`
          : "Active";

      return [
        m.id,
        `"${m.name.replace(/"/g, '""')}"`,
        `"${m.primaryClass}"`,
        `"${m.plan}"`,
        m.joinDate,
        m.expiryDate,
        m.feePaid,
        m.paymentMonth,
        `"${status}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const classTag = state.selectedClass.toLowerCase().replace(/\s+/g, "-");
    link.href = url;
    link.download = `margao-gym-${state.selectedMonth}-${classTag}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Canvas Hover & Click Interactivity
  function bindCanvasInteractions() {
    // Line chart hover
    els.growthCanvas.addEventListener("mousemove", (e) => {
      const rect = els.growthCanvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      let nearest = null;
      let minDist = 28;

      state.growthPoints.forEach((pt) => {
        const d = Math.abs(mx - pt.x);
        if (d < minDist) {
          minDist = d;
          nearest = pt;
        }
      });

      if (nearest) {
        els.growthTooltip.hidden = false;
        els.growthTooltip.innerHTML = `
          <strong>${nearest.label}</strong><br/>
          Active Members: <b>${nearest.active}</b><br/>
          New Joiners: <b>${nearest.joined}</b>
        `;
        const left = Math.min(nearest.x + 10, rect.width - 145);
        const top = Math.max(nearest.yActive - 56, 8);
        els.growthTooltip.style.left = `${left}px`;
        els.growthTooltip.style.top = `${top}px`;
      } else {
        els.growthTooltip.hidden = true;
      }
    });

    els.growthCanvas.addEventListener("mouseleave", () => {
      els.growthTooltip.hidden = true;
    });

    // Bar chart hover & click-to-filter
    els.attendanceCanvas.addEventListener("mousemove", (e) => {
      const rect = els.attendanceCanvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const hovered = state.attendanceBars.find(
        (b) => mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h
      );

      if (hovered) {
        els.attendanceCanvas.style.cursor = "pointer";
        els.attendanceTooltip.hidden = false;
        els.attendanceTooltip.innerHTML = `
          <strong>${hovered.className}</strong><br/>
          Check-ins: <b>${hovered.checkIns}</b> / ${hovered.capacity}<br/>
          Utilization: <b>${hovered.pct}%</b>
        `;
        const left = Math.min(hovered.x, rect.width - 150);
        const top = Math.max(hovered.y - 58, 8);
        els.attendanceTooltip.style.left = `${left}px`;
        els.attendanceTooltip.style.top = `${top}px`;
      } else {
        els.attendanceCanvas.style.cursor = "default";
        els.attendanceTooltip.hidden = true;
      }
    });

    els.attendanceCanvas.addEventListener("mouseleave", () => {
      els.attendanceTooltip.hidden = true;
    });

    els.attendanceCanvas.addEventListener("click", (e) => {
      const rect = els.attendanceCanvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const clicked = state.attendanceBars.find(
        (b) => mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h
      );

      if (clicked) {
        state.selectedClass =
          state.selectedClass === clicked.className ? "ALL" : clicked.className;
        els.classFilter.value = state.selectedClass;
        updateDashboard();
      }
    });
  }

  // Master Render Pipeline
  function updateDashboard() {
    const data = getFilteredData();
    renderKPIs(data);
    drawGrowthChart(data.growthSeries);
    drawAttendanceChart(data.barSeries);
    renderTable(data.tableMembers);
  }

  // Event Listeners
  els.monthFilter.addEventListener("change", (e) => {
    state.selectedMonth = e.target.value;
    updateDashboard();
  });

  els.classFilter.addEventListener("change", (e) => {
    state.selectedClass = e.target.value;
    updateDashboard();
  });

  els.resetClassBtn.addEventListener("click", () => {
    state.selectedClass = "ALL";
    els.classFilter.value = "ALL";
    updateDashboard();
  });

  els.memberSearch.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    updateDashboard();
  });

  els.exportCsvBtn.addEventListener("click", exportFilteredCSV);
  window.addEventListener("resize", updateDashboard);

  // Initialize
  bindCanvasInteractions();
  updateDashboard();
})();