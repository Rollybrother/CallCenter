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
    filterSection.insertAdjacentElement("afterend", buttonGroup);
	
    // "인쇄" 버튼 클릭 이벤트
    printButton.addEventListener("click", function () {
        printTableAndGraph(); // 테이블 인쇄 함수 호출
    });
	
    // 테이블 및 그래프 인쇄 함수
	function printTableAndGraph() {
		
	    const table = document.querySelector("#data-table table").cloneNode(true);
	    const thead = table.querySelector("thead");
	    const tbody = table.querySelector("tbody");
		
	    // 체크박스가 체크된 행만 유지
	    const rows = Array.from(tbody.querySelectorAll("tr"));
	    rows.forEach(row => {
	        const checkbox = row.querySelector("input[type='checkbox']");
	        if (!checkbox || !checkbox.checked) {
	            row.remove(); // 체크되지 않은 행 삭제
	        }
	    });
		
	    // 합계 행이 이미 존재하는 경우 유지
	    const summaryRow = document.getElementById("summary-row");
	    if (summaryRow) {
	        tbody.appendChild(summaryRow.cloneNode(true)); // 합계 행 복제 및 추가
	    }
		
	    // 빈 행 추가 (31개 미만인 경우)
		const rowCount = tbody.querySelectorAll("tr").length;
		const totalRowsNeeded = 31; // 총 31개 행이 필요
		const colCount = 20; // 각 행의 가로 칸 수를 20개로 고정
		
		if (rowCount < totalRowsNeeded) {
		    for (let i = 0; i < totalRowsNeeded - rowCount; i++) {
		        const emptyRow = document.createElement("tr");
		        for (let j = 0; j < colCount; j++) {
		            const emptyCell = document.createElement("td");
		            emptyCell.textContent = ""; // 빈 데이터
		            emptyRow.appendChild(emptyCell);
		        }
		        tbody.appendChild(emptyRow);
		    }
		}
	
	    // 체크박스 제거 (날짜 열 포함)
	    thead.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
	        const cell = checkbox.closest("th");
	        if (cell) {
	            cell.textContent = cell.textContent.trim();
	        }
	    });
	
	    tbody.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
	        const cell = checkbox.closest("td");
	        if (cell) {
	            cell.textContent = cell.textContent.trim();
	        }
	    });
	
	    // 그래프 복제
	    const graphCanvas = document.getElementById("lineGraph");
	    const graphImage = graphCanvas ? graphCanvas.toDataURL() : null;
	
	    // 새로운 창 열기
	    const printWindow = window.open("", "_blank");
	    printWindow.document.write(`
	        <html>
	        <head>
	            <title>테이블 및 그래프 인쇄</title>
	            <style>
	                body {
	                    font-family: Arial, sans-serif;
	                    margin: 0;
	                    padding: 20px;
	                }
	                table {
	                    width: 100%;
	                    border-collapse: collapse;
	                    margin: 0;
	                    font-size: 10px;
	                    height: 17cm; /* 테이블 높이를 17cm로 고정 */
	                }
	                th, td {
	                    border: 1px solid #ddd;
	                    text-align: center;
	                    padding: 4px;
	                }
	                th {
	                    background-color: #f4f4f4;
	                    font-weight: bold;
	                    white-space: nowrap;
	                    height: 0.5cm; /* 헤더 높이를 0.5cm로 고정 */
	                }
	                td {
	                    height: calc((17cm - 0.5cm) / 32); /* 데이터 행 높이를 동적으로 계산 */
	                    //데이터 굵은 고딕체로 인쇄
	                    font-weight: bold;
    					font-family: Arial, sans-serif;
	                }
	                .graph-container {
	                    text-align: center;
	                    height: 8cm; /* 그래프 높이를 8cm로 고정 */
	                }
	                .graph-container img {
	                    max-height: 100%;
	                    max-width: 100%;
	                }
	            </style>
	        </head>
	        <body>
	            <h1 style="font-size: 16px; margin-bottom: 10px;">${window.queryType || "조회된 테이블 데이터"}</h1>
	            ${table.outerHTML}
	            ${graphImage ? `
	            <div class="graph-container">
	                <h2>그래프</h2>
	                <img src="${graphImage}" alt="그래프 이미지">
	            </div>
	            ` : ""}
	            <script>
	                window.onload = function() {
	                    window.print();
	                    window.onafterprint = function() { window.close(); }
	                }
	            </script>
	        </body>
	        </html>
	    `);
	
	    printWindow.document.close();
	}
	
	
	
    // "수정" 버튼 클릭 이벤트
    editButton.addEventListener("click", function () {
        const checkedRows = document.querySelectorAll("input[type='checkbox']:checked");
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
                            const privateIn = parseInt(updatedData["privateIn"]);
                            const onlineAcptCall = parseInt(updatedData["onlineAcptCall"]);
                            const faxAcpt = parseInt(updatedData["faxAcpt"]);
                            const innerAcpt = parseInt(updatedData["innerAcpt"]);

                            // 계산된 값
                            const manResRate = manInCall > 0 ? ((manResCall / manInCall) * 100).toFixed(1) : "0.0";
                            const totalInCall = manInCall + voiceInCall + chatInCall + chattingIn;
        					const totalResCall = manResCall + voiceInCall + chatInCall + chattingIn;
                            const totalResRate = totalInCall > 0 ? ((totalResCall / totalInCall) * 100).toFixed(1) : "0.0";
                            const totalAcptCall = manAcptCall + voiceAcptCall + chatAcptCall + chattingAcpt + privateIn + onlineAcptCall + faxAcpt + innerAcpt;
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
						        <td data-editable="true" data-field="privateIn">${privateIn}</td>
						        <td data-editable="true" data-field="onlineAcptCall">${onlineAcptCall}</td>
						        <td data-editable="true" data-field="faxAcpt">${faxAcpt}</td>
						        <td data-editable="true" data-field="innerAcpt">${innerAcpt}</td>
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
        const checkedRows = document.querySelectorAll("input[type='checkbox']:checked");
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
	            privateIn: parseInt(cells[11].textContent.trim()) || 0,
	            onlineAcptCall: parseInt(cells[12].textContent.trim()) || 0,
	            faxAcpt: parseInt(cells[13].textContent.trim()) || 0,
	            innerAcpt: parseInt(cells[14].textContent.trim()) || 0,
	            totalInCall: parseInt(cells[15].textContent.trim()) || 0,
	            totalResCall: parseInt(cells[16].textContent.trim()) || 0,
	            totalResRate: cells[17].textContent.trim(),
	            totalAcptCall: parseInt(cells[18].textContent.trim()) || 0,
	            totalAcptRate: cells[19].textContent.trim(), 
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
	function generateGraph() {
		
	    const tbody = document.getElementById("data-body");
	    const rows = Array.from(tbody.querySelectorAll("tr"));
	
	    const labels = [];
	    const totalInCall = [];
	    const totalResCall = [];
	    const totalAcptCall = [];
	    
	    // 선택된 체크박스 데이터만 수집
	    rows.forEach(row => {
	        const checkbox = row.querySelector("input[type='checkbox']");
	        if (checkbox && checkbox.checked) {
	            const dateCell = row.querySelector("td");
	            if (!dateCell) return;
	
	            const date = dateCell.textContent.trim();
	            const inCall = parseInt(row.children[15].textContent) || 0;
	            const resCall = parseInt(row.children[16].textContent) || 0;
	            const acptCall = parseInt(row.children[18].textContent) || 0;
	
	            labels.push(date);
	            totalInCall.push(inCall);
	            totalResCall.push(resCall);
	            totalAcptCall.push(acptCall);
	        }
	    });
	    
	    // 그래프 컨테이너 설정
	    let graphContainer = document.getElementById("graphContainer");
	    graphContainer.innerHTML = `<canvas id="lineGraph" style="height: 20cm;"></canvas>`; // 높이를 고정
	    
	    const cmToPx = 37.8; // cm to px 변환 기준
	    const lineGraph = document.getElementById('lineGraph');
	    
	    // 스타일과 실제 크기 동기화
	    lineGraph.style.height = '15cm';
	    lineGraph.height = 15 * cmToPx;
	
	    const ctx = lineGraph.getContext("2d");
	
	    // 기존 그래프 제거
	    if (window.barChart) {
	        window.barChart.destroy();
	    }
	
	    // 새로운 선형 그래프 생성
	    window.barChart = new Chart(ctx, {
	        type: "line",
	        data: {
	            labels: labels,
	            datasets: [
	                {
	                    label: "총 인입",
	                    data: totalInCall,
	                    borderColor: "blue",
	                    fill: false,
	                    tension: 0.1, // 곡선 매끄럽게
	                },
	                {
	                    label: "총 응대",
	                    data: totalResCall,
	                    borderColor: "green",
	                    fill: false,
	                    tension: 0.1,
	                },
	                {
	                    label: "총 접수",
	                    data: totalAcptCall,
	                    borderColor: "red",
	                    fill: false,
	                    tension: 0.1,
	                },
	            ],
	        },
	        options: {
	            responsive: true,
	            maintainAspectRatio: false, // 비율 유지하지 않음
	            plugins: {
	                tooltip: {
	                    callbacks: {
	                        label: function (context) {
	                            const label = context.dataset.label || "";
	                            return `${label}: ${context.raw}`;
	                        },
	                    },
	                },
	            },
	            scales: {
	                x: {
	                    title: {
	                        display: true,
	                        text: "날짜",
	                    },
	                    ticks: {
	                        autoSkip: true, // 자동으로 간격 조정
	                        maxRotation: 0, // 회전하지 않음
	                    },
	                },
	                y: {
	                    title: {
	                        display: true,
	                        text: "건수",
	                    },
	                    beginAtZero: true,
	                },
	            },
	        },
	    });
	}
	
	
    
});
