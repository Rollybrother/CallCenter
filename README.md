# CallCenter — Spring Boot

대림통상 콜센터 통계 프로그램입니다. **Java 21 / Spring Boot 3.5.16 / Gradle 8.7**을 사용하며, 내장 Tomcat이 포함된 실행 JAR로 구동합니다. 외부 Tomcat, WAR 배포, JSP 설정은 필요하지 않습니다. 기존 Thymeleaf 화면과 로그인·통계·접수 집계·엑셀 다운로드 URL을 유지합니다.

## STS4에서 가져오기 / Boot Dashboard 표시

기존 저장소는 `CallCenter/` 안에 다시 Gradle 프로젝트가 들어 있었습니다. 이제 **저장소 최상위 폴더**에 `build.gradle`, `settings.gradle`, `gradlew`, `src/`가 있습니다.

1. 이 ZIP을 압축 해제하거나 기존 Git 저장소의 `master`를 Pull 합니다. 기존 작업 내용이 있다면 먼저 보관합니다.
2. 이전 경로로 가져온 CallCenter 프로젝트가 STS4에 있다면 Package Explorer에서 해당 프로젝트를 **Delete** 합니다. **Delete project contents on disk는 체크하지 마세요.** 로컬 파일은 남겨둡니다.
3. **File → Import → Gradle → Existing Gradle Project → Next**를 선택합니다.
4. **Project root directory**에 `build.gradle`이 바로 보이는 저장소 최상위 폴더를 지정합니다. 예전 안쪽 `CallCenter` 폴더를 선택하지 않습니다.
5. Gradle distribution은 **Gradle Wrapper**, Gradle JVM은 **JDK 21**을 선택하고 **Finish**를 누릅니다.
6. 의존성 다운로드가 끝나면 프로젝트 우클릭 → **Gradle → Refresh Gradle Project**를 실행합니다. Problems 창에 빌드 오류가 없어야 합니다.
7. **Window → Show View → Other… → Spring → Boot Dashboard**를 열고 `local`을 펼칩니다. 검색어/필터가 있다면 해제합니다.
8. `CallCenter`를 선택해 시작하거나 `src/main/java/com/daelim/Callcenter/CallCenterApplication.java` 우클릭 → **Run As → Spring Boot App**을 선택합니다.

STS4의 **Window → Preferences → Java → Installed JREs**에도 JDK 21이 등록되어 있어야 합니다. 이미 실행 중인 다른 프로그램이 8080 포트를 사용하면 아래 설정에서 `server.port=8081` 등으로 변경합니다. 메뉴 이름은 STS4 버전에 따라 조금 다를 수 있습니다.

> STS4 화면 자체는 이 저장소의 자동 테스트 대상이 아닙니다. Boot Dashboard는 Git 저장소 등록만으로 표시되지 않으며, Java/Gradle 프로젝트 가져오기와 의존성 동기화가 끝나야 합니다.

## DB 설정 (최초 1회)

실제 업무에는 기존 **MariaDB의 `user`, `stat` 테이블**과 **IBM i DB2의 `DAELIMDB.SAT101`**에 접근할 수 있어야 합니다. 프로그램은 운영 테이블을 생성하거나 변경하지 않습니다.

1. `config/application-local.properties.example`을 같은 폴더의 `application-local.properties`로 복사합니다.
2. 기존 서버 주소, 계정, 비밀번호를 입력합니다. 이 파일은 Git에서 제외됩니다.
3. STS4 실행 설정의 Working directory는 프로젝트 최상위 폴더로 둡니다.

```properties
spring.datasource.url=jdbc:mariadb://DB_HOST:3306/callcenter
spring.datasource.username=DB_USER
spring.datasource.password=DB_PASSWORD
spring.second-datasource.url=jdbc:as400://DB2_HOST/DAELIMDB
spring.second-datasource.username=DB2_USER
spring.second-datasource.password=DB2_PASSWORD
server.port=8080
```

MariaDB URL은 기존 `jdbc:log4jdbc:mysql:` 대신 `jdbc:mariadb:`를 사용합니다. URL의 매개변수 구분자는 `&amp;`가 아닌 `&`입니다. 새 설정은 `jdbc-url` 대신 `url`을 사용합니다.

