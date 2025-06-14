LN Partners 고객관리 시스템 상세 기능 명세서
1. 시스템 아키텍처 개요
클라이언트 (Frontend): Next.js (JavaScript 기반, App Router 활용) 프레임워크를 사용하여 구현됩니다
GitHub
. UI 프레임워크로 TailwindCSS를 적용하며, 반응형 웹 디자인으로 PC 웹과 모바일 환경 모두 대응합니다
GitHub
. 상태 관리는 Redux Toolkit과 redux-persist를 통해 구현하여 클라이언트 상태를 효율적으로 관리합니다
GitHub
.
서버 (Backend): Node.js 기반의 Express 서버 위에 Apollo GraphQL을 사용하여 API를 제공합니다
GitHub
. 데이터베이스는 MySQL을 사용하고, ORM/ODM으로 Sequelize 등을 활용합니다. GraphQL 스키마와 리졸버를 통해 클라이언트의 Query/Mutation 요청을 처리하며, 주요 도메인(고객, 영업, 제품 등)에 대한 단일 통합 GraphQL 엔드포인트를 제공합니다.
통신 및 인증: 클라이언트는 Apollo Client를 통해 GraphQL 서버와 통신하고, JWT 토큰 기반 인증을 사용합니다. 로그인 성공 시 토큰을 발급받아 이후 요청 헤더에 포함시키며, 서버에서는 JWT를 검증하여 사용자 식별 및 역할 기반 접근 제어(RBAC)를 수행합니다
GitHub
.
기타 기술: 다국어 지원을 위해 i18n 구조를 갖추며(기본 한국어, 추후 베트남어/영어 확장 가능)
GitHub
, Docker 컨테이너로 배포 환경을 일관성 있게 유지합니다
GitHub
. 또한 Cloudflare Tunnel 등을 이용한 사설망 클라우드 환경에서 동작 가능하도록 구성되어 있습니다
GitHub
.
2. 고객사 관리 (CRM) 기능 상세
요약: 영업팀과 CS팀이 고객사(회사) 정보를 통합 관리하고, 고객과의 관계 현황을 한눈에 파악하는 CRM 모듈입니다. 고객 기본 정보, 등급/분류, 연락처 및 과거 활동 이력, VOC(Voice of Customer) 등을 저장하여, 고객별 맞춤 전략 수립과 이탈 방지에 활용합니다
GitHub
GitHub
. 상세 기능:
신규 고객 등록: 새로운 고객사를 등록할 수 있습니다. 회사명, 업종, 연락처, 주소 등의 기본정보를 입력하며, 고객사별로 여러 명의 담당자(연락처 인물) 정보를 함께 등록/관리할 수 있습니다
GitHub
. 등록 시 입력한 회사명이 중복되는지 검사하여 중복 고객 생성 방지를 지원합니다. 고객 등급(A/B/C 등 또는 VIP 등급)과 분류를 설정하여 관리하며, 이는 추후 영업전략 차별화에 사용됩니다
GitHub
.
고객 상세정보 조회: 고객이 등록되면 고객 목록에서 해당 고객사를 선택하여 상세 프로필을 볼 수 있습니다. 고객 프로필 페이지 상단에는 회사 기본 정보(회사명, 업종 등)와 지정된 주요 담당자, 고객 등급, 만족도 지표 등이 표시됩니다
GitHub
. 하단에는 해당 고객과 관련된 최근 활동 이력 타임라인(상담 메모, 미팅/통화 기록)과 열린 영업기회 목록이 연동되어 나타납니다
GitHub
. 과거 누적 매출이나 거래 현황도 요약되어 표시됩니다 (예: 누적 구매액 등).
고객 정보 편집: 권한 있는 사용자는 고객 상세 화면에서 기본 정보를 수정하거나 등급, 분류 등을 업데이트할 수 있습니다. 예를 들어 고객사 내부 변화로 연락처나 주소가 변경된 경우 편집 모드로 전환하여 정보를 갱신하고 저장할 수 있습니다. 변경 이력은 로그에 남겨 추적합니다.
검색 및 필터: 다수의 고객사를 효율적으로 관리하기 위해 검색/필터 기능을 제공합니다. 고객사 명으로 키워드 검색을 하거나 업종, 지역, 등급별로 필터링하여 원하는 고객을 빠르게 찾을 수 있습니다
GitHub
. 예를 들어 등급별(A/B/C)로 필터링하여 VIP 고객 리스트만 보는 것이 가능합니다.
VOC 요약 및 만족도: 고객 프로필에는 VOC 요약(미해결 VOC 건수 등)과 고객 만족도 지표가 표시됩니다
GitHub
. CS팀이 입력한 VOC 데이터와 설문 등을 기반으로 산출된 만족도 점수를 시각화하여, 해당 고객의 현재 만족 상황을 파악할 수 있습니다.
입력/출력 데이터: 고객 관리에서 다루는 입력 및 출력 데이터는 다음과 같습니다.
입력 데이터: 고객 기본정보 (회사명, 사업자번호 등), 산업/업종, 회사 규모/유형, 주소, 주요 연락처 인물 정보, 고객 등급, 메모 등의 추가 정보
GitHub
.
출력 데이터: 고객 상세 프로필 화면 - 회사 기본정보, 등급/분류, 담당자 목록, 최근 VOC 내역 및 활동 이력 타임라인, 해당 고객의 누적 매출 또는 거래 요약, 고객 만족도 지표 등이 표시됩니다
GitHub
.
화면 흐름 예시: 영업 담당자가 고객 목록 화면에서 "+ 신규 고객" 버튼을 눌러 고객사를 등록하고, 등록 후 곧바로 해당 고객 상세 페이지로 이동합니다. 상세 화면에서 "VOC 추가" 또는 "미팅 기록 추가" 등의 액션 버튼을 눌러 방금 등록한 고객과의 상호작용을 바로 기록할 수 있습니다
GitHub
. 다른 팀원들도 이 상세 페이지를 열어 등급, 최근 VOC, 지난 활동 이력을 실시간으로 확인하며 대응 전략을 논의할 수 있습니다
GitHub
.
3. 고객 연락처 관리 (Contact Person 관리)
요약: 각 고객사별로 여러 명의 담당자(Contact Person) 정보를 관리하는 기능입니다. 고객사의 주요 연락 창구가 되는 인물들의 정보를 체계적으로 저장하여 영업/CS 시 효율적으로 활용할 수 있습니다
GitHub
. 상세 기능:
담당자 정보 등록: 고객사 등록 시 또는 이후에 고객사의 담당자를 추가로 등록할 수 있습니다. 각 담당자는 이름, 부서, 직책, 전화번호, 이메일 등의 기본 연락처 정보를 갖습니다
GitHub
. 또한 필요한 경우 생년월일, 프로필 사진, 그리고 소셜 미디어 계정(Facebook, TikTok, Instagram 등) 정보를 추가 필드로 관리하여 고객사 담당자의 관심사나 프로필을 파악할 수 있습니다.
다중 담당자 관리: 한 고객사에 다수의 연락처 인물을 저장할 수 있으며, 대표 담당자를 지정할 수도 있습니다 (예: 계약서 수신 담당자 등). 대표 담당자는 고객 리스트나 주요 화면에서 contactName 등으로 바로 표시되며
GitHub
GitHub
, 추가 담당자 정보는 고객 상세 화면의 담당자 탭/섹션에서 목록으로 확인할 수 있습니다.
편집 및 삭제: 사용자 권한에 따라 담당자 정보를 수정하거나 삭제할 수 있습니다. 예를 들어 담당자의 직책 변경이나 퇴사 등으로 더 이상 유효하지 않은 연락처인 경우 해당 Contact Person을 비활성화하거나 삭제 처리할 수 있습니다. 삭제 전 확인 모달을 통해 해당 인물이 관련된 활동 이력 등이 있는지 경고합니다.
연동 및 활용: 등록된 담당자 정보는 활동 이력 기록, 영업기회 등에서 활용됩니다. 예를 들어 미팅 일정을 기록할 때 어떤 담당자와 만났는지 연결하거나, 견적서에 수신인으로 담당자 이름/이메일을 자동 삽입하는 식입니다. 이를 통해 영업 활동의 맥락을 보다 정확히 남기고, 필요 시 담당자별로 커뮤니케이션 이력을 조회할 수 있습니다.
화면 흐름 예시: 고객 상세 화면에서 "담당자 관리" 섹션을 펼치면 현재 등록된 Contact Person들의 목록을 볼 수 있고, "+ 담당자 추가" 버튼으로 새로운 연락처를 입력할 수 있습니다. 담당자 추가 모달에서 이름과 연락처 등을 입력하고 저장하면 해당 고객사에 담당자가 연결되어 리스트에 나타납니다. 영업사원은 미팅 후 활동 기록을 남길 때 이 중 관련된 담당자를 선택하여 메모를 남길 수 있습니다.
4. 고객 활동 이력 관리 (미팅, 통화 기록 등)
요약: 고객과 이루어진 모든 접촉/상담 활동을 기록하고 관리하는 기능입니다. 영업팀은 고객과의 전화 통화, 이메일, 대면 미팅 등의 결과를 남겨 조직 내 공유하고, 추후 고객 대응에 활용합니다
GitHub
. 이러한 활동 내역은 타임라인 형태로 저장되어 고객 히스토리를 형성합니다. 상세 기능:
활동 유형 분류: 활동은 유형별로 분류되어 관리됩니다. 예를 들어 전화 통화(Call), 대면 미팅(Meeting), 이메일(Email), 데모 시연(Demo) 등으로 구분하고, VOC 상담도 하나의 활동 유형으로 포함될 수 있습니다
GitHub
GitHub
. 각 기록에는 활동 종류 외에 제목/요약, 상세 내용, 일정/시간 정보가 저장됩니다.
활동 기록 추가: 영업 또는 CS 담당자는 고객과의 접촉 후 활동 기록 추가 기능을 통해 해당 내용을 시스템에 남깁니다. 활동 입력 폼에서 제목, 날짜/시간, 참석자(예: 고객측 인원 및 자사 인원), 소요 시간, 상담 내용(메모), 결과 및 후속조치(next action) 등을 작성합니다
GitHub
GitHub
. 필요한 경우 관련 첨부파일(예: 회의록, 견적서 파일 등)을 업로드하여 활동과 함께 저장할 수 있습니다
GitHub
.
활동 이력 타임라인: 각 고객별 활동 내역은 시간순 타임라인으로 정리되어 고객 상세 화면에 표시됩니다
GitHub
. 최신 활동이 가장 상단에 위치하며, 항목별로 활동 종류 아이콘, 제목, 일시, 작성자 등이 보여집니다. 사용자는 특정 활동 항목을 클릭하여 상세 내용을 열람할 수 있습니다.
편집 및 삭제: 기록된 활동에 잘못된 정보가 있거나 수정이 필요하면 해당 작성자나 관리자 권한으로 활동 편집을 수행할 수 있습니다. 예를 들어 잘못 입력된 날짜나 오탈자를 수정하고 업데이트하면 타임라인에 수정된 내용이 반영되고 수정 이력이 로그로 남습니다. 활동 기록 삭제도 권한자가 가능하며, 삭제 시 관련 VOC 통계 등에서 제외됩니다.
일정 연동: 활동 중 미팅 일정과 같은 항목은 시스템의 캘린더 모듈과 연동되어 관리됩니다
GitHub
. 예를 들어 향후 예정된 미팅을 활동 일정으로 등록하면 영업 캘린더에 해당 일정이 표시되고 알림을 설정할 수 있습니다. 일정 완료 후 결과를 기록하면 해당 활동이 완료됨으로 표시되고 실제 활동 내역에 상세 내용이 저장됩니다.
입력/출력 데이터:
입력: 활동 종류, 제목, 내용 메모, 활동 일시/기간, 참가자 명단, 첨부파일 경로, 작성자 등
GitHub
GitHub
.
출력: 고객별 활동 타임라인 목록 (활동 유형 아이콘, 제목, 일시 등 요약 정보 포함), 개별 활동 상세 내용 (내용, 결과, 첨부파일 링크 등), 영업 팀 공용 활동 로그 화면 (모든 고객 활동을 최신순으로 보여주는 대시보드) 등이 제공됩니다
GitHub
.
화면 흐름 예시: 영업사원은 고객 상세 페이지에서 "활동 추가" 버튼을 눌러 새 미팅 결과를 기록합니다. 날짜, 참석자, 주요 논의 내용을 입력하고 저장하면 해당 활동이 고객 타임라인에 등록됩니다. 팀원들은 활동 로그 화면을 통해 최근 추가된 미팅/통화 기록을 시간순으로 확인하여, 어떤 고객과 어떤 대화가 있었는지 실시간으로 파악할 수 있습니다
GitHub
.
5. VOC (고객의 소리) 접수 및 처리 프로세스
요약: VOC(Voice of Customer) 모듈은 고객으로부터 접수된 불만, 요청, 문의 등의 소리를 기록하고 처리 상태를 추적하는 기능입니다. CS 담당자가 VOC를 접수하면 관련 내용을 시스템에 등록하고, 문제 해결 과정을 상태 변화로 관리하여 고객의 이슈가 적시에 해결되도록 지원합니다
GitHub
. 상세 기능:
VOC 접수 등록: 고객으로부터 불만사항이나 개선 요청이 접수되면 CS 담당자는 즉시 해당 내용을 VOC로 시스템에 등록합니다
GitHub
. VOC 등록 폼에는 발생 일자, 카테고리(불만/문의/칭찬 등), 중요도 등급, 제목, 상세 내용 등을 기입합니다. 또한 해당 VOC가 발생한 고객사와 담당자를 연결하고, 필요한 경우 관련 스크린샷 이미지나 문서를 첨부할 수 있습니다.
처리 상태 관리: 등록된 VOC는 자동으로 "신규 접수" 상태로 분류되며, 이후 처리 과정에 따라 상태를 변경할 수 있습니다. 일반적인 VOC 상태 흐름은 신규 → 처리중 → 처리완료 (및 완료 후 확인 단계) 등으로 정의됩니다. VOC 담당자는 문제 해결에 착수하면 상태를 "처리중"으로 변경하고, 관련 담당 부서나 담당자에게 내용을 전달합니다. 처리 완료 시 "완료" 상태로 전환하고, 필요한 경우 고객에게 조치 결과를 안내합니다.
책임자 지정 및 알림: VOC마다 해결 책임자를 지정할 수 있습니다 (예: 제품 불량 문의의 경우 품질관리팀 담당자 할당). VOC 상태가 신규로 등록되면 관련 담당자들에게 실시간 알림이 전송되어 이슈를 인지하게 합니다
GitHub
. 또한 상태가 "완료"로 변경되면 VOC를 접수한 CS 담당자와 영업 담당자에게 완료 알림을 보내 후속 조치 (예: 고객에게 만족도 확인 연락)을 유도합니다.
처리 내용 기록: VOC에 대한 처리 과정을 코멘트 로그 형태로 남길 수 있습니다. 담당자는 처리중 상태에서 어떤 조치를 취하고 있는지 메모를 VOC 항목에 추가합니다. 예를 들어 "제품 교체 진행 중, 9/1 발송 예정" 등의 진행 메모를 남겨 관련자들이 확인할 수 있게 합니다. VOC가 완료되면 최종 처리결과를 요약하여 기록합니다 (예: "제품 교환 완료 및 고객 안내 완료. 고객 만족도 양호").
VOC 조회 및 분석: 고객별 VOC 이력은 고객 상세 프로필의 VOC 섹션에서 확인할 수 있으며
GitHub
, 전체 VOC 목록은 별도의 VOC 관리 화면에서 필터링/검색할 수 있습니다. 예를 들어 미처리(오픈)된 VOC만 필터하거나, 기간별 VOC 접수 통계를 확인하는 기능이 제공됩니다. VOC 데이터는 고객 만족도 지표 산출에도 활용되어, VOC 빈도가 높은 고객을 케어하거나 제품/서비스의 개선 포인트를 파악합니다.
처리 워크플로우: (※ VOC 처리에 관한 업무 흐름)
VOC 등록: CS팀원이 VOC 내용을 시스템에 입력하면 상태=신규로 등록되고, 관련 부서 담당자에게 자동 알림이 발송됩니다.
원인 분석 및 진행: 지정된 담당자가 VOC 내용을 검토하여 원인을 분석하고 해결 방안을 수립합니다. 상태를 "처리중"으로 변경하고, VOC 항목에 중간 진행 상황을 기록합니다. 필요시 내부 미팅을 생성하거나 해당 고객의 영업 담당자와 협의합니다.
해결 및 완료: 문제가 해결되면 담당자는 VOC를 "처리완료" 상태로 변경하고 조치 결과를 입력합니다. 시스템은 완료 알림을 CS 담당자 및 영업담당자에게 전송합니다. CS 담당자는 고객에게 결과를 통보하고, 추가 만족도 확인을 진행합니다.
종료 및 피드백: VOC 처리 완료 후 일정 기간 내 고객의 피드백을 받아 문제가 재발되지 않았는지 확인합니다. 필요한 경우 VOC를 재개하거나 별도 개선 과제로 승격시킵니다.
화면 흐름 예시: CS 담당자가 고객 상세 화면에서 "VOC 접수" 버튼을 눌러 불만 사항을 등록합니다. VOC가 생성되면 VOC 관리 대시보드에 신규 VOC로 표시되고, 담당자에게 알림이 갑니다. 담당자는 VOC 상세 화면에서 처리 상태를 변경하고 진행 내역을 남깁니다. 최종 완료 후 해당 VOC 항목은 완료됨으로 표시되고, 고객 프로필의 VOC 히스토리에 누적됩니다
GitHub
.
6. 영업기회 파이프라인 관리 (Sales Opportunity 관리)
요약: 영업기회(Sales Opportunity) 모듈은 잠재 거래 건(딜)을 체계적으로 추적하는 파이프라인 관리 도구입니다. 영업팀은 영업기회를 등록하여 단계별 진행 상황을 관리하고, 전체 파이프라인 현황 및 팀 성과를 모니터링합니다
GitHub
GitHub
. 상세 기능:
영업기회 등록: 새로운 **리드(lead)**나 딜이 발굴되면 영업 담당자는 해당 영업기회를 시스템에 생성합니다. 등록 시 거래명(기회 명칭), 관련 고객사, 관심 제품/서비스, 예상 거래금액(value), 예상 종료일(클로즈 날짜) 등을 입력합니다
GitHub
. 또한 영업기회에 담당 영업사원을 지정하고, 현재 영업 단계(예: 초기 접촉, 요구분석 등)를 설정합니다. 생성된 영업기회는 파이프라인 보드의 초기단계 칼럼에 카드로 추가됩니다
GitHub
.
영업단계 정의 및 이동: 파이프라인 단계는 일반적으로 잠재고객 발굴 → 접촉 → 제안 → 협상 → 승인/계약 → 종료 등의 스테이지로 구성됩니다. 사용자는 영업기회 상세 화면이나 칸반(Kanban) 보드 상에서 드래그 앤 드롭으로 카드를 옮기거나, 드롭다운을 통해 단계를 업데이트할 수 있습니다. 단계 변경 시 해당 영업기회의 확률(승산) 값이 자동 조정되거나(예: 협상 단계=70% 등), 예상 매출액에 가중치를 적용해 파이프라인 예상치를 산출합니다 (이 규칙은 설정값으로 관리됨). 단계 변경 사항은 시스템에 즉시 저장되고 관련자에게 공유됩니다
GitHub
.
활동 연결: 각 영업기회에는 관련된 고객 활동(미팅, 견적 제안 등)을 연결하여 볼 수 있습니다. 예를 들어 특정 딜을 선택하면 해당 딜과 연관된 미팅 일정, 통화 기록이 표시되며, 사용자는 영업기회 화면에서 바로 새 활동 추가를 통해 해당 딜 관련 메모를 남길 수 있습니다
GitHub
. 이를 통해 개별 영업기회 진행에 대한 모든 맥락(문의 내용, 고객 반응 등)을 한 화면에서 파악할 수 있습니다.
영업기회 상세 및 편집: 영업기회 카드/항목을 클릭하면 상세 정보를 볼 수 있습니다. 여기에는 기본 정보와 함께 상세 설명(description), 현재 단계(stage), 우선순위(높음/보통/낮음), 소스(리드 출처: 소개, 웹문의 등), 확률(%), 예상 수익 등이 포함됩니다
GitHub
GitHub
. 사용자는 권한에 따라 이 정보를 편집하여 기회 정보를 최신화할 수 있습니다 (예: 고객 피드백에 따라 확률 상향 조정 등).
파이프라인 보드 및 통계: 영업 파이프라인은 보드 뷰로 제공되어 단계별로 현재 몇 건의 기회가 있는지 한눈에 볼 수 있습니다. 각 단계 칼럼에는 해당 단계의 딜 카드가 표시되고, 카드에는 고객명, 거래명, 금액, 담당자 등이 요약되어 나타납니다. 팀장은 전체 파이프라인을 모니터링하며, 단계별 딜 수와 총 예상 매출을 실시간 확인합니다
GitHub
GitHub
. 또한 파이프라인 상태를 기반으로 한 KPI 대시보드를 통해 팀원의 개인별 실적 (예: 진행 중 딜 수, 월별 신규 리드 수)와 목표 대비 달성률 등을 차트로 확인할 수 있습니다
GitHub
.
영업기회 단계별 로직:
단계 전진 규칙: 영업기회는 순차적 단계 진행이 원칙입니다. 선행 단계가 완료되어야 다음 단계로 이동하도록 설정할 수 있고, 특정 단계에서 필요한 필수 정보가 입력되지 않으면 다음 단계로 이동할 수 없도록 검증합니다. 예를 들어 제안 단계로 가려면 견적서가 첨부되어야 하고, 협상 단계에서 계약 단계로 가려면 할인 승인이 완료되어야 합니다.
Win/Loss 처리: 영업기회의 결과가 확정되면, 성공(Win) 또는 **실패(Loss)**로 마감합니다. 성공으로 마감 시 해당 기회의 상태를 "Won(수주성공)"으로 표시하고 파이프라인에서 제거되며, 매출관리 모듈에 자동으로 연결되어 후속 처리(발주/매출 기록)가 시작됩니다
GitHub
. 실패로 마감하면 "Lost(실패)" 상태로 표시하고 이유 코드를 입력받습니다 (예: 가격 경쟁력 부족, 고객 예산 문제 등) – 이를 통해 추후 실패 원인 분석이 가능하도록 데이터 축적합니다.
자동 알림: 영업기회가 오랫동안 정체되어 있는 경우 (예: 30일 이상 단계 변경 없음) 시스템이 담당자에게 리마인드 알림을 보냅니다. 또한 클로즈 예정일이 임박하거나 경과했는데도 Open 상태인 딜에 대해서는 관리자가 대시보드에서 하이라이트로 볼 수 있도록 표시합니다.
화면 흐름 예시: 영업 팀원이 영업 파이프라인 화면에서 "+ 영업기회 추가" 버튼으로 새로운 기회를 생성합니다
GitHub
. 생성된 딜 카드가 "초기" 단계 칼럼에 나타나고, 담당자는 진행하며 단계에 따라 카드를 우측으로 이동시킵니다 (예: 접촉 → 제안 칼럼으로 이동). 견적 제출 후 협상 단계로 변경하고 메모를 업데이트합니다. 최종 계약에 성공하면 해당 딜을 "Win"으로 마감하여 파이프라인에서 제거되고, 자동으로 매출 기록 프로세스가 시작됩니다
GitHub
. 팀장은 KPI 대시보드에서 이 딜의 성공으로 인한 팀 실적 상승을 바로 확인합니다.
7. 견적서 작성/수정/승인 및 PDF 출력 흐름
요약: 견적 관리 기능을 통해 영업사원이 고객 견적서를 시스템상에서 작성하고, 내부 승인이 필요한 경우 결재 프로세스를 거친 후, 최종 견적서를 PDF로 출력하거나 이메일로 발송할 수 있습니다
GitHub
GitHub
. 견적서에는 제품 및 가격 정보가 자동 연동되며, 고객 승인 후에는 발주 확정 및 매출 기록 단계로 이어집니다. 상세 기능:
견적서 작성: 영업기회 진행 중 제안 단계에서, 담당자는 시스템 내에서 새 견적서 작성을 시작합니다. 견적 생성 화면에서 고객사와 담당자가 자동 선택되며, 제품 목록에서 판매할 상품을 검색하여 선택합니다
GitHub
. 각 제품별 수량과 단가(시스템에 등록된 기준가격 자동 불러오기)를 입력하면 총액이 계산됩니다. 할인이나 특별 조건이 있는 경우 각 품목별 또는 전체 견적에 대한 할인율/할인금액을 입력할 수 있고, 적용 시 할인된 금액과 최종 합계가 즉시 반영됩니다. 견적 메모 필드에 결제 조건이나 기타 유의사항을 추가하고 저장하면 견적서 레코드가 생성됩니다
GitHub
.
견적서 수정: 생성된 견적서는 임시 저장 상태로 두고 내용 수정을 반복할 수 있습니다. 고객과 협상 과정에서 수량 변경이나 추가 할인 요구가 있으면 해당 견적서를 열어 수정(Edit) 모드로 진입, 품목이나 금액을 조정한 뒤 업데이트합니다. 수정 이력이 버전으로 관리되어, 주요 변경 사항(折扣율 변경 등)을 추적할 수 있습니다.
내부 승인 절차: 할인율이나 조건이 회사 정책 기준을 초과하는 견적의 경우 내부 승인(결재) 절차를 거치도록 워크플로우가 마련되어 있습니다. 예를 들어 **총 할인율이 20%**를 넘는 견적서는 저장 시 자동으로 승인 요청 필요 상태가 되고, 해당 견적서와 연동된 전자결재 모듈에 할인 승인 요청서가 생성됩니다
GitHub
. 팀장 등 승인권자는 결재 함에서 견적 할인 승인을 검토하여 승인 또는 반려합니다
GitHub
. 승인 시 견적서는 "승인완료" 상태로 바뀌며 PDF 출력이나 고객 공유가 가능해집니다. 반려된 경우 영업담당자에게 사유와 함께 통보되고, 담당자는 견적 내용을 수정한 후 재승인을 요청합니다
GitHub
. 이 결재 과정은 실시간 알림으로 진행 상황을 관련자에게 전파합니다 (요청시, 승인/반려시 알림).
PDF 출력 및 공유: 견적서가 최종 작성 및 내부 승인(필요한 경우)을 거치면 PDF 생성 기능을 통해 표준 양식의 견적서를 출력합니다
GitHub
GitHub
. 회사 로고 및 고객사/담당자 정보, 품목 리스트와 금액, 발행일 등이 자동으로 양식에 반영됩니다. 출력된 PDF는 시스템에 파일로 저장되며, 이메일로 전송 기능을 통해 고객에게 바로 송부할 수도 있습니다. 이메일 전송 시 본문에 간략 메시지와 함께 PDF가 첨부되며, 발송 이력이 고객 기록에 남습니다.
승인 후 발주 확정: 고객이 견적 내용에 동의하면 영업담당자는 해당 견적 레코드를 "수주 확정"으로 상태 변경합니다
GitHub
. 이때 발주 번호, 납기 예정일 등 추가 정보를 입력하여 확정된 주문서로 전환하게 됩니다
GitHub
. 견적 상태는 "고객확정"으로 표시되고, 이후 매출 관리 모듈로 데이터를 넘겨 매출 기록 단계가 시작됩니다
GitHub
.
견적서 관리: 시스템에서는 진행 중인 모든 견적서를 리스트로 관리합니다. 사용자는 견적 목록 화면에서 견적서 번호, 고객명, 금액, 상태(작성중/승인대기/승인완료/확정 등)별로 필터링하고 검색할 수 있습니다. 이를 통해 현재 어떤 견적들이 오픈되어 있고 어떤 단계에 있는지 한눈에 파악할 수 있습니다. 또한 과거에 발행된 견적서는 이력 보관되어 추후 참고나 복사하여 새 견적 생성에 활용될 수 있습니다.
화면 흐름 예시: 영업담당자가 영업기회 상세 화면에서 "견적서 발행" 버튼을 클릭합니다. 제품과 수량을 선택해 견적서를 작성하고 높은 할인율을 입력하자, 시스템이 자동으로 승인 절차를 안내합니다. 담당자가 견적서를 제출하면 팀장에게 할인 승인 요청 알림이 전송되고, 팀장은 전자결재 모듈에서 내용을 검토 후 승인합니다
GitHub
. 승인 완료 알림을 받은 영업담당자는 견적서를 PDF로 생성하여 고객에게 전송합니다. 며칠 후 고객의 구두 승인이 확인되면, 해당 견적을 수주 확정 처리하여 주문 데이터를 완료하고 청구서를 발행합니다
GitHub
.
8. 제품 정보 및 가격 제안 관리
요약: 제품관리 모듈에서는 당사가 취급하는 모든 제품/서비스의 정보를 중앙에서 관리합니다. 영업팀이 제안서나 견적서 작성 시 참고할 최신 제품 스펙과 가격 정보를 제공하고, 마케팅팀은 제품 카탈로그와 경쟁사 대비 가격 정보를 유지 보수합니다
GitHub
GitHub
. 제품별 판매 실적 및 재고 현황도 이 모듈에서 파악할 수 있습니다. 상세 기능:
제품 목록 관리: 판매 중이거나 판매 예정인 제품 목록을 시스템에 등재하고 편집할 수 있습니다. 각 제품에는 제품명, 제품 코드(SKU), 카테고리 (제품군), 기본 가격(판매 정가), 규격/사양, 제품 설명 등의 필드를 갖추고 있습니다
GitHub
. 필요에 따라 제품 이미지나 설명서 PDF를 첨부하여 제품 상세 페이지에서 볼 수 있도록 합니다.
제품 모델/옵션 지원: 하나의 제품에 대하여 여러 모델이나 버전을 관리할 수 있습니다. 예를 들어 제품 "Elasty"에 대해 모델 E, G, D 등 세부 모델명을 등록할 수 있습니다
GitHub
. 각 모델별로 모델번호, 가격, 규격이 다를 경우 개별 입력하며, 제품 상세 페이지에서 트리나 드롭다운 형태로 모델별 정보를 볼 수 있습니다.
재고 관리 통합: 제품 별로 재고 현황 정보를 추가로 관리합니다
GitHub
. 재고 테이블에는 현재 재고 수량, 샘플 재고, 판매량, 불량/교환 수량 등이 기록되어, 영업 시 현재 재고를 확인할 수 있습니다. (재고 데이터는 외부 ERP와 연동하여 실시간 업데이트하거나, 수동 업데이트 기능을 제공합니다.)
가격 정책 및 할인: 제품마다 가격 정책을 설정하여 일관성을 유지합니다. 예를 들어 정가, 권장소비자가, 영업팀 판매가, 대량 구매 할인율 등을 정의하고 저장해둡니다
GitHub
. 영업 관리 모듈의 견적 기능과 연계되어, 견적 작성 시 자동으로 해당 고객 등급이나 수량에 따른 할인율을 적용할 수 있습니다. 또한 특별 할인 캠페인 기간 등의 가격 변경을 일시적 정책으로 반영하고 기간 종료 시 원복하는 기능도 고려합니다.
경쟁사 제품 정보: 마케팅 담당자는 우리 제품과 유사한 경쟁사 제품의 이름과 가격을 등록/갱신할 수 있습니다
GitHub
. 제품 상세 화면에서 경쟁 제품 대비 가격 우위/열위 정보를 표로 제공하여, 영업사원이 고객에게 가격 제안을 할 때 참고하도록 합니다. 예를 들어 "경쟁사 A 제품 가격 100만원, 당사 제품 90만원" 식으로 비교하여 설득에 활용합니다.
제품 검색 및 필터: 제품 목록이 많아질 경우를 대비해 검색/필터 기능을 제공합니다
GitHub
. 제품명 키워드 검색이나 카테고리별 필터, 가격 범위 슬라이더 등의 UI로 원하는 제품을 빠르게 조회할 수 있습니다. 또한 단종 제품이나 판매 중지 제품은 별도 상태값으로 관리하여 리스트에서 구분하거나 숨길 수 있습니다.
제품별 매출 통계: 제품관리 모듈은 매출관리와 연계되어 각 제품의 판매 실적을 확인할 수 있습니다
GitHub
. 예를 들어 특정 제품을 선택하면 우측 패널에 해당 제품의 누적 판매량, 매출 금액, 최근 분기별 판매 트렌드 등을 차트로 보여줍니다. 이를 통해 어떤 제품이 인기 상품인지, 어떤 제품이 성장 정체인지 파악하여 마케팅 전략에 반영합니다.
화면 구성: 제품 관리는 좌측에 제품 목록/검색 패널, 우측에 제품 상세 정보 패널 형태로 UI가 구성됩니다
GitHub
. 좌측에서 카테고리별로 제품을 탐색하거나 검색어로 필터링하고, 특정 제품을 클릭하면 우측에 상세 정보(스펙, 가격, 재고, 경쟁사 비교 등)가 표시됩니다. "제품 편집" 버튼을 누르면 해당 상세 패널이 편집 가능 필드로 전환되어 정보를 수정하거나, "신규 제품 추가" 버튼으로 빈 폼에 새 제품 정보를 입력하여 저장할 수 있습니다
GitHub
. 화면 흐름 예시: 마케팅 담당자가 제품 관리 화면에서 "+ 신제품 추가"를 클릭합니다. 신규 제품명, 카테고리, 가격 등을 입력하여 제품을 등록합니다
GitHub
. 이어서 해당 제품 상세에서 "경쟁사 정보 추가" 버튼으로 경쟁 제품명과 가격을 입력해둡니다. 영업사원이 견적서를 작성할 때 이 제품을 선택하면 자동으로 기본 가격과 설정된 할인 정책이 적용되고, 필요 시 경쟁사 대비 가격 우위를 설명하는 자료로 활용합니다. 제품 출시 후 일정 기간이 지나면 제품 관리 대시보드에서 분기별 판매 추이를 확인하여 해당 제품의 시장 안착 여부를 평가합니다.
9. 주요 API 목록 및 설명 (GraphQL 기반)
LN Partners 고객관리 시스템은 Apollo GraphQL API를 통해 프론트엔드와 백엔드가 통신합니다. 주요 도메인(고객, 담당자, 영업기회, 활동, 제품 등)에 대해 GraphQL Query(조회)와 Mutation(생성/수정/삭제) API를 제공합니다. 아래는 핵심 API 목록과 기능에 대한 설명입니다.
9.1 Query (조회) API
customers(limit, offset, search): 고객사 리스트 조회. 페이징 및 검색어(search) 필터를 받아 해당 조건의 고객 목록을 반환합니다. 각 고객에는 기본정보와 주요 필드(회사명, 이메일, 전화번호, 업종, 등급 등) 및 담당 영업사원, 대표 연락처명이 포함됩니다
GitHub
GitHub
.
customer(id): 특정 고객 상세 조회. 고객 ID를 받아 해당 고객의 모든 세부 정보를 반환합니다. contacts 필드에 연결된 모든 담당자(Contact Person) 목록 (이름, 부서, 직책, 연락처 등)과 facilityImages(고객사 이미지 자료), 담당 영업사원 정보 등이 포함됩니다
GitHub
GitHub
. 이를 통해 고객 프로필 화면 구성을 위한 모든 데이터를 단일 쿼리로 획득합니다.
customerActivities(filter, limit, offset): 고객 활동 이력 조회. 필터(예: 특정 고객ID, 활동 유형 등)에 따라 활동 기록 목록을 반환합니다. 각 활동에는 타입(미팅/통화/VOC 등), 제목, 내용, 활동일시, 작성자 등이 포함되며, 연관된 고객 정보와 작성자(User) 정보도 하위 필드로 제공합니다
GitHub
GitHub
.
salesOpportunities(filter): 영업기회(딜) 목록 조회. 전체 또는 조건별 영업기회 리스트를 반환하며, 각 SalesOpportunity 항목에 제목, 설명, customerId 및 연관 고객정보, assignedUser(담당 영업사원), 예상금액(value), 단계(stage), 확률(probability), 예상 종료일 등이 포함됩니다
GitHub
GitHub
. 이를 통해 영업 파이프라인 보드 및 KPI 통계를 구성합니다.
salesItems(filter): 매출(실제 거래) 목록 조회. 필터(예: 기간, 고객 등)에 따라 SalesItem들의 리스트를 반환하며, 각 항목은 개별 판매 품목 단위의 정보입니다. 판매 일자, 제품, 수량, 단가, 총액, 원가 및 마진, 결제상태, 담당 영업사원, 고객사 등 세부 필드가 포함됩니다
GitHub
GitHub
. 이 API는 매출 리스트 화면이나 엑셀 내보내기 등에 활용됩니다.
products(categoryId, search): 제품 목록 조회. 카테고리별 또는 검색어로 제품을 필터링하여 id, 이름, SKU, 가격, 카테고리, 상태 등의 정보를 반환합니다. 또한 연관된 category 객체(카테고리명)나 모델 목록을 포함시켜 제품 선택 UI에서 활용합니다
GitHub
GitHub
.
product(id): 단일 제품 상세 조회. 제품 ID로 해당 제품의 모든 세부 정보(스펙, 가격, 설명, 모델들, 인센티브, 재고 등)를 반환합니다. (구현 상 product 쿼리가 있다면 사용, 없을 경우 products로 모두 받아 프론트에서 필터링.)
기타 조회 API: 이 밖에도 사용자 목록 조회 (users 쿼리)
GitHub
, 영업사원 검색 (salesReps 별도 쿼리)
GitHub
, 카테고리 목록 (categories 쿼리)
GitHub
, 주소 목록 (addresses) 등 지원하는 다양한 조회 API가 있습니다. 이러한 쿼리들은 주로 드롭다운 선택지 제공이나 조회 화면에 사용됩니다.
9.2 Mutation (쓰기) API
createCustomer(input: CustomerInput!): 새로운 고객을 생성합니다. 입력 데이터로 회사명, 연락처, 이메일, 주소, 업종, 등급 등의 CustomerInput을 받아 고객 레코드를 만들고, 생성된 고객 객체(필드 일체 포함)를 반환합니다
GitHub
GitHub
. 생성 시 함께 담당자 정보(contacts 배열)도 포함해서 보내면, 내부적으로 ContactPerson도 동시에 생성되어 연계됩니다.
updateCustomer(id: ID!, input: CustomerInput!): 기존 고객사의 정보를 수정합니다. 해당 고객 ID와 변경할 필드들을 받아 고객 레코드를 업데이트하고, 갱신된 정보를 반환합니다
GitHub
GitHub
. 예를 들어 고객 등급이나 주소 등을 수정할 때 사용합니다.
deleteCustomer(id: ID!): 고객사를 삭제(비활성화)합니다. 삭제 성공 여부 또는 에러 메시지를 반환합니다
GitHub
. 보통 연관된 딜이나 기록이 있을 경우 실제 삭제 대신 status 필드를 "INACTIVE"로 변경하여 리스트에서 숨기고 데이터는 보존하는 방식을 취합니다 (구현에 따라 soft delete).
addContactPerson(customerId: ID!, input: ContactPersonInput!): 특정 고객에 **담당자(Contact Person)**를 새로 추가합니다. 이름, 부서, 직책, 전화, 이메일 등 ContactPersonInput을 받아 해당 고객사의 새로운 연락처 인물로 등록하고, 생성된 ContactPerson 객체를 반환합니다
GitHub
GitHub
.
updateContactPerson(id: ID!, input: ContactPersonInput!): 연락처 인물 정보를 수정합니다. 예를 들어 담당자의 전화번호 변경 시 이 뮤테이션을 호출하며, 업데이트된 필드를 반환합니다
GitHub
.
deleteContactPerson(id: ID!): 담당자 삭제. 삭제 후 { success, message } 결과를 반환합니다
GitHub
.
createCustomerActivity(input: CustomerActivityInput!): 고객 활동 기록 생성. 활동 내용(제목, 유형, 날짜, 설명 등)을 받아 CustomerActivity 레코드로 저장하고, 생성된 활동 객체를 반환합니다
GitHub
GitHub
. 활동 객체에는 연결된 customer와 작성자 정보도 포함됩니다.
updateCustomerActivity(id: ID!, input: CustomerActivityUpdateInput!): 활동 기록 수정. 주어진 활동 ID의 내용(예: 결과나 nextAction 등)을 갱신하고, 변경 후 객체를 반환합니다
GitHub
GitHub
.
deleteCustomerActivity(id: ID!): 활동 기록 삭제. { success, message }로 성공 여부를 반환합니다
GitHub
.
createSalesOpportunity(input: SalesOpportunityInput!): 새로운 영업기회를 등록합니다. 거래명, 고객ID, 예상금액, 단계, 확률, 예상종료일 등의 SalesOpportunityInput을 받아 영업기회 레코드를 생성하고 반환합니다
GitHub
GitHub
.
updateSalesOpportunity(id: ID!, input: SalesOpportunityInput!): 기존 영업기회의 정보를 업데이트합니다. 단계 변경, 금액 변경 등 수행 시 사용하며, 업데이트 후 객체를 반환합니다
GitHub
. 예를 들어 영업단계를 협상으로 변경하거나, 확률을 조정할 때 호출합니다.
deleteSalesOpportunity(id: ID!): 영업기회를 삭제합니다 (딜 취소 처리). { success, message } 또는 단순 Boolean 반환. 보통 딜 취소 시 데이터 보존을 위해 status 필드만 바꾸고 실제 삭제하지 않을 수 있습니다.
createSalesItem(input: SalesItemInput!): 매출 품목(주문 품목) 생성. 고객, 제품, 수량, 단가 등 SalesItemInput을 받아 판매 기록을 추가하고, 생성된 SalesItem 객체를 반환합니다
GitHub
GitHub
. 보통 견적 확정 후 여러 제품 라인을 각각 SalesItem으로 저장하며, 필요한 경우 동일한 주문 코드를 부여해 그룹화합니다.
updateSalesItem(id: Int!, input: SalesItemUpdateInput!): 매출 품목 수정. 이미 등록된 판매 내역의 수량이나 가격, 결제상태 등을 수정하고 업데이트된 항목을 반환합니다
GitHub
GitHub
.
deleteSalesItem(id: Int!): 매출 품목 삭제. { success, message } 반환
GitHub
.
createProduct(input: ProductInput!), updateProduct(...), deleteProduct(...): 제품 정보에 대한 생성/수정/삭제 API. 새 제품을 추가하거나 기존 제품 정보를 수정/삭제하는 데 사용됩니다 (세부 구현은 유사한 패턴으로 구성).
...Category...: 제품 카테고리나 영업활동 카테고리 등에 대한 생성/수정 API도 있으며, 예를 들어 createSalesCategory(input)으로 영업 매출 카테고리를 추가하는 기능 등이 존재합니다
GitHub
GitHub
.
(참고: 모든 Mutation 응답에는 일반적으로 success와 message 필드 또는 업데이트된 객체 데이터가 포함됩니다. 또한 주요 생성/수정 시 서버 측에서 실시간 구독(GraphQL Subscriptions)이나 알림을 통해 관련 클라이언트에 변경 사항을 전파할 수 있도록 설계되어 있습니다.)
10. 데이터 모델 스키마 (주요 엔티티 구조 및 필드 정의)
시스템의 핵심 데이터 엔티티와 테이블 구조는 아래와 같습니다
GitHub
GitHub
. 각 엔티티의 주요 필드와 데이터 타입, 그리고 간략한 설명을 표로 정리합니다. (PK=Primary Key, FK=Foreign Key를 표시)
10.1 Customer (고객사) 엔티티
고객사 기본 정보를 저장하는 테이블입니다. 한 고객 레코드에는 여러 Contact Person과 여러 VOC/Activity, 여러 Sales(영업기회/거래)가 연결됩니다
GitHub
.
필드명	타입	설명
id (PK)	Int (Auto Inc)	고객 고유 식별자
name	VARCHAR(100)	회사명 또는 고객사 명칭
industry	VARCHAR(50)	업종/산업 분야 (예: 제조, 금융)
companyType	ENUM or VARCHAR	회사 유형 (SME:중소기업, 대기업 등)
GitHub
grade	ENUM or VARCHAR	고객 등급 (A/B/C 등급, VIP 등)
GitHub
phone	VARCHAR(20)	대표 연락처 번호 (대표 전화)
email	VARCHAR(100)	대표 이메일 주소
address	TEXT	회사 주소 (다국가 주소 체계 포함)
contactName	VARCHAR(50)	주요 연락 담당자 이름 (대표 담당자)
assignedUserId (FK)	Int	담당 내부 직원 (영업사원) 사용자ID
status	VARCHAR(20)	상태 (ACTIVE, INACTIVE 등)
createdAt	DATETIME	등록일
updatedAt	DATETIME	수정일
관계: 한 Customer → 여러 ContactPerson, 여러 SalesOpportunity, 여러 CustomerActivity (VOC 포함)
GitHub
GitHub
. 담당 내부직원은 User 테이블과 N:1 관계.
10.2 ContactPerson (고객 담당자) 엔티티
고객사에 소속된 연락 담당자(개인) 정보를 관리하는 테이블입니다. 고객 1명당 여러 ContactPerson이 있을 수 있습니다
GitHub
.
필드명	타입	설명
id (PK)	Int (Auto Inc)	담당자 고유 식별자
customerId (FK)	Int	소속 고객사 ID (Customer 참조)
name	VARCHAR(50)	담당자 이름
department	VARCHAR(50)	부서 (예: 구매팀, 연구소)
position	VARCHAR(50)	직책 (예: 과장, 팀장)
phone	VARCHAR(20)	연락처 전화번호
email	VARCHAR(100)	이메일 주소
birthDate	DATE	생년월일 (선택 입력)
facebook	VARCHAR(100)	Facebook 계정 링크
tiktok	VARCHAR(100)	TikTok 계정 링크
instagram	VARCHAR(100)	Instagram 계정 링크
profileImage	VARCHAR(255)	프로필 사진 URL
createdAt	DATETIME	등록일
updatedAt	DATETIME	수정일
관계: Customer(1) ↔ ContactPerson(N). 하나의 고객사가 여러 담당자를 가질 수 있습니다. (ContactPerson 엔티티는 Plan 문서에는 직접 명시되지 않았으나 구현상 존재하며, 고객 상세 조회 시 contacts 배열로 반환됩니다
GitHub
.)
10.3 SalesOpportunity (영업기회/딜) 엔티티
영업 파이프라인 상의 잠재 거래(딜)을 나타내는 테이블입니다. 견적/계약 전까지의 영업단계를 관리합니다.
필드명	타입	설명
id (PK)	Int (Auto Inc)	영업기회(딜) 고유 식별자
title	VARCHAR(100)	딜 명칭 (거래명)
GitHub
description	TEXT	상세 설명/메모 (고객 요구 등)
GitHub
customerId (FK)	Int	관련 고객사 ID
assignedUserId (FK)	Int	담당 영업사원 (User ID)
stage	VARCHAR(20)	영업 단계 (예: Prospect, Proposal, Negotiation, Won, Lost 등)
GitHub
probability	INT (%)	승산 확률 (단계에 따른 % 또는 수동 입력)
GitHub
value (expectedAmount)	DECIMAL	예상 거래금액 (예상 매출)
GitHub
expectedCloseDate	DATE	예상 종료일 (클로즈 예정일)
GitHub
actualCloseDate	DATE	실제 종료일 (Win/Loss 확정일)
status	VARCHAR(20)	상태 (OPEN, WON, LOST 등)
source	VARCHAR(50)	리드 출처 (예: 소개, 웹사이트 문의)
priority	VARCHAR(10)	우선순위 (High/Medium/Low)
createdAt	DATETIME	생성일
updatedAt	DATETIME	수정일
관계: Customer(1) ↔ SalesOpportunity(N)
GitHub
, User(1) ↔ SalesOpportunity(N) (담당자). 하나의 영업기회는 여러 SalesItem(견적 품목)과 연결될 수 있습니다 (견적서 작성 시)
GitHub
. 또한 영업기회와 여러 CustomerActivity가 연관될 수 있습니다 (활동 이력의 dealId로 연결, 구현에 따라).
10.4 SalesItem (거래 품목/매출) 엔티티
실제 거래에서 판매된 개별 품목을 나타내는 테이블입니다. 하나의 계약/주문에 여러 품목이 있을 수 있으며, 각 품목별 수익 정보를 포함합니다.
필드명	타입	설명
id (PK)	Int (Auto Inc)	매출 품목 레코드 ID
salesOpportunityId (FK)	Int	관련 영업기회/딜 ID (선택: 견적과 연결)
salesItemCode	VARCHAR(50)	거래 코드/번호 (같은 주문 묶음 식별용)
GitHub
productId (FK)	Int	판매 제품 ID
productModelId (FK)	Int	판매 제품의 모델 ID (있다면)
categoryId (FK)	Int	매출 카테고리 ID (제품/서비스 구분 등)
quantity	INT	수량
unitPrice	DECIMAL	단가 (할인 전 단가 또는 기준 단가)
salesPrice	DECIMAL	판매가 (할인 적용된 단가)
totalPrice	DECIMAL	총 가격 (salesPrice * quantity)
discountRate	DECIMAL(5,2)	할인율 (%) (필요시)
cost	DECIMAL	개당 원가 (제품 원가)
totalCost	DECIMAL	총 원가 (cost * quantity)
margin	DECIMAL	개당 마진 (salesPrice - cost)
totalMargin	DECIMAL	총 마진 (totalPrice - totalCost)
marginRate	DECIMAL(5,2)	마진율 (%)
type	VARCHAR(20)	거래 유형 (예: 제품판매, 용역 etc)
salesDate	DATE	매출 발생일 (납품일/매출인정일)
paymentStatus	VARCHAR(20)	결제 상태 (미결제, 일부입금, 완납 등)
paidAmount	DECIMAL	입금 금액 (부분 입금 시 누적금액)
createdAt	DATETIME	생성일
updatedAt	DATETIME	수정일
관계: SalesOpportunity(1) ↔ SalesItem(N)
GitHub
 (영업기회가 확정되어 매출로 전환된 경우 관계 맺음). Product(1) ↔ SalesItem(N)
