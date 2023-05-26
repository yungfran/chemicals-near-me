import { Col, Container, Row } from "react-bootstrap";
import Multiselect from "../Multiselect";
import * as QueryAttributes from "../QueryAttributes";
import SearchBar from "../SearchBar";
import SortMenu from "../SortMenu";
import "./CitiesQueryBar.css";
import SliderFilter from "../SliderFilter";

interface CitiesQueryBarProps {
  query_params: URLSearchParams;
  num_results?: number;
}

const CitiesQueryBar = (props: CitiesQueryBarProps) => {
  return (
    <Container className="queryBarBox">
      <Row>
        <Col>
          <p className="filterTitle">Population</p>
          <SliderFilter
            base_url={"/cities/?"}
            query_params={props.query_params}
            filter_type={"population"}
            greater_than={true}
            min_val={0}
            max_val={3000000}
          />
        </Col>
        <Col>
          <p className="filterTitle">Median Household Income</p>
          <SliderFilter
            base_url={"/cities/?"}
            query_params={props.query_params}
            filter_type={"income"}
            min_val={0}
            max_val={130000}
            greater_than={true}
          />
        </Col>
        <Col>
          <p className="filterTitle">Percentage of Disability</p>
          <SliderFilter
            base_url={"/cities/?"}
            query_params={props.query_params}
            filter_type={"disability"}
            min_val={0}
            max_val={100}
            greater_than={true}
          />
        </Col>
        <Col>
          <p className="filterTitle">State</p>
          <Multiselect
            base_url={"/cities/?"}
            query_params={props.query_params}
            options={QueryAttributes.STATES}
            filter_type="state"
          />
        </Col>
        <Col>
          <p className="filterTitle">Sort</p>
          <SortMenu
            base_url={"/cities/?"}
            query_params={props.query_params}
            options={QueryAttributes.CITY_SORT_VALS}
            sort_type="sort"
          />
        </Col>
      </Row>
      <Row>
        <SearchBar
          base_url={"/cities/?"}
          query_params={props.query_params}
					num_results={props.num_results}
        />
      </Row>
    </Container>
  );
};

export default CitiesQueryBar;
