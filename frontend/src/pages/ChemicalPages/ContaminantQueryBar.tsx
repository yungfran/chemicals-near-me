import { Col, Container, Row } from "react-bootstrap";
import Multiselect from "../Multiselect";
import * as QueryFields from "../QueryAttributes";
import SortMenu from "../SortMenu";
import SliderFilter from "../SliderFilter";
import SearchBar from "../SearchBar";
//import "./SuperfundsQueryBar.css";

interface ContaminantQueryBarProps {
  query_params: URLSearchParams;
  num_results?: number;
}

const ContaminantQueryBar = (props: ContaminantQueryBarProps) => {
  return (
    <Container className="queryBarBox">
      <Row>
        <Col>
          <p className="filterTitle">Hazards</p>
          <Multiselect
            base_url={"/contaminants/?"}
            query_params={props.query_params}
            options={QueryFields.HAZARDS}
            filter_type="hazards"
          />
        </Col>

        <Col>
          <p className="filterTitle">Elements</p>
          <Multiselect
            base_url={"/contaminants/?"}
            query_params={props.query_params}
            options={QueryFields.Elements}
            filter_type="elements"
          />
        </Col>

        <Col>
          <p className="filterTitle">Melting Point (°C)</p>
          <SliderFilter
            base_url={"/contaminants/?"}
            query_params={props.query_params}
            filter_type={"meltingPoint"}
            min_val = {-500}
            max_val={400}
            greater_than={true}
          />
        </Col>

        <Col>
          <p className="filterTitle">Molecular Weight (g/mol)</p>
          <SliderFilter
            base_url={"/contaminants/?"}
            query_params={props.query_params}
            filter_type={"molecularWeight"}
            max_val={400}
            min_val={0}
            greater_than={true}
          />
        </Col>

        <Col>
          <p className="filterTitle">Sort</p>
          <SortMenu
            base_url={"/contaminants/?"}
            query_params={props.query_params}
            options={QueryFields.CONTAMINANT_SORT_VALS}
            sort_type="sort"
          />
        </Col>
      </Row>

      <SearchBar
        base_url={"/contaminants/?"}
        query_params={props.query_params}
        num_results={props.num_results}
      />
    </Container>
  );
};

export default ContaminantQueryBar;
