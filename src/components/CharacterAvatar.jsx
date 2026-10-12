import React from 'react'
import CHARACTERS from './characterData'
import styles from './CharacterAvatar.module.scss'

// 글 내용별로 직접 정해둔 캐릭터 - 같은 닉네임이라도 글마다 다르게 지정 (띄어쓰기 무시)
const MESSAGE_CHARACTER = [
  ['이까이꺼', 'c2'],
  ['누구냐고', 'p3'],
]

// 닉네임별로 직접 정해둔 캐릭터 - 원래 고른 캐릭터보다 우선 적용 (띄어쓰기 무시)
const NICKNAME_CHARACTER = {
  '게스트': 'p1',
  '고양이피하기': 'p2',
}

const pickByOverride = (nickname = '', message = '') => {
  const text = message.replace(/\s/g, '')
  const byMessage = MESSAGE_CHARACTER.find(([keyword]) => text.includes(keyword))
  const id = byMessage ? byMessage[1] : NICKNAME_CHARACTER[nickname.replace(/\s/g, '')]
  return id ? CHARACTERS.find((item) => item.id === id) : null
}

// 삭제된 캐릭터를 골랐던 예전 방명록에 대신 보여줄 캐릭터
// 글에 '스누피'가 있으면 스누피(p4), 아니면 글 id로 c1~p7 중 하나를 항상 같게 골라줌
const pickFallback = (fallbackKey = '', message = '') => {
  if (message.includes('스누피')) return CHARACTERS.find((item) => item.id === 'p4')
  const hash = [...fallbackKey].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return CHARACTERS[hash % CHARACTERS.length]
}

const CharacterAvatar = ({character, fallbackKey, message, nickname}) => {
  const found = CHARACTERS.find((item) => (
    item.id === character || item.aliases?.includes(character)
  ))
  const characterData = pickByOverride(nickname, message)
    || found
    || (fallbackKey !== undefined ? pickFallback(fallbackKey, message) : null)

  if (!characterData) return null

  return (
    <div className={styles.avatarBox} style={{background: characterData.bg}}>
      <img
        key={characterData.src}
        className={styles.avatar}
        src={characterData.src}
        alt={characterData.label}
        onError={(e) => { e.target.style.display = 'none' }}
      />
    </div>
  )
}

export default CharacterAvatar
