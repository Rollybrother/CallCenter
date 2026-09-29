document.addEventListener("DOMContentLoaded", function () {
    const filterSection = document.getElementById("filter-section");

    // 버튼 그룹 생성
    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("button-group");

    // "수정" 버튼 생성
    const editButton = document.createElement("button");
    editButton.id = "editBtn";
    editButton.textContent = "수정";
    buttonGroup.appendChild(editButton);

    // "삭제" 버튼 생성
    const deleteButton = document.createElement("button");
    deleteButton.id = "deleteBtn";
    deleteButton.textContent = "삭제";
    buttonGroup.appendChild(deleteButton);

    // "엑셀 다운로드" 버튼 생성
    const excelDownloadButton = document.createElement("button");
    excelDownloadButton.id = "excelDownloadBtn";
    excelDownloadButton.textContent = "엑셀 다운로드";
    buttonGroup.appendChild(excelDownloadButton);

    // "그래프 생성" 버튼 생성
    const graphButton = document.createElement("button");
    graphButton.id = "generateGraphButton";
    graphButton.textContent = "그래프 생성";
    buttonGroup.appendChild(graphButton);

    // "인쇄" 버튼 생성
    const printButton = document.createElement("button");
    printButton.id = "printBtn";
    printButton.textContent = "인쇄";
    buttonGroup.appendChild(printButton);

    // 버튼 그룹을 filter-section 아래에 추가
    document.getElementById("table-actions").appendChild(buttonGroup);

    // "인쇄" 버튼 클릭 이벤트
    printButton.addEventListener("click", function () {
        printTableAndGraph(); // 테이블 인쇄 함수 호출
    });

    // 조회 표와 그래프를 한 장의 A4 가로 용지에 맞춘다.
    function printTableAndGraph() {
        const table = document.querySelector("#data-table table").cloneNode(true);
        const tbody = table.querySelector("tbody");
        const rows = Array.from(tbody.querySelectorAll("tr:not(#summary-row)"));
        const selected = rows.filter(row => row.querySelector(".row-checkbox")?.checked);

        // 선택한 행이 있으면 선택분만, 없으면 조회 결과 전체를 인쇄한다.
        if (selected.length) {
            rows.forEach(row => { if (!row.querySelector(".row-checkbox")?.checked) row.remove(); });
        }
        // 표를 복제할 때 합계 행도 함께 복제되므로 다시 추가하지 않는다.
        table.querySelectorAll("input[type='checkbox']").forEach(checkbox => checkbox.remove());

        const graphCanvas = document.getElementById("lineGraph");
        const graphImage = graphCanvas ? graphCanvas.toDataURL("image/png") : null;
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            alert("인쇄 창을 열 수 없습니다. 팝업 차단을 해제해 주세요.");
            return;
        }
        printWindow.document.write(`
            <!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>콜센터 통계 인쇄</title>
            <style>
                @page { size: A4 landscape; margin: 7mm; }
                html, body { margin: 0; padding: 0; }
                #printPage { position: relative; width: 280mm; height: 194mm; overflow: hidden; page-break-after: avoid; break-after: avoid; }
                #printContent { position: absolute; top: 0; left: 0; width: 1120px; transform-origin: top left; font-family: "Malgun Gothic", Arial, sans-serif; color: #172b41; }
                .main-title { text-align: center; font-size: 21px; font-weight: 800; margin: 0 0 8px; }
                .sub-title { font-size: 12px; font-weight: 700; margin: 0 0 8px; }
                table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 10px; line-height: 1.15; }
                th, td { border: 1px solid #344a59; text-align: center; padding: 3px 2px; white-space: nowrap; overflow: hidden; }
                th { background: #edf5f5; font-weight: 800; }
                td { font-weight: 600; }
                th:first-child, td:first-child { width: 94px; }
                #summary-row { background: #e4f2ed; font-weight: 800; }
                .graph-title { font-size: 12px; font-weight: 800; text-align: center; margin: 12px 0 2px; }
                .graph-image { display: block; width: 100%; height: 220px; object-fit: contain; }
            </style></head><body>
            <div id="printPage"><div id="printContent">
                <div class="main-title">콜센터 통계</div>
                <div class="sub-title">${window.queryType || "조회 결과"}</div>
                ${table.outerHTML}
                ${graphImage ? `<div class="graph-title">그래프</div><img class="graph-image" src="${graphImage}" alt="운영 추이">` : ""}
            </div></div>
            <script>
                window.onload = async function () {
                    await document.fonts.ready;
                    requestAnimationFrame(function () { requestAnimationFrame(function () {
                        const page = document.getElementById('printPage');
                        const content = document.getElementById('printContent');
                        const scale = Math.min(1,
                            (page.clientWidth - 8) / content.scrollWidth,
                            (page.clientHeight - 8) / content.scrollHeight);
                        content.style.transform = 'scale(' + scale + ')';
                        window.print();
                    }); });
                };
                window.onafterprint = function () { window.close(); };
            <\/script></body></html>
        `);
        printWindow.document.close();
    }

    // "수정" 버튼 클릭 이벤트
    editButton.addEventListener("click", function () {
        const checkedRows = document.querySelectorAll("#data-body .row-checkbox:checked");
        if (checkedRows.length === 0) {
            alert("수정할 데이터를 선택해주세요.");
            return;
        }

        if (editButton.textContent === "수정") {
            // 수정 가능 상태로 변경
            checkedRows.forEach((checkbox) => {
                const row = checkbox.closest("tr");
                const editableCells = row.querySelectorAll("td[data-editable='true']");

                editableCells.forEach((cell) => {
                    cell.setAttribute("contenteditable", "true");
                    cell.style.border = "1px solid #ccc"; // 수정 가능 상태에서 테두리 추가
                });

                checkbox.disabled = true; // 수정 중에는 체크박스 비활성화
            });
            editButton.textContent = "수정완료";
        } else {
            // 수정 완료 처리
            checkedRows.forEach((checkbox) => {
                const row = checkbox.closest("tr");
                const editableCells = row.querySelectorAll("td[data-editable='true']");
                const updatedData = {};

                // 수정된 데이터 수집
                editableCells.forEach((cell) => {
                    const value = cell.textContent.trim();
                    const fieldName = cell.dataset.field;

                    // data-field 속성이 없는 경우 경고 로그 출력 및 건너뛰기
                    if (!fieldName) {
                        console.warn("data-field 속성이 누락된 셀이 있습니다:", cell);
                        return;
                    }

                    // 값 변환 및 NaN 방지
                    updatedData[fieldName] = isNaN(parseInt(value)) ? 0 : parseInt(value);
                });

                if (Object.keys(updatedData).length === 0) {
                    checkbox.disabled = false;
                    return;
                }

                // date 필드를 추가
                updatedData["date"] = row.dataset.date;

                // 서버 요청
                fetch(`/api/statistics/deleteByDate?date=${updatedData["date"]}`, {
                    method: "DELETE",
                })
                    .then(() =>
                        fetch(`/api/statistics`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(updatedData),
                        })
                    )
                    .then((response) => {
                        if (response.ok) {
                            // 수정된 데이터로 테이블 업데이트
                            const manInCall = parseInt(updatedData["manInCall"]);
                            const manResCall = parseInt(updatedData["manResCall"]);
                            const manAcptCall = parseInt(updatedData["manAcptCall"]);
                            const voiceInCall = parseInt(updatedData["voiceInCall"]);
                            const voiceAcptCall = parseInt(updatedData["voiceAcptCall"]);
                            const chatInCall = parseInt(updatedData["chatInCall"]);
                            const chatAcptCall = parseInt(updatedData["chatAcptCall"]);
                            const chattingIn = parseInt(updatedData["chattingIn"]);
                            const chattingAcpt = parseInt(updatedData["chattingAcpt"]);
                            const innerAcpt = parseInt(updatedData["innerAcpt"]);
                            const onlineAcptCall = parseInt(updatedData["onlineAcptCall"]);
                            const faxAcpt = parseInt(updatedData["faxAcpt"]);
                            

                            // 계산된 값
                            const manResRate = manInCall > 0 ? ((manResCall / manInCall) * 100).toFixed(1) : "0.0";
                            const totalInCall = manInCall + voiceInCall + chatInCall + chattingIn;
        					const totalResCall = manResCall + voiceInCall + chatInCall + chattingIn;
                            const totalResRate = totalInCall > 0 ? ((totalResCall / totalInCall) * 100).toFixed(1) : "0.0";
                            const totalAcptCall = manAcptCall + voiceAcptCall + chatAcptCall + chattingAcpt + onlineAcptCall + faxAcpt + innerAcpt;
                            const totalAcptRate = totalResCall > 0 ? ((totalAcptCall / totalResCall) * 100).toFixed(1) : "0.0";

                            // 테이블 업데이트
                            row.innerHTML = `
                                <td>
                                    <input type="checkbox" class="row-checkbox"> ${updatedData["date"]}
                                </td>
                                <td data-editable="true" data-field="manInCall">${manInCall}</td>
                                <td data-editable="true" data-field="manResCall">${manResCall}</td>
					        	<td>${manResRate}%</td>
					        	<td data-editable="true" data-field="manAcptCall">${manAcptCall}</td>
						        <td data-editable="true" data-field="voiceInCall">${voiceInCall}</td>
						        <td data-editable="true" data-field="voiceAcptCall">${voiceAcptCall}</td>
						        <td data-editable="true" data-field="chatInCall">${chatInCall}</td>
						        <td data-editable="true" data-field="chatAcptCall">${chatAcptCall}</td>
						        <td data-editable="true" data-field="chattingIn">${chattingIn}</td>
						        <td data-editable="true" data-field="chattingAcpt">${chattingAcpt}</td>
						        <td data-editable="true" data-field="innerAcpt">${innerAcpt}</td>
						        <td data-editable="true" data-field="onlineAcptCall">${onlineAcptCall}</td>
						        <td data-editable="true" data-field="faxAcpt">${faxAcpt}</td>
						        
						        <td>${totalInCall}</td>
						        <td>${totalResCall}</td>
						        <td>${totalResRate}%</td>
						        <td>${totalAcptCall}</td>
						        <td>${totalAcptRate}%</td>
                            `;

                            // 기존 합계 행 제거 후 새로 추가
                            const summaryRow = document.getElementById("summary-row");
                            if (summaryRow) summaryRow.remove(); // 기존 합계 행 제거
                            calculateAndRenderTotalRow(); // 새 합계 행 추가
                        } else {
                            alert("수정 중 오류가 발생했습니다.");
                        }
                    })
                    .catch((error) => console.error("Error:", error));

                checkbox.disabled = false; // 체크박스 다시 활성화
            });
            editButton.textContent = "수정";
        }
    });
	
    // "삭제" 버튼 클릭 이벤트
    deleteButton.addEventListener("click", function () {
        const checkedRows = document.querySelectorAll("#data-body .row-checkbox:checked");
        if (checkedRows.length === 0) {
            alert("삭제할 데이터를 선택해주세요.");
            return;
        }
        if (confirm("삭제하시겠습니까?")) {
            checkedRows.forEach((checkbox) => {
                const row = checkbox.closest("tr");
                const date = row.dataset.date; // 행의 데이터에서 날짜 값 가져오기

                // 서버에 삭제 요청
                fetch(`/api/statistics/deleteByDate?date=${date}`, {
                    method: "DELETE",
                })
                    .then((response) => {
                        if (response.ok) {
                            row.remove(); // 화면에서 행 삭제

                            // 기존 합계 행 제거 후 새로 추가
                            const summaryRow = document.getElementById("summary-row");
                            if (summaryRow) summaryRow.remove(); // 기존 합계 행 제거
                            calculateAndRenderTotalRow(); // 새 합계 행 추가
                        } else {
                            alert("삭제 중 오류가 발생했습니다.");
                        }
                    })
                    .catch((error) => console.error("Error:", error));
            });
        }
    });
	
    // 엑셀 다운로드 버튼 클릭 이벤트
	excelDownloadButton.addEventListener("click", function () {
	    // 테이블 데이터를 수집
	    const tableData = [];
	    const rows = document.querySelectorAll("#data-body tr");
	
	    rows.forEach((row) => {
	        const cells = row.querySelectorAll("td");
	        const rowData = {
	            date: cells[0].textContent.trim(),
	            manInCall: parseInt(cells[1].textContent.trim()) || 0,
	            manResCall: parseInt(cells[2].textContent.trim()) || 0,
	            manResRate: cells[3].textContent.trim(), 
	            manAcptCall: parseInt(cells[4].textContent.trim()) || 0,
	            voiceInCall: parseInt(cells[5].textContent.trim()) || 0,
	            voiceAcptCall: parseInt(cells[6].textContent.trim()) || 0,
	            chatInCall: parseInt(cells[7].textContent.trim()) || 0,
	            chatAcptCall: parseInt(cells[8].textContent.trim()) || 0,
	            chattingIn: parseInt(cells[9].textContent.trim()) || 0,
	            chattingAcpt: parseInt(cells[10].textContent.trim()) || 0,
	            innerAcpt: parseInt(cells[11].textContent.trim()) || 0,
	            onlineAcptCall: parseInt(cells[12].textContent.trim()) || 0,
	            faxAcpt: parseInt(cells[13].textContent.trim()) || 0,
	            totalInCall: parseInt(cells[14].textContent.trim()) || 0,
	            totalResCall: parseInt(cells[15].textContent.trim()) || 0,
	            totalResRate: cells[16].textContent.trim(),
	            totalAcptCall: parseInt(cells[17].textContent.trim()) || 0,
	            totalAcptRate: cells[18].textContent.trim(), 
	        };
	        tableData.push(rowData);
	    });

	    // 서버로 데이터 전송
	    fetch("/api/statistics/excelDownload", {
	        method: "POST",
	        headers: {
	            "Content-Type": "application/json",
	        },
	        body: JSON.stringify(tableData),
	    })
	        .then((response) => {
	            if (!response.ok) {
	                throw new Error("엑셀 다운로드에 실패했습니다.");
	            }
	            return response.blob();
	        })
	        .then((blob) => {
	            const url = window.URL.createObjectURL(blob);
	            const a = document.createElement("a");
	            a.href = url;
	            a.download = "조회결과.xlsx";
	            document.body.appendChild(a);
	            a.click();
	            a.remove();
	        })
	        .catch((error) => {
	            console.error("Error:", error);
	            alert("엑셀 다운로드 중 오류가 발생했습니다.");
	        });
	});
	
	graphButton.addEventListener("click", function () {
	    generateGraph(); // 그래프 생성 함수 호출
	});
	
	// 그래프 생성 함수
	async function generateGraph() {
	    const tbody = document.getElementById("data-body");
	    const rows = Array.from(tbody.querySelectorAll("tr"));
	
	    const labels = [];
	    const totalInCall = [];
	    const totalResCall = [];
	    const totalAcptCall = [];
	    const yearChangeDates = [];

	    rows.forEach(row => {
	        const checkbox = row.querySelector("input[type='checkbox']");
	        if (checkbox && checkbox.checked) {
	            const dateCell = row.querySelector("td");
	            if (!dateCell) return;

	            const date = dateCell.textContent.trim();
	            const inCall = parseInt(row.children[14]?.textContent) || 0;
	            const resCall = parseInt(row.children[15]?.textContent) || 0;
	            const acptCall = parseInt(row.children[17]?.textContent) || 0;

	            labels.push(date);
	            totalInCall.push(inCall);
	            totalResCall.push(resCall);
	            totalAcptCall.push(acptCall);
	
	            if (/^\d{4}0101$/.test(date) || /^\d{4}01$/.test(date)) {
	                yearChangeDates.push(date);
	            }
	        }
	    });
	
	    let annotationPlugin = window['chartjs-plugin-annotation'];
	    if (annotationPlugin) {
	        Chart.register(annotationPlugin);
	        console.log("✅ Chart Annotation 플러그인 등록 완료!");
	    } else {
	        console.error("🚨 Chart Annotation 플러그인을 찾을 수 없습니다. HTML <script> 태그를 확인하세요.");
	        return;
	    }
		
	    let graphContainer = document.getElementById("graphContainer");
	    document.getElementById("graph-plot").innerHTML = `<canvas id="lineGraph"></canvas>`; 
	    
	    const cmToPx = 37.8;
	    const lineGraph = document.getElementById('lineGraph');
	    lineGraph.style.height = '420px';
	    lineGraph.height = 420;
	
	    const ctx = lineGraph.getContext("2d");
	
	    if (window.barChart) {
	        window.barChart.destroy();
	    }
		
	    // ✅ 세로선 설정
	    const annotations = {};
	    yearChangeDates.forEach(date => {
	        annotations[`line${date}`] = {
	            type: 'line',
	            xMin: date,
	            xMax: date,
	            borderColor: 'gray',
	            borderWidth: 2,
	            borderDash: [5, 5],
	            label: {
	                display: true,
	                content: '연도 변경',
	                position: 'top'
	            }
	        };
	    });
	
	    // ✅ 새로운 선형 그래프 생성 (x축, y축 라벨을 굵고 선명하게 설정)
	    window.barChart = new Chart(ctx, {
	        type: "line",
	        data: {
	            labels: labels,
	            datasets: [
	                {
	                    label: "총 인입",
	                    data: totalInCall,
	                    borderColor: "#163d50",
	                    borderWidth: 2,
	                    fill: false,
	                    tension: 0.1,
	                    pointRadius: 3,
	                    pointBackgroundColor: "#163d50",
	                },
	                {
	                    label: "총 응대",
	                    data: totalResCall,
	                    borderColor: "#0f9785",
	                    borderWidth: 2,
	                    fill: false,
	                    tension: 0.1,
	                    pointRadius: 3,
	                    pointBackgroundColor: "#0f9785",
	                },
	                {
	                    label: "총 접수",
	                    data: totalAcptCall,
	                    borderColor: "#e2a449",
	                    borderWidth: 2,
	                    fill: false,
	                    tension: 0.1,
	                    pointRadius: 3,
	                    pointBackgroundColor: "#e2a449",
	                },
	            ],
	        },
	        options: {
	            responsive: true,
	            maintainAspectRatio: false,
	            plugins: {
	                annotation: {
	                    annotations: annotations
	                },
	                tooltip: {
	                    callbacks: {
	                        label: function (context) {
	                            const label = context.dataset.label || "";
	                            return `${label}: ${context.raw}`;
	                        },
	                    },
	                },
	                legend: {
	                    labels: {
	                        font: {
	                            size: 16, // ✅ 글자 크기 크게
	                            weight: 'bold', // ✅ 글씨 굵게
	                        },
	                        color: "#000" // ✅ 검정색 글씨
	                    }
	                }
	            },
	            scales: {
	                x: {
	                    title: {
	                        display: true,
	                        text: "날짜",
	                        font: {
	                            weight: 'bold', // ✅ x축 제목을 굵게
	                            size: 18,
	                        },
	                        color: "#000" // ✅ 제목 색상을 검정색으로 변경
	                    },
	                    ticks: {
	                        autoSkip: true,
	                        maxRotation: 0,
	                        font: {
	                            weight: 'bold', // ✅ x축 데이터(202501, 202502 등)를 굵게
	                            size: 18,       // ✅ 글씨 크기 키우기
	                        },
	                        color: "#000" // ✅ x축 숫자를 검정색으로 변경
	                    },
	                },
	                y: {
	                    title: {
	                        display: true,
	                        text: "건수",
	                        font: {
	                            weight: 'bold', // ✅ y축 제목을 굵게
	                            size: 18,
	                        },
	                        color: "#000" // ✅ 제목 색상을 검정색으로 변경
	                    },
	                    beginAtZero: true,
	                    ticks: {
	                        font: {
	                            weight: 'bold', // ✅ y축 데이터(900, 800, 700 등)를 굵게
	                            size: 18,       // ✅ 글씨 크기 키우기
	                        },
	                        color: "#000" // ✅ y축 숫자를 검정색으로 변경
	                    },
	                },
	            },
	        }
	    });
	}
	
	
});
