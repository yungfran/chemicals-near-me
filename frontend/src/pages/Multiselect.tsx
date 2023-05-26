import Select, { ActionMeta, MultiValue } from "react-select";
import { useHistory } from "react-router-dom";

export interface MultiselectOption {
  value: string;
  label: string;
}

interface MultiselectProps {
  base_url: string;
  query_params: URLSearchParams;
  options: Array<string>;
  filter_type: string;
}

const Multiselect = (props: MultiselectProps) => {
  const history = useHistory();

  function generateMultiselectOptions(
    options: Array<string>,
    func?: (val: string) => string
  ) {
    return options.map((option): MultiselectOption => {
      if (func == null) {
        return {
          value: option,
          label: option,
        };
      }
      return {
        value: func(option),
        label: func(option),
      };
    });
  }

  function onChange(
    vals: MultiValue<MultiselectOption>,
    action: ActionMeta<MultiselectOption>
  ) {
    var new_query_params = new URLSearchParams(props.query_params.toString());
    new_query_params.delete("page");
    new_query_params.delete("per_page");
    switch (action.action) {
      case "select-option":
        new_query_params.append(props.filter_type, action.option.value);
        history.push(`${props.base_url}${new_query_params.toString()}`);
        history.go(0);
        break;
      case "remove-value":
        const val_str = action.removedValue.value.replaceAll(" ", "+");
        const new_url = `${props.base_url}${new_query_params
          .toString()
          .replaceAll(props.filter_type + "=" + val_str, "")}`;
        history.push(new_url);
        history.go(0);
        break;
      case "clear":
        new_query_params.delete(props.filter_type);
        history.push(`${props.base_url}${new_query_params.toString()}`);
        history.go(0);
        break;
    }
  }

  return (
    <Select
      options={generateMultiselectOptions(props.options)}
      isMulti={true}
      defaultValue={generateMultiselectOptions(
        props.query_params.getAll(props.filter_type)
      )}
      onChange={onChange}
      styles={{
        control: (styles) => ({
          ...styles,
          cursor: "pointer",
        }),
        option: (styles) => ({
          ...styles,
          cursor: "pointer",
        }),
        menu: (styles) => ({
          ...styles,
          zIndex: 999,
        }),
      }}
    />
  );
};

export default Multiselect;
