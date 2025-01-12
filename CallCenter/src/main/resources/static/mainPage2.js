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
    graphButton.id = "graphBtn";
    graphButton.textContent = "그래프 생성";
    buttonGroup.appendChild(graphButton);

    // 버튼 그룹을 filter-section 아래에 추가
    filterSection.insertAdjacentElement("afterend", buttonGroup);

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
                    console.error("수정된 데이터가 없습니다.");
                    alert("수정된 데이터가 없습니다. 다시 시도해주세요.");
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
                            const onlineAcptCall = parseInt(updatedData["onlineAcptCall"]);
                            const firmAcptCall = parseInt(updatedData["firmAcptCall"]);
                            const innerAcptCall = parseInt(updatedData["innerAcptCall"]);

                            // 계산된 값
                            const manResRate = manInCall > 0 ? ((manResCall / manInCall) * 100).toFixed(1) : "0.0";
                            const totalInCall = manInCall + voiceInCall + chatInCall;
                            const totalResCall = manResCall + voiceInCall + chatInCall;
                            const totalResRate = totalInCall > 0 ? ((totalResCall / totalInCall) * 100).toFixed(1) : "0.0";
                            const totalAcptCall =
                                manAcptCall +
                                voiceAcptCall +
                                chatAcptCall +
                                onlineAcptCall +
                                firmAcptCall +
                                innerAcptCall;
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
                                <td data-editable="true" data-field="onlineAcptCall">${onlineAcptCall}</td>
                                <td data-editable="true" data-field="firmAcptCall">${firmAcptCall}</td>
                                <td data-editable="true" data-field="innerAcptCall">${innerAcptCall}</td>
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
	            manResRate: cells[3].textContent.trim(), // 문자열(%) 포함
	            manAcptCall: parseInt(cells[4].textContent.trim()) || 0,
	            voiceInCall: parseInt(cells[5].textContent.trim()) || 0,
	            voiceAcptCall: parseInt(cells[6].textContent.trim()) || 0,
	            chatInCall: parseInt(cells[7].textContent.trim()) || 0,
	            chatAcptCall: parseInt(cells[8].textContent.trim()) || 0,
	            onlineAcptCall: parseInt(cells[9].textContent.trim()) || 0,
	            firmAcptCall: parseInt(cells[10].textContent.trim()) || 0,
	            innerAcptCall: parseInt(cells[11].textContent.trim()) || 0,
	            totalInCall: parseInt(cells[12].textContent.trim()) || 0,
	            totalResCall: parseInt(cells[13].textContent.trim()) || 0,
	            totalResRate: cells[14].textContent.trim(), // 문자열(%) 포함
	            totalAcptCall: parseInt(cells[15].textContent.trim()) || 0,
	            totalAcptRate: cells[16].textContent.trim(), // 문자열(%) 포함
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
	
    // "그래프 생성" 버튼 클릭 이벤트
    graphButton.addEventListener("click", function () {
        generateGraph(); // 그래프 생성 함수 호출
    });

    // 그래프 모달 요소들
    const graphModal = document.getElementById("graphModal");
    const closeGraphModal = document.getElementById("closeGraphModal");
    const printGraphBtn = document.getElementById("printGraphBtn");

    // 모달 닫기 버튼 이벤트 추가
    closeGraphModal.addEventListener("click", function () {
        graphModal.classList.add("hidden");
    });

    // "그래프 인쇄" 버튼 클릭 이벤트 추가
    printGraphBtn.addEventListener("click", function () {
        printGraph(); // 그래프 인쇄 함수 호출
    });

    // 그래프 생성 함수 (수정된 부분)
    function generateGraph() {
        const tbody = document.getElementById("data-body");
        const rows = Array.from(tbody.querySelectorAll("tr"));
        const validRows = rows.slice(0, -1); // 마지막 행(합계 행)을 제외

        const labels = [];
        const totalInCall = [];
        const totalResCall = [];
        const totalAcptCall = [];

        // 데이터 수집 (수정된 부분: 마지막 행 제외)
        validRows.forEach(row => {
            const dateCell = row.querySelector("td");
            if (!dateCell) return;

            const date = dateCell.textContent.trim();
            const inCall = parseInt(row.children[12].textContent) || 0;
            const resCall = parseInt(row.children[13].textContent) || 0;
            const acptCall = parseInt(row.children[15].textContent) || 0;

            labels.push(date);
            totalInCall.push(inCall);
            totalResCall.push(resCall);
            totalAcptCall.push(acptCall);
        });

        const ctx = document.getElementById("lineGraph").getContext("2d");

        // 기존 그래프 제거
        if (window.lineChart) {
            window.lineChart.destroy();
        }

        // 새로운 선형 그래프 생성
        window.lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "총 인입",
                        data: totalInCall,
                        borderColor: "blue",
                        fill: false,
                    },
                    {
                        label: "총 응대",
                        data: totalResCall,
                        borderColor: "green",
                        fill: false,
                    },
                    {
                        label: "총 접수",
                        data: totalAcptCall,
                        borderColor: "red",
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // 고정 크기에 맞춤 (수정된 부분)
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
                            maxRotation: 0, // 축 레이블이 너무 길어질 경우 회전 방지 (수정된 부분)
                            callback: function (val, index) {
                                // 데이터가 많을 경우 일정 간격으로 레이블 표시 (수정된 부분)
                                return index % Math.ceil(labels.length / 10) === 0
                                    ? this.getLabelForValue(val)
                                    : "";
                            },
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

        graphModal.classList.remove("hidden"); // 모달 창 표시
    }

    // 그래프 인쇄 함수 (수정된 부분)
    function printGraph() {
        const printWindow = window.open('', '_blank');
        const graphDataURL = document.getElementById("lineGraph").toDataURL();

        printWindow.document.write(`
            <html>
            <head>
                <title>그래프 인쇄</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        text-align: center;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                <img src="${graphDataURL}" alt="그래프 이미지">
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
    
    
});
