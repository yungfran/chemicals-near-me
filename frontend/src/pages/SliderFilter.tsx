import { useHistory } from "react-router-dom";
import { useState } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import React from "react";

interface SliderFilterProps {
  base_url: string;
  query_params: URLSearchParams;
  max_val: number;
  min_val: number;
  greater_than: boolean;
  filter_type: string;
}

const SliderFilter = (props: SliderFilterProps) => {
  const history = useHistory();

  var filter_val = props.query_params.get(props.filter_type);
  let value;
  if (filter_val === null) {
    value = 0;
  } else {
    value = parseInt(filter_val);
  }
  const [sliderValue, setSliderValue] = useState(value);

  function onAfterValueChange(changeEvent: React.ChangeEvent, value: number) {
    var new_query_params = new URLSearchParams(props.query_params.toString());
    new_query_params.delete("greaterThan_" + props.filter_type);
    new_query_params.delete(props.filter_type);
    //Add back molecular value
    new_query_params.append(props.filter_type, value.toString());

    //updateButtonQuery(new_query_params);
    var filterGreater: any = props.query_params.get(
      "greaterThan_" + props.filter_type
    );
    let greaterBool;
    if (filterGreater === null || filterGreater === "true") {
      greaterBool = true;
    } else {
      greaterBool = false;
    }

    if (greaterBool === true) {
      new_query_params.append("greaterThan_" + props.filter_type, "true");
    } else {
      new_query_params.append("greaterThan_" + props.filter_type, "false");
    }

    history.push(`${props.base_url}${new_query_params.toString()}`);
    history.go(0);
  }

  function onButtonChange() {
    // filterGreater is what the button was before we clicked it
    var filterGreater: string = props.query_params.get(
      "greaterThan_" + props.filter_type
    );
    if (filterGreater === null || filterGreater === "true") {
      //First time clicking button -> change to false
      filterGreater = "false";
    } else if (filterGreater === "false") {
      filterGreater = "true";
    }

    var new_query_params = new URLSearchParams(props.query_params.toString());
    new_query_params.delete("greaterThan_" + props.filter_type);
    new_query_params.delete(props.filter_type);

    if (filterGreater === "true") {
      new_query_params.append("greaterThan_" + props.filter_type, "true");
    } else {
      new_query_params.append("greaterThan_" + props.filter_type, "false");
    }

    var molecularValue = props.query_params.get(props.filter_type);
    if (molecularValue === null) molecularValue = "0";

    new_query_params.append(props.filter_type, molecularValue.toString());

    history.push(`${props.base_url}${new_query_params.toString()}`);
    history.go(0);
  }

  function getOptionButtons(greater_than: boolean) {
    var filterGreater: any = props.query_params.get(
      "greaterThan_" + props.filter_type
    );
    if (filterGreater === null) {
      filterGreater = "true";
    }

    var greater_thanButtonVariant =
      filterGreater === "true" ? "success" : "secondary";
    var lessThanButtonVariant =
      greater_thanButtonVariant === "success" ? "secondary" : "success";

    return (
      <ButtonGroup className="mb-2" onChange={onButtonChange}>
        <ToggleButton
          id={"toggle-check-" + props.filter_type}
          type="checkbox"
          variant={greater_thanButtonVariant}
          checked={filterGreater}
          value="1"
        >
          Greater Than
        </ToggleButton>

        <ToggleButton
          id={"toggle-check-" + props.filter_type}
          type="checkbox"
          variant={lessThanButtonVariant}
          checked={!filterGreater}
          value="2"
        >
          Less Than
        </ToggleButton>
      </ButtonGroup>
    );
  }

  let filterGreater: any = props.query_params.get(
    "greaterThan_" + props.filter_type
  );

  if (filterGreater === null) {
    filterGreater = true;
  }

  if (filterGreater) {
    //Return buttons of different color depending on our state
    return (
      <div>
        <RangeSlider
          value={sliderValue}
          onChange={(e) => setSliderValue(parseInt(e.target.value))}
          onAfterChange={onAfterValueChange} //after change is done -> update query params
          max={props.max_val}
          min={props.min_val}
        />
        {getOptionButtons(true)}
      </div>
    );
  } else {
    return (
      <div>
        <RangeSlider
          value={sliderValue}
          onChange={(e) => setSliderValue(parseInt(e.target.value))}
          onAfterChange={onAfterValueChange} //after change is done -> update query params
          max={props.max_val}
        />
        {getOptionButtons(false)}
      </div>
    );
  }
};

export default SliderFilter;
