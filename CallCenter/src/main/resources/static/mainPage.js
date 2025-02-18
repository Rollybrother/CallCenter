document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("dailyBtn").addEventListener("click", showDailyFilter);
    document.getElementById("monthlyBtn").addEventListener("click", showMonthlyFilter);
    document.getElementById("yearlyBtn").addEventListener("click", showYearlyFilter);
	
	window.calculateAndRenderTotalRow = calculateAndRenderTotalRow;
	
    function showDailyFilter() {
        const filterSection = document.getElementById("filter-section");
        filterSection.innerHTML = `
            <label>시작 날짜: <input type="date" id="startDate"></label>
            <label>종료 날짜: <input type="date" id="endDate"></label>
            <button onclick="fetchDailyData()">조회</button>
        `;
    }
	
    function showMonthlyFilter() {
        const filterSection = document.getElementById("filter-section");
        filterSection.innerHTML = `
            <label>연도: <input type="number" id="year" placeholder="YYYY"></label>
            <label>월: <input type="number" id="month" placeholder="MM"></label>
            <button onclick="fetchMonthlyData()">조회</button>
        `;
    }
	
    function showYearlyFilter() {
	    const filterSection = document.getElementById("filter-section");
	    filterSection.innerHTML = `
	        <label>시작: <input type="month" id="startYearMonth"></label>
	        <label>끝: <input type="month" id="endYearMonth"></label>
	        <button onclick="fetchYearlyData()">조회</button>
	    `;
	}
	
    // 테이블 초기화 함수
    function clearTable() {
        const tbody = document.getElementById("data-body");
        tbody.innerHTML = ""; // 모든 행 삭제
    }
    
    // 합계 행 추가 함수
    function calculateAndRenderTotalRow() {
        const tbody = document.getElementById("data-body");
        const rows = tbody.querySelectorAll("tr");
        let manInCall = 0,
            manResCall = 0,
            manAcptCall = 0,
            voiceInCall = 0,
            voiceAcptCall = 0,
            chatInCall = 0,
            chatAcptCall = 0,
            chattingIn = 0,
            chattingAcpt = 0,
            innerAcpt = 0,
            onlineAcptCall = 0,
            faxAcpt = 0;

        rows.forEach(row => {
            manInCall += parseInt(row.children[1].textContent) || 0;
            manResCall += parseInt(row.children[2].textContent) || 0;
            manAcptCall += parseInt(row.children[4].textContent) || 0;
            voiceInCall += parseInt(row.children[5].textContent) || 0;
            voiceAcptCall += parseInt(row.children[6].textContent) || 0;
            chatInCall += parseInt(row.children[7].textContent) || 0;
            chatAcptCall += parseInt(row.children[8].textContent) || 0;
            chattingIn += parseInt(row.children[9].textContent) || 0;
            chattingAcpt += parseInt(row.children[10].textContent) || 0;
            innerAcpt += parseInt(row.children[11].textContent) || 0;
            onlineAcptCall += parseInt(row.children[12].textContent) || 0;
            faxAcpt += parseInt(row.children[13].textContent) || 0;
        });
		
        const totalInCall = manInCall + voiceInCall + chatInCall + chattingIn;
        const totalResCall = manResCall + voiceInCall + chatInCall + chattingIn; // Assuming voice and chat count as responses
        const totalAcptCall = manAcptCall + voiceAcptCall + chatAcptCall + chattingAcpt + onlineAcptCall + faxAcpt + innerAcpt;
		
        // 백분율 계산
        const manResRate = manInCall > 0 ? ((manResCall / manInCall) * 100).toFixed(1) : "0.0";
        const totalResRate = totalInCall > 0 ? ((totalResCall / totalInCall) * 100).toFixed(1) : "0.0";
        const totalAcptRate = totalResCall > 0 ? ((totalAcptCall / totalResCall) * 100).toFixed(1) : "0.0";
		
        // 합계 행 추가
        const summaryRow = `
            <tr id="summary-row">
                <td>합계</td>
                <td>${manInCall}</td>
                <td>${manResCall}</td>
                <td>${manResRate}%</td>
                <td>${manAcptCall}</td>
                <td>${voiceInCall}</td>
                <td>${voiceAcptCall}</td>
                <td>${chatInCall}</td>
                <td>${chatAcptCall}</td>
            	<td>${chattingIn}</td>
            	<td>${chattingAcpt}</td>
            	<td>${innerAcpt}</td>
                <td>${onlineAcptCall}</td>
            	<td>${faxAcpt}</td>
                <td>${totalInCall}</td>
                <td>${totalResCall}</td>
                <td>${totalResRate}%</td>
                <td>${totalAcptCall}</td>
                <td>${totalAcptRate}%</td>
            </tr>
        `;
		
        tbody.insertAdjacentHTML("beforeend", summaryRow);
    }
	
	
    // 조회 타입을 저장할 전역 변수
	window.queryType = ""; // 다른 파일에서도 접근 가능하도록 전역 변수 선언
	
	// 일별 조회
	window.fetchDailyData = function () {
	    window.queryType = "일별조회 결과"; // 조회 타입 설정
	    const startDate = document.getElementById("startDate").value.replace(/-/g, "");
	    const endDate = document.getElementById("endDate").value.replace(/-/g, "");
	
	    clearTable(); // 기존 데이터 초기화
	
	    fetch(`/api/statistics/daily?startDate=${startDate}&endDate=${endDate}`)
	        .then((response) => response.json())
	        .then((data) => renderTableData(data))
	        .catch((error) => console.error("Error fetching daily data:", error));
	};
	
	// 월별 조회
	window.fetchMonthlyData = function () {
	    window.queryType = "월별조회 결과"; // 조회 타입 설정
	    const year = document.getElementById("year").value;
	    const month = document.getElementById("month").value.padStart(2, "0");
	
	    clearTable(); // 기존 데이터 초기화
	
	    fetch(`/api/statistics/monthly?year=${year}&month=${month}`)
	        .then((response) => response.json())
	        .then((data) => renderTableData(data))
	        .catch((error) => console.error("Error fetching monthly data:", error));
	};
	
	// 연별 조회
	window.fetchYearlyData = function () {
	    window.queryType = "연도별조회 결과"; // 조회 타입 설정
	    const startYearMonth = document.getElementById("startYearMonth").value; // YYYY-MM
	    const endYearMonth = document.getElementById("endYearMonth").value; // YYYY-MM
	
	    if (!startYearMonth || !endYearMonth) {
	        alert("시작 및 끝 연도와 월을 선택해야 합니다.");
	        return;
	    }
	
	    const start = startYearMonth.replace("-", "") + "01"; // YYYYMM01
	    const endYear = endYearMonth.split("-")[0];
	    const endMonth = endYearMonth.split("-")[1];
	    const end = endYear + endMonth + "31"; // YYYYMM31
	
	    clearTable(); // 기존 데이터 초기화
	
	    fetch(`/api/statistics/yearly?start=${start}&end=${end}`)
	        .then((response) => response.json())
	        .then((data) => renderYearlyData(data))
	        .catch((error) => console.error("Error fetching yearly data:", error));
	};

    

    // 테이블 데이터를 렌더링하는 함수 (체크박스 포함)
    function renderTableData(data) {
    const tbody = document.getElementById("data-body");

    // 기존 데이터 초기화 (합계 행 제외)
    clearTable();

    // 데이터 행 추가
    data.forEach((item) => {
        const {
            date,
            manInCall,
            manResCall,
            manAcptCall,
            voiceInCall,
            voiceAcptCall,
            chatInCall,
            chatAcptCall,
            chattingIn,
            chattingAcpt,
            innerAcpt,
            onlineAcptCall,
            faxAcpt,
        } = item;

        // 계산된 값
        const manResRate = manInCall > 0 ? ((manResCall / manInCall) * 100).toFixed(1) : "0.0";
        const totalInCall = manInCall + voiceInCall + chatInCall + chattingIn;
        const totalResCall = manResCall + voiceInCall + chatInCall + chattingIn;
        const totalResRate = totalInCall > 0 ? ((totalResCall / totalInCall) * 100).toFixed(1) : "0.0";
        const totalAcptCall = manAcptCall + voiceAcptCall + chatAcptCall + chattingAcpt + onlineAcptCall + faxAcpt + innerAcpt;
        const totalAcptRate = totalResCall > 0 ? ((totalAcptCall / totalResCall) * 100).toFixed(1) : "0.0";

        // 데이터 행 추가
        const row = `
			    <tr data-date="${date}">
			        <td>
			            <input type="checkbox" class="row-checkbox"> ${date}
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
			    </tr>
			`;
			tbody.insertAdjacentHTML("beforeend", row);

    	});

    	// 합계 행 추가
   	 	calculateAndRenderTotalRow();
   	 	
   	 	// 버튼 다시 보이게 하기
		const editButton = document.getElementById("editBtn");
		if (editButton) {
		    editButton.style.display = "inline-block"; 
		}
		
		const deleteButton = document.getElementById("deleteBtn");
		if (deleteButton) {
		    deleteButton.style.display = "inline-block"; 
		}
   	 	
	}
	
	
	// 테이블 데이터를 렌더링하는 함수 (체크박스 포함)
    function renderYearlyData(data) {
	    const tbody = document.getElementById("data-body");
	
	    // 기존 데이터 초기화 (합계 행 제외)
	    clearTable();
	
	    // 데이터 행 추가
	    data.forEach((item) => {
	        const {
	            month, // 연별 조회 시 month 사용
	           	manInCall,
            	manResCall,
            	manAcptCall,
            	voiceInCall,
            	voiceAcptCall,
            	chatInCall,
            	chatAcptCall,
            	chattingIn,
            	chattingAcpt,
            	innerAcpt,
            	onlineAcptCall,
            	faxAcpt,
	        } = item;
	
	        // 계산된 값
	        const manResRate = manInCall > 0 ? ((manResCall / manInCall) * 100).toFixed(1) : "0.0";
       	    const totalInCall = manInCall + voiceInCall + chatInCall + chattingIn;
        	const totalResCall = manResCall + voiceInCall + chatInCall + chattingIn;
        	const totalResRate = totalInCall > 0 ? ((totalResCall / totalInCall) * 100).toFixed(1) : "0.0";
        	const totalAcptCall = manAcptCall + voiceAcptCall + chatAcptCall + chattingAcpt + onlineAcptCall + faxAcpt + innerAcpt;
        	const totalAcptRate = totalResCall > 0 ? ((totalAcptCall / totalResCall) * 100).toFixed(1) : "0.0";
	
	        // 데이터 행 추가
	        const row = `
				    <tr data-month="${month}">
				        <td>
			            <input type="checkbox" class="row-checkbox"> ${month}
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
				    </tr>
				`;
				tbody.insertAdjacentHTML("beforeend", row);
	
	    });
	
	    // 데이터 행 추가가 완료된 뒤 합계 행 추가
	    calculateAndRenderTotalRow();
	    
	     // 이미 생성된 버튼 수정 및 비활성화
		const editButton = document.getElementById("editBtn");
		if (editButton) {
		    editButton.style.display = "none"; // 버튼 숨기기
		}
		
		const deleteButton = document.getElementById("deleteBtn");
		if (deleteButton) {
		    deleteButton.style.display = "none"; // 버튼 숨기기
		}
	}

	// 통계 등록 버튼 클릭 시 모달 표시
    document.getElementById("registerBtn").addEventListener("click", function() {
        document.getElementById("modal").classList.remove("hidden");
    });
	
    // 통계 등록 버튼 클릭 시 모달 표시
    document.getElementById("registerBtn").addEventListener("click", function() {
        document.getElementById("modal").classList.remove("hidden");
    });
	
    // 모달 닫기 버튼
    document.getElementById("closeModal").addEventListener("click", function() {
        document.getElementById("modal").classList.add("hidden");
    });

	//등록 로직
    document.getElementById("statForm").addEventListener("submit", function(event) {
    event.preventDefault();
	
    const formData = new FormData(event.target);
    const jsonData = Object.fromEntries(formData.entries());

    // 날짜 값을 "YYYYMMDD" 형식으로 변환
    const date = jsonData.date.replace(/-/g, ""); // YYYY-MM-DD → YYYYMMDD
    jsonData.date = date;
	
    // 중복 확인 요청
    fetch("/api/statistics/checkAndSave", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
    })
        .then((response) => response.text())
        .then((result) => {
            if (result === "EXISTS") {
                // 중복 데이터가 존재하는 경우 사용자에게 확인창 표시
                const overwrite = confirm("해당 날짜에 등록된 데이터가 있습니다. 덮어쓰기 하시겠습니까?");
                if (overwrite) {
                    // 기존 데이터 삭제 및 새 데이터 저장
                    fetch(`/api/statistics/deleteByDate?date=${date}`, {
                        method: "DELETE",
                    })
                        .then(() =>
                            fetch("/api/statistics", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(jsonData),
                            })
                        )
                        .then((response) => {
                            if (response.ok) {
                                alert("덮어쓰기 완료되었습니다.");
                                document.getElementById("modal").classList.add("hidden");
                                event.target.reset();
                            } else {
                                alert("저장에 실패했습니다.");
                            }
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                            alert("오류가 발생했습니다.");
                        });
                } else {
                    // 사용자가 "아니오"를 선택한 경우
                    alert("취소되었습니다.");
                }
            } else if (result === "SAVED") {
                alert("저장 완료되었습니다.");
                document.getElementById("modal").classList.add("hidden");
                event.target.reset();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("오류가 발생했습니다.");
        });
	});
    
    // 접수 데이터 조회 버튼 이벤트 리스너
    document.getElementById("fetchReceptionBtn").addEventListener("click", function () {
        const dateInput = document.getElementById("date").value;

        // 날짜 입력 확인
        if (!dateInput) {
            alert("날짜 선택을 하셔야 합니다");
            return;
        }

        // 날짜를 "YYYYMMDD" 형식으로 변환
        const formattedDate = dateInput.replace(/-/g, "");

        // AJAX 요청으로 접수 데이터 가져오기
        fetch(`/api/statistics/reception?rcptDate=${formattedDate}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("데이터를 가져오는 데 실패했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                // 각 필드에 데이터 설정
                document.getElementById("manAcptCall").value = data.countMan;
                document.getElementById("voiceAcptCall").value = data.countVoice;
                document.getElementById("chatAcptCall").value = data.countChat;
                document.getElementById("onlineAcptCall").value = data.countInternet;
                document.getElementById("faxAcpt").value = data.countFax;
                document.getElementById("chattingAcpt").value = data.countChatting;    
                document.getElementById("innerAcpt").value = data.countInnerAcpt;
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("접수 데이터를 가져오는 중 오류가 발생했습니다.");
            });
  
    });
    
    // "날짜" 열에 있는 전체 선택 체크박스
    const selectAllCheckbox = document.getElementById("selectAllCheckbox");

    // 전체 선택 체크박스의 상태가 변경되었을 때 동작하는 함수
    selectAllCheckbox.addEventListener("change", function () {
        const rowCheckboxes = document.querySelectorAll(".row-checkbox");

        rowCheckboxes.forEach((checkbox) => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });
	
    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("row-checkbox")) {
            
            const rowCheckboxes = document.querySelectorAll(".row-checkbox");
          
            const allChecked = Array.from(rowCheckboxes).every(
                (checkbox) => checkbox.checked
            );
	
            selectAllCheckbox.checked = allChecked;
        }
    });
	
});
