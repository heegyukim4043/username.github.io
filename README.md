# Lab Site (GitHub Pages)

정적 파일만으로 운영 가능한 **랩 전용 레이아웃**입니다. Jekyll/빌드 없이도 동작하며,
모든 콘텐츠는 `data/*.json`에서 관리합니다.

## 빠른 시작
1. 이 폴더 내용을 깃허브 저장소에 올립니다.
   - 전체 홈페이지: `username.github.io`
   - 혹은 아무 저장소 → `https://username.github.io/<repo>/`
2. 저장소 **Settings → Pages**에서 배포(Deploy) 설정을 합니다.
3. `data/site.json`을 수정해 랩 이름/연락처를 바꿉니다.
4. `data/publications.json`, `data/projects.json`, `data/people.json`, `data/news.json`을 수정해 콘텐츠를 업데이트합니다.

## 파일 구조
- `index.html` — 홈(News/Featured/Projects 프리뷰 + Contact)
- `publications.html` — 검색/필터/정렬 가능한 출판 목록
- `projects.html` — 상태/태그 필터가 가능한 프로젝트 카드
- `people.html` — PI/PhD/MS/Alumni 등 사람 목록
- `news.html` — 날짜순 뉴스 피드
- `assets/style.css` — 다크모드 대응 기본 스타일
- `assets/lab.js` — JSON 로딩 및 렌더링, 필터/검색 로직
- `data/*.json` — 사이트 메타/콘텐츠 데이터

## 팁
- 커스텀 도메인을 쓰려면 Settings → Pages에서 연결 후 DNS에 CNAME을 등록하세요.
- 이미지는 `/assets/img/`를 만들어 넣고, JSON에서 절대/상대 경로로 참조하세요.
- Jekyll 기능이 필요 없다면 `.nojekyll` 파일을 유지하세요.


Lab Site (GitHub Pages)

A lab-website layout that runs with plain static files—no Jekyll or build step required. All content is managed in data/*.json. 

Quick Start (3–4 steps)

Upload this folder to your GitHub repository.

Main homepage: username.github.io

Or any repository → https://username.github.io/<repo>/

In the repository, open Settings → Pages and configure deployment.

Edit data/site.json to set your lab name and contact info.

Update content by editing data/publications.json, data/projects.json, data/people.json, and data/news.json.
These steps mirror your original README. 

File Structure

index.html — Home (News / Featured / Projects preview + Contact)

publications.html — Publications list with search/filter/sort

projects.html — Project cards with status/tag filters

people.html — People (PI / PhD / MS / Alumni, etc.)

news.html — Chronological news feed

assets/style.css — Base styles (supports dark mode)

assets/lab.js — Loads JSON and renders pages; search/filter logic

data/*.json — Site metadata and content
This structure follows the original file list.

Tips

To use a custom domain, connect it in Settings → Pages, then add a CNAME record in your DNS.

Store images under /assets/img/ and reference them via absolute or relative paths in JSON.

If you don’t need Jekyll features, keep the .nojekyll file so files are served as-is.
Translated from your original tips.
