import { v4 as uuidv4 } from 'uuid';

let userId = localStorage.getItem('chameleon_used_id');
if (!userId) {
  userId = uuidv4();
  localStorage.setItem('chameleon_used_id', userId);
}

window.chmln.identify(userId);
window.pendo.initialize({ visitor: { id: userId } });
