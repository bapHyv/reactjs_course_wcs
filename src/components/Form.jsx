import { useState, useEffect } from 'react'

import axios from 'axios'

import styles from '../css/Form.module.css'

const baseUrl = 'http://localhost:5000'

const Form = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState([])
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedGrade, setSelectedGrade] = useState(0)
  const [skillAndGrade, setSkillAndGrade] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get('http://localhost:5000/api/skill')
      setSkills(data.data)
    }
    fetchData()
  }, [])

  const onNameChange = (e) => {
    setName(e.target.value)
  }

  const onDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const handleSelect = (e) => {
    setSelectedSkill(e.target.value)
  }

  const handleGrade = (e) => {
    setSelectedGrade(e.target.value)
  }

  const handleAddSkill = (selectedSkill, selectedGrade) => {
    setSkillAndGrade([
      ...skillAndGrade,
      {
        skill: selectedSkill,
        grade: selectedGrade,
      },
    ])
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (name !== '' && description !== '') {
      const res = await axios.post('http://localhost:5000/api/wilder', {
        name,
        description,
        skills: selectedSkill,
      })

      let copySkillAndGrade = skillAndGrade

      await Promise.all(
        skillAndGrade.map((e) => {
          axios.put(`${baseUrl}/api/wilder/addSkill`, {
            wilderName: name,
            skillName: e.skill,
          })
        }),
      )

      await Promise.all(
        copySkillAndGrade.map((e) => {
          axios.put(`${baseUrl}/api/wilder/addRateToSkill`, {
            name,
            skillName: e.skill,
            rate: e.grade,
          })
        }),
      )

      // Empty the from
      setName('')
      setDescription('')
      setSelectedSkill('')
      setSelectedGrade(0)
      setSkillAndGrade([])
    } else {
      alert('You are supposed to fill up the fields')
    }
  }

  return (
    <form className={styles.formStyle} onSubmit={handleFormSubmit}>
      <div className={styles.formElement}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input
          value={name}
          onChange={onNameChange}
          type="text"
          name="name"
          id="name"
        />
      </div>
      <div className={styles.formElement}>
        <label className={styles.label} htmlFor="description">
          Description
        </label>
        <textarea
          onChange={onDescriptionChange}
          value={description}
          name="description"
          id="description"
          cols="30"
          rows="10"
        ></textarea>
      </div>
      <div className={styles.formElement}></div>

      <div className={styles.formElement}>
        <div className={styles.skillAndGradeElements}>
          <select value={selectedSkill} onChange={handleSelect}>
            <option value="" disabled>
              Default
            </option>
            {skills.map((e) => (
              <option key={e.name} value={e.name}>
                {e.name}
              </option>
            ))}
          </select>
          <input
            onChange={handleGrade}
            type="number"
            name="grade"
            id="grade"
            min="1"
            max="10"
          />
          <div
            className={styles.addSkillBtn}
            onClick={() => handleAddSkill(selectedSkill, selectedGrade)}
          >
            Add skill
          </div>
        </div>
      </div>
      <div className={styles.formElement}>
        {skillAndGrade.length > 0 &&
          skillAndGrade.map((e) => (
            <div
              className={styles.skillAdded}
              key={e.grade + Math.random().toString()}
            >
              <span className={styles.spanSkill}>{e.skill}</span>
              <span className={styles.spanSkill}>{e.grade}</span>
              <div className={styles.deleteSkillBtn}>Delete Skill</div>
            </div>
          ))}
      </div>
      <input className={styles.submitBtn} type="submit" value="Add" />
    </form>
  )
}

export default Form
