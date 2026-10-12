import { getGuestbookCharacter } from './archiveData'
import styles from './ArchiveCharacter.module.scss'

export default function ArchiveCharacter({ character, message = '', decorative = false }) {
  const item = getGuestbookCharacter(character, message)
  if (!item) return null

  return <img className={styles.image} src={item.src} alt={decorative ? '' : `${item.label} 캐릭터`} />
}
