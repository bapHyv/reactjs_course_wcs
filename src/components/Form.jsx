import { useState, useEffect } from "react";

import axios from "axios";

import styles from "../css/Form.module.css";

import Skill from "./Skill";
import Modal from "./Modal";

const baseUrl = "http://localhost:5000";

const Form = ({ fetchWilders }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [skillAndGrade, setSkillAndGrade] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [addingSkill, setAddingSkill] = useState("");

  const fetchSkills = async () => {
    const data = await axios.get("http://localhost:5000/api/skill");
    setSkills(data.data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const onNameChange = (e) => {
    setName(e.target.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSelect = (e) => {
    setSelectedSkill(e.target.value);
  };

  const handleGrade = (e) => {
    setSelectedGrade(e.target.value);
  };

  const handleAddSkill = (selectedSkill, selectedGrade) => {
    if (
      selectedSkill !== "" &&
      skillAndGrade.find((e) => e.skill === selectedSkill) === undefined
    ) {
      setSkillAndGrade([
        ...skillAndGrade,
        {
          skill: selectedSkill,
          grade: selectedGrade,
        },
      ]);
    }

    setSelectedSkill("");
    setSelectedGrade(0);
  };

  const handleDeleteSelectedSkill = (event, name) => {
    event.preventDefault();
    const filteredSkillAndGrade = skillAndGrade.filter((e) => e.skill != name);
    setSkillAndGrade(filteredSkillAndGrade);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (name !== "" && description !== "") {
      const res = await axios.post("http://localhost:5000/api/wilder", {
        name,
        description,
        skills: selectedSkill,
      });

      let copySkillAndGrade = skillAndGrade;

      await Promise.all(
        skillAndGrade.map((e) => {
          axios.put(`${baseUrl}/api/wilder/addSkill`, {
            wilderName: name,
            skillName: e.skill,
          });
        })
      );

      await Promise.all(
        copySkillAndGrade.map((e) => {
          axios.put(`${baseUrl}/api/wilder/addRateToSkill`, {
            name,
            skillName: e.skill,
            rate: e.grade,
          });
        })
      );

      // Empty the from
      setName("");
      setDescription("");
      setSelectedSkill("");
      setSelectedGrade(0);
      setSkillAndGrade([]);

      await fetchWilders();
    } else {
      alert("You are supposed to fill up the fields");
    }
  };

  const handleShowModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/skill", { name: addingSkill });
    setAddingSkill("");
    const data = await axios.get("http://localhost:5000/api/skill");
    setSkills(data.data);
  };

  const handleChangeAddingSkill = (e) => {
    setAddingSkill(e.target.value);
  };

  const handleDeleteAlreadyAddedSkill = async (e, id) => {
    e.preventDefault();
    await axios.delete("http://localhost:5000/api/skill", { data: { id } });
    const data = await axios.get("http://localhost:5000/api/skill");
    setSkills(data.data);
  };

  return (
    <form
      className={styles.formStyle + " " + styles.card}
      onSubmit={handleFormSubmit}
    >
      <div className={styles.btnManageSkillContainer}>
        <button
          className={styles.btnManageSkill}
          onClick={(e) => handleShowModal(e)}
        >
          manage skills
        </button>
      </div>

      <Modal
        show={showModal}
        handleCloseModal={handleCloseModal}
        handleSubmitModal={handleSubmitModal}
      >
        <p className={styles.label}>Skill already added:</p>

        <div className="skillAlreadyAddedContainer">
          <ul className="skills">
            {skills.map((e) => (
              <div
                key={e.name + Math.random().toString()}
                className="skillAlreadyAddedAndDeleteBtnContainer"
              >
                <Skill skillName={e.name} />
                <button
                  onClick={(event) =>
                    handleDeleteAlreadyAddedSkill(event, e.id)
                  }
                  className="deleteBtnSkillAlreadyAdded"
                >
                  X
                </button>
              </div>
            ))}
          </ul>
        </div>

        <p className={styles.label}>Skill name:</p>
        <input
          onChange={handleChangeAddingSkill}
          value={addingSkill}
          className="inputAddSkill"
          type="text"
        />
      </Modal>

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
            border-radius: 10px;
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
            min="0"
            max="10"
            value={selectedGrade}
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
              className={styles.skillAddedContainer}
              key={e.grade + Math.random().toString()}
            >
              <ul className={styles.skillsAdded}>
                <Skill skillName={e.skill} rate={e.grade} />
              </ul>
              <button
                onClick={(event) => handleDeleteSelectedSkill(event, e.skill)}
                className={styles.deleteSkillBtn}
              >
                X
              </button>
            </div>
          ))}
      </div>
      <input className={styles.submitBtn} type="submit" value="Add" />
    </form>
  );
};

export default Form;
