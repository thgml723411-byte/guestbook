import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Home.module.scss'

const scenes = [
  { src: '/mp4/archive-writing.mp4', poster: '/img/archive-writing.jpg', label: 'WRITE', title: '한마디를 쓰고.', description: '거창한 이야기가 아니어도 괜찮아요. 오늘의 마음을 한 줄 적어주세요.' },
  { src: '/mp4/archive-envelope.mp4', poster: '/img/archive-envelope.jpg', label: 'LEAVE', title: '마음을 남기고.', description: '이곳을 지나간 당신의 이름과 마음이 작은 흔적이 됩니다.' },
  { src: '/mp4/archive-album.mp4', poster: '/img/archive-album.jpg', label: 'KEEP', title: '오래 보관합니다.', description: '흘러가는 순간 사이에서, 다녀간 마음만큼은 여기 남도록.' },
]

export default function Home() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const videoRefs = useRef([])
  const scene = scenes[active]
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setActive((index) => (index + 1) % scenes.length), 3000)
    return () => clearInterval(timer)
  }, [playing, active])
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === active && playing) {
        video.currentTime = 0
        video.play().catch(() => {})
      } else video.pause()
    })
  }, [active, playing])

  return <>
    <section className={styles.hero} aria-label='흔적 보관소 영상 소개'>
      <div className={styles.film}>
        {scenes.map((item, index) => <video key={item.src} ref={(el) => { videoRefs.current[index] = el }} className={index === active ? styles.visible : ''} src={item.src} poster={item.poster} muted loop playsInline preload={index === 0 ? 'auto' : 'metadata'} aria-hidden='true' />)}
      </div>
      <div className={styles.heroTop}><span>THE TRACE ARCHIVE</span><span>COLLECTING LITTLE MOMENTS</span></div>
      <div className={styles.copy}>
        <span className={styles.eyebrow}>다녀간 마음을 보관하는 곳</span>
        <h1>당신이 다녀간<br />자리를 보관합니다<span>.</span></h1>
        <div className={styles.sceneCopy} key={active}><span>0{active + 1} / {scene.label}</span><h2>{scene.title}</h2><p>{scene.description}</p></div>
        <Link className='archive-button' to='/guestbook#write'>내 흔적 남기기 <span aria-hidden='true'>↗</span></Link>
      </div>
      <div className={styles.heroBottom}>
        <div className={styles.controls}>
          {scenes.map((item, index) => <button key={item.label} className={active === index ? styles.selected : ''} onClick={() => setActive(index)} aria-label={`${index + 1}번 영상: ${item.title}`} aria-pressed={active === index}>0{index + 1}<span className={playing && active === index ? styles.progress : ''} /></button>)}
          <button className={styles.pause} onClick={() => setPlaying((value) => !value)} aria-label={playing ? '영상 일시정지' : '영상 재생'}>{playing ? 'Ⅱ' : '▶'}</button>
        </div>
        <a href='#archive-intro'>보관소 둘러보기 ↓</a>
      </div>
    </section>
    <section className={styles.intro} id='archive-intro'>
      <div><p className='archive-label'>A PLACE FOR YOUR WORDS / 01</p><h2>짧은 인사도,<br />하나의 기록이 되니까.</h2><p className={styles.body}>문득 떠오른 생각, 누군가에게 전하고 싶은 안부.<br />사라지기 아쉬운 작은 말들을 이곳에 모읍니다.</p><Link to='/guestbook' className='archive-link'>보관된 흔적 보기 <span aria-hidden='true'>↗</span></Link></div>
      <div className={styles.sample}><div className={styles.cardTop}><span>ARCHIVE NOTE</span><span>예시 기록</span></div><p>잠깐 들렀다가<br />마음 한 조각 놓고 갑니다.<br />당신의 오늘도 평온하기를.</p><div className={styles.cardBottom}><span>어느 방문자의 한마디</span><span className='archive-stamp'>다녀감</span></div></div>
    </section>
    <section className={styles.steps} aria-label='흔적 남기는 방법'>
      {[['01', '캐릭터를 골라요', '내 마음을 대신할 캐릭터를 만나보세요.'], ['02', '한마디를 남겨요', '이름과 함께 인사, 기억, 응원을 적어요.'], ['03', '도장을 찍어요', '캐릭터와 한마디가 한 장의 기록으로 보관돼요.']].map(([number, title, description]) => <div key={number}><span className='archive-label'>{number} / ARCHIVE GUIDE</span><h3>{title}</h3><p>{description}</p></div>)}
    </section>
  </>
}
