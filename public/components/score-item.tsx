import type { FunctionalComponent } from 'preact'
import type { Score } from '../models'
import styles from './score-item.module.css'

type Props = {
  score: Score
}

export const ScoreItem: FunctionalComponent<Props> = ({ score }) => (
  <div class={styles.item}>
    <div class={styles.head}>
      <div>#{score.id}</div>
      <div>{score.date}</div>
    </div>

    <div className={styles.word}>
      {score.word.split('').map((letter, idx) => (
        <div className={styles.letterGreen} key={letter + idx}>{letter}</div>
      ))}
    </div>

    <div>
      {score.tries.map((word, idx) => (
        <div className={styles.try} key={word + idx}>
          {word.split('').map((letter, idx) => (
            <div className={styles.letterGray} key={letter + idx}>
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)
