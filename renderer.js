const contentEl = document.getElementById('content');
const pickFilesBtn = document.getElementById('pickFilesBtn');
const saveBtn = document.getElementById('saveBtn');
const fileListEl = document.getElementById('fileList');
const fileCountEl = document.getElementById('fileCount');
const statusEl = document.getElementById('status');

let selectedFilePaths = [];

function renderFileList() {
  fileListEl.innerHTML = '';
  if (selectedFilePaths.length === 0) {
    fileCountEl.textContent = '선택된 파일 없음';
    return;
  }
  fileCountEl.textContent = `${selectedFilePaths.length}개 선택됨`;
  for (const p of selectedFilePaths) {
    const li = document.createElement('li');
    li.textContent = p.split(/[\\/]/).pop();
    fileListEl.appendChild(li);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  contentEl.value = await window.api.loadClaudeMd();
});

pickFilesBtn.addEventListener('click', async () => {
  const paths = await window.api.pickFiles();
  if (paths.length > 0) {
    selectedFilePaths = paths;
    renderFileList();
  }
});

saveBtn.addEventListener('click', async () => {
  statusEl.classList.remove('ok');
  statusEl.textContent = '저장 중...';
  saveBtn.disabled = true;
  try {
    const result = await window.api.saveAll(contentEl.value, selectedFilePaths);
    statusEl.classList.add('ok');
    statusEl.textContent = `저장 완료: CLAUDE.md 및 파일 ${result.savedFiles.length}개 저장됨`;
  } catch (err) {
    statusEl.textContent = `오류: ${err.message}`;
  } finally {
    saveBtn.disabled = false;
  }
});