GitHub
, Category(1) ↔ SalesItem(N). SalesItem에는 거래를 묶는 상위 엔티티(주문/계약서)가 별도로 없으며, salesItemCode로 같은 주문의 품목들을 식별하거나, 필요시 SalesOrder 등의 상위 엔티티를 추가 설계할 수 있습니다.
10.5 Product (제품) 엔티티
회사에서 판매하는 제품 정보 테이블입니다. 제품별로 여러 모델 및 재고, 가격 정책이 연계됩니다.
필드명	타입	설명
id (PK)	Int (Auto Inc)	제품 고유 ID
name	VARCHAR(100)	제품명
sku	VARCHAR(50)	제품 코드 (SKU 등)
description	TEXT	제품 설명/사양
categoryId (FK)	Int	제품 분류 ID (카테고리)
price	DECIMAL(10,2)	기본 판매가 (정가)
GitHub
consumerPrice	DECIMAL(10,2)	권장 소비자 가격 (있다면)
GitHub
cost	DECIMAL(10,2)	제품 원가 (마진 계산용)
GitHub
incentiveA	DECIMAL(10,2)	인센티브 A (프로모션/커미션용 필드)
GitHub
incentiveB	DECIMAL(10,2)	인센티브 B (추가 인센티브)
GitHub
isActive	BOOLEAN	활성화 여부 (단종 여부 등)
createdAt	DATETIME	생성일
updatedAt	DATETIME	수정일
관계: Product(1) ↔ ProductModel(N) (제품별 모델/옵션 목록)
GitHub
, Category(1) ↔ Product(N). Product(1) ↔ SalesItem(N) (여러 거래에 사용)
GitHub
. 또한 Inventory(재고)와 1:1 또는 1:N 관계 (창고별 재고)로 연계될 수 있습니다
GitHub
.
10.6 기타 엔티티
ProductModel (제품 모델): 제품의 하위 모델 테이블. 필드: id, productId, name(모델명), modelNumber, price, consumerPrice, cost, incentiveA/B 등. 한 Product에 여러 Model.
Category (분류): 제품 또는 매출 등의 분류 코드 테이블. 필드: id, name, code, description, sortOrder, isActive 등
GitHub
GitHub
.
User (사용자): 시스템 사용자 (직원) 정보. 필드: id, 이름, 이메일, 부서, 직책, 역할ID 등
GitHub
. 역할(Role) 테이블과 다대다 관계(RBAC 구현)
GitHub
. 한 사용자는 여러 SalesOpportunity, 여러 CustomerActivity, 여러 Approval 문서를 작성하거나 담당할 수 있습니다
GitHub
.
Approval (결재 문서): 내부 전자결재 문서 (예: 할인 승인서 등). 필드: id, 종류(문서 타입), 작성자(userId), 상태(진행중/승인/반려), 내용 등
GitHub
. ApprovalStep: 결재선 단계 테이블로 다단계 결재 흐름을 관리 (approvalId, 결재자 userId, 순서, 승인여부 등)
GitHub
.
VOC/Activity (고객활동): 고객 VOC와 활동 내역을 통합한 테이블 (구현상 CustomerActivity로 표현). 필드: id, customerId, type, title, description, activityDate, createdBy(userId), ...(상세 위 활동 엔티티와 동일)
GitHub
. VOC도 type으로 구분되어 이 테이블에 저장되며, 추가로 status(처리상태) 필드를 둘 수 있습니다.
Log (시스템 로그): 사용자 활동 로그 테이블. 필드: id, userId, actionType, description, timestamp 등
GitHub
. 중요한 변경이나 로그인 기록 등을 저장.
Document (문서 저장소): 업로드된 파일 메타정보. 필드: id, filename, filepath, uploaderId, linkedModuleType, linkedModuleId 등
GitHub
. 예를 들어 견적서 PDF, 계약서 스캔본 등을 Document에 등록하고, Customer나 SalesOpportunity 등과 연결합니다.
(위 엔티티 및 관계는 제안된 데이터베이스 모델이며, 실제 구현 시 세부 필드명이나 타입은 조정될 수 있습니다. 관계는 ERD 다이어그램으로 나타내면 보다 명확하며, 특히 영업기회와 매출 품목 간 관계, VOC와 활동 간 관계에 유의합니다.)
11. 주요 비즈니스 로직 및 워크플로우 명세
시스템에서 자동으로 처리되거나 업무상 중요한 일련의 프로세스 흐름에 대해, 그 로직을 상세히 기술합니다. 특히 VOC 처리, 할인 승인, 영업기회 단계 관리 등의 워크플로우가 주요 포인트입니다.
VOC 처리 프로세스: VOC 등록부터 완료까지 상태에 따른 처리가 이루어집니다. 신규 VOC 등록 시 상태=신규로 설정되고 담당부서에 알림이 갑니다. 담당자는 VOC 상세를 확인하여 즉시 대응을 시작하거나 관련 부서에 지시합니다. 처리 중에는 VOC 항목의 상태를 "처리중"으로 업데이트하고, 진행 내용을 메모로 남깁니다. 문제가 해결되면 상태=완료로 변경하고 해결 내용을 기록합니다. 이때 시스템은 VOC 등록자(혹은 관련 영업사원)에게 자동 알림을 보내고, 필요하다면 고객에게 완료 통보 메일을 발송합니다. VOC 완료 후에도 CS팀은 며칠 내 고객에게 연락해 후속 만족도를 확인하고, 추가 조치가 필요한 경우 VOC를 재활성화하거나 새로운 VOC로 이어서 기록할 수 있습니다. (처리 완료된 VOC의 재개 발생 시 이력을 유지하고 상태를 재오픈하는 등 정책 결정이 필요합니다.)
자동 알림 로직: VOC 신규 등록 시 담당자 그룹(해당 제품 담당 팀 등)에 즉시 알림. 처리 지연 시(예: 3일 이상 처리중 상태) 시스템이 미해결 VOC 리마인드 발송. 완료 시 영업담당자 및 VOC 등록자에게 완료 알림.
상태 변경 제약: VOC는 완료로 변경 시 반드시 처리결과 내용이 입력되어야 합니다. 또한 반려/재개 로직이 있다면, 완료 후 고객 불만이 지속되어 재오픈해야 할 경우 새 VOC로 복제하거나 상태를 다시 처리중으로 변경하는 절차를 정의합니다.
할인 승인 절차: 영업 견적서에 대한 내부 할인 승인 워크플로우입니다. 정해진 기준 이상의 할인율이 적용되면 자동으로 전자결재 모듈을 통한 승인이 요구됩니다
GitHub
. 예를 들어 총 견적 금액 대비 할인율 > X%인 경우 승인 필요 플래그를 세웁니다. 영업담당자가 견적서를 제출하면 시스템은 관련 결재 문서를 생성하여 팀장에게 결재 요청을 합니다. 팀장은 결재 화면에서 할인 사유와 금액을 검토한 후 승인 또는 반려합니다
GitHub
. 승인되면 견적서 상태가 "승인완료"로 바뀌고 계속 진행 가능하며, 반려되면 견적서는 "반려됨" 상태로 표시되어 영업담당자가 내용을 수정한 후 재상신하도록 합니다
GitHub
. 이때 모든 결재 단계는 시스템 로그에 남고, 승인 시간이 기록됩니다.
승인 단계: 일반적으로 1단계 승인(팀장)으로 충분하나, 할인율이 매우 큰 경우 2단계 임원 승인을 추가할 수 있게 설계합니다 (예: 30% 이상은 본부장 승인). 이를 위해 ApprovalStep을 동적으로 생성하도록 구현할 수 있습니다.
결재 연동: 할인 승인 결재가 완료되면 연동된 견적 레코드에 승인자, 승인일시를 기록하고 편집 잠금 처리하여 임의 변경을 막습니다. 반려 시에는 사유를 영업담당자에게 전달하고, 견적 금액/조건을 변경한 후 다시 승인 요청하도록 UX를 유도합니다.
영업기회 단계별 로직: 영업 파이프라인에서 단계 이동에 따른 자동 로직들입니다.
단계가 "견적 제출"로 변경될 때: 해당 영업기회의 connected 견적서가 존재하지 않으면 시스템이 견적서 작성 프롬프트를 제공하거나 상태 변경을 막을 수 있습니다 (업무 규칙에 따라).
단계가 "협상"으로 변경될 때: 최근 견적서가 고객에게 공유된 시점 기록을 남기고, 특별 조건(할인 등)이 메모에 기재되어 있는지 확인합니다
GitHub
.
단계가 "승인 대기" (내부승인) 단계로 변경될 때: 할인 승인 프로세스가 완료될 때까지 잠금 상태로 두고, 승인 완료 신호를 받으면 자동으로 다음 단계(계약 체결)로 진행시킵니다.
단계가 "계약 체결" (Win)로 변경될 때: 해당 영업기회의 status를 "Won"으로 설정하고, 매출 기록 생성 로직이 트리거됩니다
GitHub
. 구체적으로, SalesOpportunity의 ID를 참조하여 SalesItem(매출) 레코드들을 생성하거나 기존 견적 품목들을 확정 매출로 복사합니다. 또한 청구서 발행 이벤트를 발생시켜 회계팀이 볼 수 있도록 하거나 고객에게 자동 인보이스 이메일을 발송하는 것을 고려합니다
GitHub
.
단계가 "종료(실패)"로 변경될 때: status를 "Lost"로 설정하고, 실패 사유 코드 입력 폼을 띄워 사용자로부터 상실 원인을 수집합니다. 입력된 실패 사유는 영업기회 데이터에 저장되고, 추후 리포트에서 집계되어 제품별/이유별 실패율 통계로 활용됩니다.
매출/수금 관리 로직: 견적이 발주 확정되어 매출로 전환된 이후의 절차입니다. 매출 기록에 결제 조건(예: 현금, 30일 어음 등)과 결제 기한을 설정하고, 입금 확인 단계에서 실제 입금 일자와 금액을 입력하면 해당 매출의 paymentStatus를 업데이트합니다. 만약 미수금(결제 기한을 넘도록 미납)이 발생하면 시스템이 이를 감지하여 담당 영업사원에게 자동 알림을 보냅니다
GitHub
. 예를 들어 기한+7일이 지나도 paymentStatus가 미납이면 경고 알림을 발생시켜 후속 조치를 취하도록 합니다
GitHub
. 또한 부분 입금의 경우 paidAmount 누적과 잔액 표시 로직을 통해 미수 잔액을 항상 계산하여 보여줍니다.
제품 가격 책정 및 연동 로직: 제품 관리 모듈에서 설정한 가격 정책은 영업 모듈에서 견적 작성 시 자동 적용됩니다
GitHub
. 구현 로직으로, 견적 Mutation에서 제품 ID를 입력받으면 해당 Product 엔티티의 price, incentive 필드를 조회하고, 만약 고객 등급별 할인가 정책이 존재하면 해당 고객의 grade를 참조하여 가격을 조정합니다. 예를 들어 등급 A 고객은 기본 10% 할인이라면 견적서 생성 시 자동으로 단가에 0.9를 곱해 적용합니다. 이러한 비즈니스 로직은 가격 일관성을 유지하고, 수작업 실수를 줄이기 위한 것입니다. 가격 정책 변경 시 (예: 제품 가격 인상) 기존 열려있는 견적서에 영향이 없도록, 견적 생성 시점에 가격을 snapshot하여 저장하는 설계를 적용합니다.
12. 알림 및 상태 변경 트리거 로직
시스템 내 주요 이벤트 발생 시 실시간 알림을 제공하여 사용자들이 필요한 정보를 즉각적으로 인지할 수 있게 합니다
GitHub
. 알림은 웹 애플리케이션 내 notification 센터, 이메일, 또는 추후 모바일 푸시를 통해 전달됩니다. 아래는 알림 및 트리거의 핵심 시나리오입니다.
VOC 상태 변화 알림: VOC가 새로 접수되면 관련 담당자(지정된 처리자 및 해당 고객의 영업담당자)에게 "[VOC] 신규 접수: <고객명> - <제목>" 알림을 전송합니다. VOC가 "처리중"으로 변경될 때는 등록자에게 중간 진행 알림을, "완료"로 변경될 때는 모든 관련자에게 "VOC 완료 보고" 알림을 보냅니다. 특히 지연 경고: VOC 접수 후 X시간 또는 X일 내 상태 변경이 없으면 자동 리마인드 알림을 발생시켜 신속한 대응을 독려합니다. 이때 알림 내용에 VOC 상세 링크와 지난 경과일을 포함합니다.
영업기회 단계 알림: 영업기회의 중요 단계 전환 시 팀원들에게 알림을 옵션으로 제공합니다. 예를 들어 딜이 Won (계약성공) 되면 팀장과 영업본부장에게 "[영업성공] <고객명> 계약 성사 (금액)" 알림을 보냅니다. Lost (실패) 처리 시에도 관리자가 이를 인지할 수 있도록 알림을 보낼 수 있습니다 (필수는 아니나 선택적 구성). 또한 특정 단계 도달 시 지원 부서 알림: 예를 들어 제안 단계 진입 시 기술지원팀에 알림을 보내 "데모/기술 검토 필요" 등을 알려 협업을 원활히 합니다.
할인 승인 요청/결재 알림: 할인율 초과로 견적 승인 요청이 발생하면 승인권자(팀장)에게 "[결재요청] <고객명> 견적 할인 승인 요청" 알림을 보냅니다
GitHub
. 팀장이 승인/반려 액션을 취하면 요청자(영업담당자)에게 "[결재완료] 견적 승인" 또는 "[결재반려] 견적 수정 필요" 알림을 즉시 전송합니다
GitHub
. 이로써 승인 프로세스의 투명성과 신속성을 확보합니다.
미수금/결제 알림: 매출 기록에서 결제 기한 경과 시 자동 알림이 트리거됩니다
GitHub
. 예컨대 결제 예정일+n일이 지났는데 paymentStatus가 미수인 경우 "[미수금] <고객명> <금액> 결제 지연" 알림을 해당 영업담당자와 회계 담당자에게 발송합니다. 부분 입금 후 잔액이 남아있는 경우도 일정 기간 경과 시 계속 리마인드를 보냅니다. 또한 입금이 확인되어 paymentStatus가 "완료"로 변경되면 "[입금확인] <고객명> <금액> 입금 완료" 알림을 영업담당자에게 보내 매출 확정을 상기시킵니다.
캘린더 일정 알림: 영업활동으로 등록된 미팅 일정이나 내부 결재 예정 시간 등에 대해 사전에 알림을 제공합니다. 예를 들어 미팅 시작 1시간 전에 참석자들에게 팝업/이메일 알림을 보내고, 결재 문서의 결재 기한이 있다면 마감 전날 승인자에게 독촉 알림을 보냅니다.
시스템 공지 및 공유: 시스템 내에서 중요한 이벤트가 발생하면 공지 모듈과 연동됩니다. 예를 들어 대형 계약이 성사된 경우 관리자가 공지사항에 해당 소식을 올리고, 팀원들에게 푸시 알림으로 "[공지] 신규 계약 <고객명> - 모두 축하 바랍니다" 등을 공유할 수 있습니다
GitHub
. (이 부분은 자동 트리거라기보다 관리자 수동 게시이지만, 이벤트와 연계하여 템플릿 제공 가능.)
모든 알림 트리거는 Notification Center DB에 로그를 남겨 누가 언제 어떤 알림을 받았는지 추적 가능하며, 읽음 상태를 관리합니다. 또한 설정에서 사용자별로 수신할 알림 종류(이메일 수신 여부 등)를 제어할 수 있도록 설계합니다. 전체적으로, 실시간 알림 기능은 사용자들이 놓치기 쉬운 중요 상태 변화를 즉각 캐치하게 함으로써, 업무 효율과 협업 대응력을 높이는 역할을 합니다
GitHub
. 以上, LN Partners 고객관리 시스템의 상세 기능 명세를 모두 기술했습니다. 이 명세서는 추후 개발 AI 에이전트가 구현 단계에서 참조할 수 있도록 기능적 세부사항과 비즈니스 로직을 포괄적으로 다룹니다. 각 모듈과 기능들이 일관되게 서로 연동되고, 실제 업무 시나리오에 유용하게 활용될 수 있도록 설계되었음을 강조합니다.