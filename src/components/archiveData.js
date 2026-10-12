import CHARACTERS from './characterData'

const CHARACTER_LABELS = { p1: '왕관', p2: '꼬마', p3: '잠자는', p4: '스누피', p5: '초록', p6: '안경', p7: '키티', p8: '선글라스 양' }
export const GUESTBOOK_CHARACTERS = CHARACTERS.filter((item) => /^p[1-8]$/.test(item.id)).map((item) => ({ ...item, label: CHARACTER_LABELS[item.id] }))
export const getGuestbookCharacter = (id, message = '') => GUESTBOOK_CHARACTERS.find((item) => item.id === (message.includes('스누피') ? 'p4' : id))

export const STAMPS = [
  { id: 'stamp:visited', label: '다녀감' },
  { id: 'stamp:hello', label: '안부' },
  { id: 'stamp:memory', label: '기억' },
  { id: 'stamp:cheer', label: '응원' },
]
export const getStamp = (id) => STAMPS.find((item) => item.id === id) || STAMPS[0]
export const formatDate = (timestamp) => timestamp?.toDate ? timestamp.toDate().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' }) : '보관 중'