설정 파일 대신 다음 환경변수도 사용할 수 있습니다. 로컬 설정 파일에 같은 항목이 있으면 그 값이 우선합니다.

| 환경변수 | 용도 |
| --- | --- |
| `CALLCENTER_DB_URL` | MariaDB JDBC URL |
| `CALLCENTER_DB_USERNAME` | MariaDB 계정 |
| `CALLCENTER_DB_PASSWORD` | MariaDB 비밀번호 |
| `CALLCENTER_DB2_URL` | IBM i JDBC URL |
| `CALLCENTER_DB2_USERNAME` | DB2 계정 |
| `CALLCENTER_DB2_PASSWORD` | DB2 비밀번호 |
| `SERVER_PORT` | 웹 포트, 기본 8080 |

DB 설정을 하지 않은 상태에서는 운영 프로그램이 정상 기동되지 않을 수 있습니다. 테스트는 별도 메모리 DB를 사용하므로 사내 DB 접속 없이 실행됩니다. 테스트 DB와 H2 드라이버는 배포 JAR에 포함되지 않습니다.

## 실행과 빌드

Windows PowerShell (프로젝트 최상위):

```powershell
.\gradlew.bat clean test bootJar
.\gradlew.bat bootRun
```

Linux/macOS:

```bash
./gradlew clean test bootJar
./gradlew bootRun
```

JAR 실행 (JDK/Java 21):

```bash
java -jar build/libs/callcenter.jar
```

서버에 배포할 때는 `callcenter.jar`와 별도의 `config/application-local.properties`를 준비하고, `config/`의 상위 폴더에서 `java -jar callcenter.jar`를 실행합니다. `java -jar` 실행과 `bootRun`을 동시에 켜지 않습니다.

접속: <http://localhost:8080/> 또는 기존 <http://localhost:8080/callCenter/>. 포트를 변경했다면 URL도 변경합니다.

## 실행 구성 정리 내용

- 저장소 최상위에 하나의 Gradle/Spring Boot 프로젝트를 배치하고 `CallCenterApplication`을 실행 클래스로 지정했습니다.
- MariaDB 로그인·통계 저장소는 하나의 기본 데이터소스/트랜잭션을 공유합니다. 접수 저장소는 별도 DB2 연결을 사용합니다.
- DB2에 적용되어 있던 SQL Server 방언을 `DB2iDialect`로 수정했습니다. 실제 IBM i 버전과 JDBC 연결은 운영 환경에서 확인해야 합니다.
- 중복 JDBC/로깅 의존성과 사용하지 않는 보안 자동설정을 정리했습니다. 기존 BCrypt 비밀번호와 세션 로그인 방식을 유지합니다.
- 기존 컬럼명(`userIndex`, `indexNum`, `manInCall` 등)을 보존하고, 사용자·통계 등록 시 DB의 자동 증가 키를 사용합니다. 기존 스키마에서 `user.userIndex`, `stat.indexNum`이 AUTO_INCREMENT인 것을 확인하세요.
- 기본 `/` 접속과 로그인/회원가입 CSS 경로를 수정했습니다.
- 내장 Tomcat에서도 엑셀의 한글 다운로드 파일명이 전달되도록 응답 헤더를 UTF-8 방식으로 인코딩했습니다.
- 월별 합계 쿼리의 GROUP BY에 포함되지 않은 날짜 정렬을 제거하고, 통계 삭제 트랜잭션을 MariaDB로 명시했습니다.

## 검증

`./gradlew clean test bootJar`는 두 개의 독립된 H2 테스트 DB에서 다음을 확인합니다.

- 애플리케이션 기동, DB별 저장소 분리와 기존 컬럼명
- 로그인 화면, 정적 파일, 회원가입과 BCrypt 로그인/세션
- 여러 날짜의 통계 등록·중복 확인·일/월/연 조회·삭제
- 기존 접수 채널 코드별 집계
- 클래스패스에 포함된 엑셀 서식으로 다운로드 생성

H2 테스트는 실제 MariaDB/IBM i 서버의 접속 권한, 버전, 기존 데이터까지 검증하지는 않습니다.
