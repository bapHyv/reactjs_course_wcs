import blank_profile from '../assets/blank_profile.png'
import Skill from './Skill'

const Wilder = ({ wilderName, wilderId, description, skills, handleDeleteWilder }) => {
  return (
    <div className="card-container">
      <article className="card">
        <img src={blank_profile} alt="Jane Doe Profile" />
        <h3>{wilderName}</h3>
        <p>{description}</p>
        <h4>Wild Skills</h4>
        <ul className="skills">
          {skills &&
            skills.map((e, i) => (
              <Skill
                key={i.toString() + e.name + Math.random().toString()}
                skillName={e.name}
                rate={e.rate}
              />
            ))}
        </ul>
        <div onClick={() => handleDeleteWilder(wilderName, wilderId)} className="btn-delete">x</div>
      </article>
    </div>
  )
}

export default Wilder
