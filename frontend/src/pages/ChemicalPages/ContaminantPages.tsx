import React from "react";
import { Container, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContaminantsJSON } from "../contaminants/ContaminantJSON";
import axios from "axios";
import PageBar from "../../PageBar";
import { Link } from "react-router-dom";
import ContaminantQueryBar from "./ContaminantQueryBar";
import Highlighter from "react-highlight-words";

interface IProps {
  location: {
    search: string;
  };
}

interface IState {
  page: string;
  per_page: string;
  api_result: ContaminantsJSON | null;
  query_params: URLSearchParams | null;
  search_terms: Array<string> | null;
}

class Contaminants extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const params = new URLSearchParams(props.location.search);
    this.state = {
      page: params.get("page") || "1",
      per_page: params.get("per_page") || "12",
      api_result: null,
      query_params: params,
      search_terms: params.get("q") == null ? [] : params.get("q").split(" "),
    };
  }

  removeWeirdA(str: string) {
    return str.replace(/[Â]/g, "");
  }

  componentDidMount() {
    this.getContaminants();
  }

  render() {
    if (this.state.api_result) {
      return (
        <div>
          <Container>
            <h1 className="pageTitle">Contaminants</h1>

            <Container className="queryBar">
              <ContaminantQueryBar
                query_params={this.state.query_params}
                num_results={this.state.api_result.num_results}
              />
            </Container>

            <Table>
              <thead>
                <th>Name</th>
                <th>CAS Number</th>
                <th>Chemical Formula</th>
                <th>Molecular Weight</th>
                <th>Melting Point</th>
                <th>Boiling Point</th>
              </thead>
              <tbody>
                {this.state.api_result ? (
                  this.state.api_result.contaminants.map((contaminant) => {
                    return (
                      <tr>
                        <Link to={"/contaminants/" + contaminant.id}>
                          {" "}
                          <td>
                            <Highlighter
                              searchWords={
                                this.state.search_terms == null
                                  ? []
                                  : this.state.search_terms
                              }
                              textToHighlight={contaminant.name}
                            />
                          </td>{" "}
                        </Link>
                        <td>
                          <Highlighter
                            searchWords={
                              this.state.search_terms == null
                                ? []
                                : this.state.search_terms
                            }
                            textToHighlight={contaminant.cas_num}
                          />
                        </td>
                        <td>
                          <Highlighter
                            searchWords={
                              this.state.search_terms == null
                                ? []
                                : this.state.search_terms
                            }
                            textToHighlight={contaminant.chemical_formula}
                          />
                        </td>
                        <td>
                          <Highlighter
                            searchWords={
                              this.state.search_terms == null
                                ? []
                                : this.state.search_terms
                            }
                            textToHighlight={`${contaminant.molecular_weight} g/mol`}
                          />
                        </td>
                        <td>
                          <Highlighter
                            searchWords={
                              this.state.search_terms == null
                                ? []
                                : this.state.search_terms
                            }
                            textToHighlight={`${contaminant.melting_point} °C`}
                          />
                        </td>
                        <td>
                          <Highlighter
                            searchWords={
                              this.state.search_terms == null
                                ? []
                                : this.state.search_terms
                            }
                            textToHighlight={this.removeWeirdA(contaminant.boiling_point)}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>Loading...</td>
                    <td>Please Wait...</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <PageBar
              model="contaminants"
              page={parseInt(this.state.page)}
              per_page={parseInt(this.state.per_page)}
              num_pages={this.state.api_result.num_pages}
              query_params={this.state.query_params}
            />
          </Container>
        </div>
      );
    }
    return <div />;
  }

  getContaminants() {
    axios
      .get<ContaminantsJSON>(
        `https://api.chemicalsnear.me/contaminants/?${this.state.query_params.toString()}`
      )
      .then((res) => {
        this.setState({ api_result: res.data });
      });
  }
}

export default Contaminants;
//https://enviro.epa.gov/triexplorer/release_chem?p_view=USCH&trilib=TRIQ1&sort=_VIEW_&sort_fmt=1&state=All+states&county=All+counties&chemical=All+chemicals&industry=ALL&year=2019&tab_rpt=1&fld=RELLBY&fld=TSFDSP
