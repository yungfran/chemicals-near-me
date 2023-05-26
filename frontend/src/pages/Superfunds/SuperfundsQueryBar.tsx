import { Col, Container, Row } from "react-bootstrap";
import Multiselect from "../Multiselect";
import * as QueryAttributes from "../QueryAttributes";
import SearchBar from "../SearchBar";
import SortMenu from "../SortMenu";
import "./SuperfundsQueryBar.css";

interface SuperfundsQueryBarProps {
  query_params: URLSearchParams;
  num_results?: number;
}

const SuperfundsQueryBar = (props: SuperfundsQueryBarProps) => {
  return (
    <Container className="queryBarBox">
      <Row>
        <Col>
          <p className="filterTitle">NPL Status</p>
          <Multiselect
            base_url={"/superfunds/?"}
            query_params={props.query_params}
            options={QueryAttributes.NPL_STATUSES}
            filter_type="npl_status"
          />
        </Col>
        <Col>
          <p className="filterTitle">City</p>
          <Multiselect
            base_url={"/superfunds/?"}
            query_params={props.query_params}
            options={QueryAttributes.CITIES}
            filter_type="city"
          />
        </Col>
        <Col>
          <p className="filterTitle">County</p>
          <Multiselect
            base_url={"/superfunds/?"}
            query_params={props.query_params}
            options={QueryAttributes.COUNTIES}
            filter_type="county"
          />
        </Col>
        <Col>
          <p className="filterTitle">State</p>
          <Multiselect
            base_url={"/superfunds/?"}
            query_params={props.query_params}
            options={QueryAttributes.STATES}
            filter_type="state"
          />
        </Col>
        <Col>
          <p className="filterTitle">Sort</p>
          <SortMenu
            base_url={"/superfunds/?"}
            query_params={props.query_params}
            options={QueryAttributes.SUPERFUND_SITE_SORT_VALS}
            sort_type="sort"
          />
        </Col>
      </Row>
      <Row>
        <SearchBar
          base_url={"/superfunds/?"}
          query_params={props.query_params}
          num_results={props.num_results}
        />
      </Row>
    </Container>
  );
};

export default SuperfundsQueryBar;
