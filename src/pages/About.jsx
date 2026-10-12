import { Link } from 'react-router-dom'
import styles from './About.module.scss'

export default function About() {
  return <section className={styles.page}>
    <p className='archive-label'>ABOUT / THE TRACE ARCHIVE</p>
    <div className={styles.intro}><h1>스쳐 지나간 순간에도<br />남겨둘 마음은 있으니까<span>.</span></h1><span className='archive-stamp'>보관중</span></div>
    <div className={styles.story}><span className='archive-label'>OUR LITTLE ARCHIVE</span><div><h2>당신의 방문이 하나의 기록이 되는 곳.</h2><p>흔적 보관소는 이곳을 다녀간 사람들이 남긴 한마디를 모읍니다.<br />잘 쓴 글이나 특별한 이야기가 아니어도 괜찮아요.</p><p>짧은 인사, 오늘의 기분, 전하고 싶은 응원.<br />나를 대신할 캐릭터를 고르고 이름과 한마디를 남겨주세요. 작은 도장과 함께 당신만의 기록으로 보관됩니다.</p></div></div>
    <div className={styles.chapters}>{[['01 / WRITE', '한마디를 쓰고', '흘러가는 생각을 잠시 붙잡아요.'], ['02 / LEAVE', '마음을 남기고', '지나온 자리에 작은 인사를 놓아요.'], ['03 / KEEP', '오래 보관합니다', '다른 이의 마음도 천천히 읽어보세요.']].map(([label, title, copy]) => <div key={label}><span className='archive-label'>{label}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
    <div className={styles.invitation}><p>이제, 당신의 흔적을 만나고 싶어요.</p><Link to='/guestbook#write' className='archive-button'>내 흔적 남기기 <span aria-hidden='true'>↗</span></Link></div>
  </section>
}
