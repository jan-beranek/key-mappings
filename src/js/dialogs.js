export function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

export function showConfirm(message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';
  const box = document.createElement('div');
  box.className = 'confirm-box';
  const p = document.createElement('p');
  p.textContent = message;
  box.appendChild(p);
  const actions = document.createElement('div');
  actions.className = 'actions';
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn-secondary btn-sm';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = () => overlay.remove();
  actions.appendChild(cancelBtn);
  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'btn-danger btn-sm';
  confirmBtn.textContent = 'Delete';
  confirmBtn.onclick = () => { overlay.remove(); onConfirm(); };
  actions.appendChild(confirmBtn);
  box.appendChild(actions);
  overlay.appendChild(box);
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  document.body.appendChild(overlay);
}
