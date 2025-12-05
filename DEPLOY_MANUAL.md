# 수동 배포 가이드

## 방법 1: gh-pages 브랜치에 직접 푸시 (권장)

### 1단계: 빌드

```bash
pnpm run predeploy
```

### 2단계: gh-pages 브랜치 생성 및 푸시

```bash
# gh-pages 브랜치로 체크아웃 (없으면 생성)
git checkout --orphan gh-pages

# 모든 파일 제거
git rm -rf .

# dist-advanced의 내용을 루트로 복사
cp -r dist-advanced/* .

# 파일 추가 및 커밋
git add .
git commit -m "Deploy advanced version"

# gh-pages 브랜치에 푸시
git push origin gh-pages --force

# main 브랜치로 돌아가기
git checkout main
```

## 방법 2: GitHub 웹에서 직접 업로드

1. GitHub 저장소로 이동
2. **Add file** → **Upload files** 클릭
3. `dist-advanced` 폴더의 모든 파일을 드래그 앤 드롭
4. 커밋 메시지 입력 후 **Commit changes**

## 방법 3: gh-pages 명령어 사용 (SSH 설정 후)

SSH 키를 설정한 후:

```bash
pnpm run deploy
```

## GitHub Pages 설정 확인

1. GitHub 저장소 → **Settings** → **Pages**
2. **Source**: **Deploy from a branch** 선택
3. **Branch**: **gh-pages** 선택
4. **Folder**: **/ (root)** 선택

## 배포 확인

배포 완료 후 몇 분 기다린 다음:

- `https://naringst.github.io/front_7th_chapter3-2/` 접속
