import styles from '../css/Skill.module.css'

const Skill = ({skillName, rate}) => {
  return (
    <li>
      {skillName}
      {rate && <span className={styles.votes}>{rate}</span>}
    </li>
  )
}

export default Skill
