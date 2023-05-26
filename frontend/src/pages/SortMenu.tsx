import Select, { ActionMeta } from "react-select";
import { useHistory } from "react-router-dom";

export interface SortMenuOption {
  value: string;
  label: string;
  order: string;
  sort_type: string;
}

interface SortMenuProps {
  base_url: string;
  query_params: URLSearchParams;
  options: Array<string>;
  sort_type: string;
}

const SortMenu = (props: SortMenuProps) => {
  const history = useHistory();

  function generateSortMenuOptions(options: Array<string>) {
    return options.map((option): SortMenuOption => {
      const option_split = option
        .split(" ")
        .map((val) => (val === "#" ? "num" : val));
      var sort_type = option_split.slice(0, option_split.length - 1).join(" ");

      var sort_order: string = option_split[option_split.length - 1];
      sort_order =
        sort_order.substring(1, sort_order.length - 1) === "dsc" ? "-" : "";

      return {
        value: sort_order + sort_type,
        label: option,
        order: sort_order,
        sort_type: sort_type,
      };
    });
  }

  function generateDefaultSortMenuOptions(query_params: URLSearchParams) {
    var option = null;
    var sort_vals_str: string = query_params.get("sort");

    if (sort_vals_str != null) {
      const sort_order = sort_vals_str.substring(0, 1);
      var sort_order_str = "asc";
      if (sort_order === "-") {
        sort_order_str = "dsc";
        sort_vals_str = sort_vals_str.substring(1, sort_vals_str.length);
      }
      const sort_type = sort_vals_str.replaceAll("num", "#");

      return {
        value: sort_order + sort_type,
        label: sort_type.replaceAll("+", " ") + " (" + sort_order_str + ")",
        order: sort_order,
        sort_type: sort_type,
      };
    }
    return option;
  }

  function onChange(
    option: SortMenuOption,
    action: ActionMeta<SortMenuOption>
  ) {
    var new_query_params = new URLSearchParams(props.query_params.toString());
    new_query_params.delete("page");
    new_query_params.delete("per_page");
    if (action.action === "select-option") {
      new_query_params.set("sort", option.order + option.sort_type);
      history.push(props.base_url + new_query_params.toString());
      history.go(0);
    }
  }

  return (
    <Select
      options={generateSortMenuOptions(props.options)}
      defaultValue={generateDefaultSortMenuOptions(props.query_params)}
      onChange={onChange}
      styles={{
        control: (stlyes) => ({
          ...stlyes,
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

export default SortMenu;
