const Skill = ({skillName, rate}) => {
  return (
    <li>
      {skillName}
      <span className="votes">{rate}</span>
    </li>
  )
}

export default Skill
