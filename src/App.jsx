// @ts-check
import React, { useState } from "react";
import { API } from "../constants";
import Loader from "./components/Loader";

function generateGPTPrompt(formData) {
  // Create a GPT prompt using the updated user input
  const promptTemplate = `Give me markup for portfolio in the form of website, with the following details:
Template: ${formData.template}
Header Position: ${formData.headerPosition}
Include Photo: ${formData.includePhoto ? "Yes" : "No"}
Professional Summary: ${formData.professionalSummary}
Experience: ${formData.experience.map(
    (entry) => `\n- ${entry.jobTitle} at ${entry.company}`
  )}
Education: ${formData.education.map(
    (entry) => `\n- ${entry.graduationYear} at ${entry.institutionName}`
  )}
Skills: ${formData.skills.join(", ")}
Contact: GitHub - ${formData.contact.githubURL}, LinkedIn - ${
    formData.contact.linkedinURL
  }, Twitter - ${formData.contact.twitterURL}
Colors: Primary - ${formData.colors.primary}, Secondary - ${
    formData.colors.secondary
  }, Background - ${formData.colors.background}
Font: ${formData.font}
Font Size: ${formData.fontSize}
...`;
  return promptTemplate;
}

function App() {
  const [formData, setFormData] = useState({
    template: "Professional",
    headerPosition: "top",
    includePhoto: false,
    imageURL: "",
    professionalSummary: "",
    experience: [],
    education: [],
    skills: [],
    contact: {
      githubURL: "",
      linkedinURL: "",
      twitterURL: "",
    },
    colors: {
      primary: "",
      secondary: "",
      background: "",
    },
    font: "",
    fontSize: "",
  });
  const [portfolioHTML, setportfolioHTML] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);

  const submitRequest = async (formData) => {
    try {
      setisLoading(true);
      setisSuccess(false);
      console.log(generateGPTPrompt(formData));

      const response = await fetch(`${API}/complete-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ prompt: generateGPTPrompt(formData) }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong on server side");
      }
      const jsonResponse = await response.json();
      const HTML = jsonResponse.output;
      setportfolioHTML(HTML);
      setisSuccess(true);
      console.log(HTML);
      return jsonResponse;
    } catch (error) {
      console.error(error);
      return error;
    } finally {
      setisLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "includePhoto") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? e.target.checked : value,
      });
    }
  };

  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { jobTitle: "", companyName: "" }],
    });
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);
    setFormData({ ...formData, experience: updatedExperience });
  };

  const handleExperienceChange = (e, index) => {
    const { name, value } = e.target;
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    setFormData({ ...formData, experience: updatedExperience });
  };

  const handleAddEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { graduationYear: "", institutionName: "", relevantCourses: "" },
      ],
    });
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({ ...formData, education: updatedEducation });
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEducation = [...formData.education];
    updatedEducation[index] = { ...updatedEducation[index], [name]: value };
    setFormData({ ...formData, education: updatedEducation });
  };

  const handleAddSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ""],
    });
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSkillChange = (e, index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = e.target.value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      contact: { ...formData.contact, [name]: value },
    });
  };

  const handleColorsChange = (e, colorType) => {
    const updatedColors = { ...formData.colors, [colorType]: e.target.value };
    setFormData({ ...formData, colors: updatedColors });
  };

  const handleButtonClick = async () => {
    const result = await submitRequest(formData);
    // Handle the result as needed
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log(formData); // Log the form data to the console for debugging
    // You can perform further actions here, such as sending the data to a server or processing it.
  };

  return (
    <div className="App">
      <h1>OpenAI Text Generator</h1>
      <button onClick={handleButtonClick}>Click Me</button>
      <div className="container mx-auto">
        {isLoading ? (
          <Loader />
        ) : isSuccess ? (
          <iframe srcDoc={portfolioHTML} frameBorder={0} />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFormData(formData);

              console.info("💸your submitted values:", formData);
            }}
            className="w-full max-w-screen-sm mx-auto mt-4"
          >
            <h2 className="text-2xl font-bold mb-4">AI Portfolio Builder</h2>
            <div className="mb-4">
              <label
                htmlFor="template"
                className="block text-sm font-medium text-gray-700"
              >
                Template Selection
              </label>
              <select
                name="template"
                id="template"
                className="form-select mt-1 block w-full"
                onChange={handleInputChange}
                value={formData.template}
              >
                <option value="Professional">Professional</option>
                <option value="Creative">Creative</option>
                <option value="Academic">Academic</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Layout Options
              </label>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="headerPosition"
                    value="top"
                    onChange={handleInputChange}
                    checked={formData.headerPosition === "top"}
                  />
                  <span className="ml-2">Top Header</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    className="form-radio"
                    name="headerPosition"
                    value="side"
                    onChange={handleInputChange}
                    checked={formData.headerPosition === "side"}
                  />
                  <span className="ml-2">Side Header</span>
                </label>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Include Photo in Header
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    name="includePhoto"
                    onChange={handleInputChange}
                    checked={formData.includePhoto}
                  />
                  <span className="ml-2">Yes</span>
                </label>
              </div>
              {formData.includePhoto && (
                <div className="mt-2">
                  <label
                    htmlFor="imageURL"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="imageURL"
                    name="imageURL"
                    className="form-input mt-1 block w-full"
                    onChange={handleInputChange}
                    value={formData.imageURL}
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="professionalSummary"
                className="block text-sm font-medium text-gray-700"
              >
                Professional Summary
              </label>
              <textarea
                id="professionalSummary"
                name="professionalSummary"
                className="form-textarea mt-1 block w-full"
                rows="4"
                onChange={handleInputChange}
                value={formData.professionalSummary}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Experience
              </label>
              {formData.experience.map((exp, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={exp.jobTitle}
                    onChange={(e) => handleExperienceChange(e, index)}
                    className="form-input w-1/2 mr-2"
                  />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={exp.companyName}
                    onChange={(e) => handleExperienceChange(e, index)}
                    className="form-input w-1/2 mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddExperience}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Add Experience
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Education
              </label>
              {formData.education.map((edu, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    name="graduationYear"
                    placeholder="Graduation Year"
                    value={edu.graduationYear}
                    onChange={(e) => handleEducationChange(e, index)}
                    className="form-input w-1/3 mr-2"
                  />
                  <input
                    type="text"
                    name="institutionName"
                    placeholder="Institution Name"
                    value={edu.institutionName}
                    onChange={(e) => handleEducationChange(e, index)}
                    className="form-input w-1/3 mr-2"
                  />
                  <input
                    type="text"
                    name="relevantCourses"
                    placeholder="Relevant Courses"
                    value={edu.relevantCourses}
                    onChange={(e) => handleEducationChange(e, index)}
                    className="form-input w-1/3 mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEducation}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Add Education
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Skills
              </label>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    name="skill"
                    placeholder="Skill"
                    value={skill}
                    onChange={(e) => handleSkillChange(e, index)}
                    className="form-input w-2/3 mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSkill}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Add Skill
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Contact Information
              </label>
              <div className="mb-2">
                <input
                  type="text"
                  name="githubURL"
                  placeholder="GitHub URL"
                  value={formData.contact.githubURL}
                  onChange={handleContactChange}
                  className="form-input"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  name="linkedinURL"
                  placeholder="LinkedIn URL"
                  value={formData.contact.linkedinURL}
                  onChange={handleContactChange}
                  className="form-input"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="twitterURL"
                  placeholder="Twitter URL"
                  value={formData.contact.twitterURL}
                  onChange={handleContactChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Template Customization
              </label>
              <div className="mb-2">
                <label
                  htmlFor="primaryColor"
                  className="block text-sm text-gray-700"
                >
                  Primary Color
                </label>
                <input
                  type="color"
                  id="primaryColor"
                  name="primaryColor"
                  value={formData.colors.primary}
                  onChange={(e) => handleColorsChange(e, "primary")}
                  className="form-input"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="secondaryColor"
                  className="block text-sm text-gray-700"
                >
                  Secondary Color
                </label>
                <input
                  type="color"
                  id="secondaryColor"
                  name="secondaryColor"
                  value={formData.colors.secondary}
                  onChange={(e) => handleColorsChange(e, "secondary")}
                  className="form-input"
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="backgroundColor"
                  className="block text-sm text-gray-700"
                >
                  Background Color
                </label>
                <input
                  type="color"
                  id="backgroundColor"
                  name="backgroundColor"
                  value={formData.colors.background}
                  onChange={(e) => handleColorsChange(e, "background")}
                  className="form-input"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="font" className="block text-sm text-gray-700">
                  Font Selection
                </label>
                <input
                  type="text"
                  id="font"
                  name="font"
                  value={formData.font}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="fontSize"
                  className="block text-sm text-gray-700"
                >
                  Font Size Adjustment
                </label>
                <input
                  type="number"
                  id="fontSize"
                  name="fontSize"
                  value={formData.fontSize}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Generate Portfolio
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
