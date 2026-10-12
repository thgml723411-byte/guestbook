import { useState } from 'react'
import { GUESTBOOK_CHARACTERS, STAMPS, getStamp, getGuestbookCharacter } from './archiveData'
import ArchiveCharacter from './ArchiveCharacter'
import styles from './GuestbookForm.module.scss'

export default function GuestbookForm({ onAddpost, defaultNickname = '' }) {
  const [nickname, setNickname] = useState(defaultNickname)
  const [message, setMessage] = useState('')
  const [character, setCharacter] = useState(GUESTBOOK_CHARACTERS[0].id)
  const [stamp, setStamp] = useState(STAMPS[0].id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const selectedCharacter = getGuestbookCharacter(character, message).id

  async function submit(event) {
    event.preventDefault()
    if (saving) return
    if (!nickname.trim() || !message.trim()) {
      setError('이름과 한마디를 입력해주세요.'); return
    }
    setSaving(true); setError(''); setSuccess(false)
    try {
      await onAddpost({ nickname: nickname.trim(), message: message.trim(), character: selectedCharacter, stamp })
      setMessage(''); setSuccess(true)
    } catch {
      setError('흔적을 보관하지 못했습니다. 작성한 내용은 남아 있으니 다시 시도해주세요.')
    } finally { setSaving(false) }
  }

  return <section className={styles.composer} id='write' aria-labelledby='write-title'>
    <form onSubmit={submit} className={styles.form}>
      <p className='archive-label'>NEW ENTRY / 당신의 차례</p>
      <h2 id='write-title'>어떤 흔적을 남길까요?</h2>
      <fieldset disabled={saving}>
        <div className={styles.characterField}>
          <span id='character-label'>나를 대신할 캐릭터</span>
          <div className={styles.characters} role='group' aria-labelledby='character-label'>
            {GUESTBOOK_CHARACTERS.map((item) => <button key={item.id} type='button' className={`${styles.characterOption} ${selectedCharacter === item.id ? styles.characterSelected : ''}`} aria-label={`${item.label} 캐릭터 선택`} aria-pressed={selectedCharacter === item.id} onClick={() => { setCharacter(item.id); setSuccess(false) }}>
              <span className={styles.characterThumbnail}><ArchiveCharacter character={item.id} decorative /></span>
              {selectedCharacter === item.id && <span className={styles.characterCheck} aria-hidden='true'>✓</span>}
            </button>)}
          </div>
          {message.includes('스누피') && <p className={styles.characterHint}>‘스누피’가 들어간 글에는 스누피 캐릭터가 연결됩니다.</p>}
        </div>
        <label className={styles.field}>남길 이름<input value={nickname} onChange={(event) => setNickname(event.target.value)} placeholder='이곳에서 불리고 싶은 이름' maxLength={20} required autoComplete='nickname' /></label>
        <label className={styles.field}>남길 한마디<textarea value={message} onChange={(event) => { setMessage(event.target.value); setSuccess(false) }} placeholder='짧은 인사도 좋아요. 오늘의 마음을 놓고 가세요.' maxLength={500} required rows={5} /><span className={styles.count}>{message.length} / 500</span></label>
        <div className={styles.stampField}><span id='stamp-label'>마음을 담은 도장</span><div className={styles.stamps} role='group' aria-labelledby='stamp-label'>{STAMPS.map((item) => <button key={item.id} type='button' className={stamp === item.id ? styles.selected : ''} aria-pressed={stamp === item.id} onClick={() => setStamp(item.id)}>{item.label}</button>)}</div></div>
        <button type='submit' className='archive-button'>{saving ? '보관하는 중…' : '흔적 보관하기'} <span aria-hidden='true'>↗</span></button>
      </fieldset>
      {error && <p role='alert' className='archive-error'>{error}</p>}
      {success && <p role='status' className={styles.success}>당신의 흔적이 보관되었습니다. 아래 기록에서 만나보세요.</p>}
    </form>
    <aside className={styles.preview} aria-label='작성 중인 기록 미리보기'>
      <div className={styles.previewTop}><span>ARCHIVE NOTE</span><span>미리보기</span></div>
      <div className={styles.previewCharacter}><ArchiveCharacter character={selectedCharacter} /></div>
      <p className={styles.previewMessage}>{message || '당신의 한마디가\n이곳에 오래 남습니다.'}</p>
      <div className={styles.previewBottom}><span>{nickname.trim() || '당신의 이름'}</span><span className='archive-stamp'>{getStamp(stamp).label}</span></div>
    </aside>
  </section>
}
