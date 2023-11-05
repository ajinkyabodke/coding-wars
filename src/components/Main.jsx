import React from "react";
import Button from "../components/Button";
import { ColorPicker } from "../components/ColorPicker";
import { RadioInput } from "../components/Radio";
import RemoveButton from "../components/RemoveButton";
import TextBox from "../components/TextBox";
import Input from "../components/Input";
import { useData } from "../contexts/appContext";


const Main = () => {
  const { resHTML, setresHTML } = useData();
  const radioOptions = ["professional", "creative", "academic"];
  const colorOptions = ["Primary", "Secondary", "Background"];
  return (
    <>
      <Button />
      <div className="px-4">
        <RadioInput options={radioOptions} />
      </div>

      <Input placeholder="Enter your Name" icon="job" />
      <div className="px-4">
        <RadioInput options={["Top Header", "Side Header "]} />
      </div>
      <Input placeholder="Enter your Image URL" icon="link" />
      <h1 className="text-4xl">Professional Summary</h1>
      <ColorPicker colorOptions={colorOptions} />
      <TextBox />
      <Input />
      <RemoveButton />
    </>
  );
};

export default Main;
