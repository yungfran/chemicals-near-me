import axios from 'axios';
import React from 'react';
import { Row, Col, CardGroup, Container } from "react-bootstrap";
import { CityInstanceJSON } from '../Cities/CityJSON';
import { ContaminantInstanceJSON } from '../contaminants/ContaminantJSON';
import { SuperfundInstanceJSON } from '../Superfunds/SuperfundJSON';
import SuperfundInstance from '../Superfunds/SuperfundInstance';
import SearchBar from '../SearchBar';
import ContaminantCard from '../ChemicalPages/ContaminantCard';
import CityInstance from '../Cities/CityInstance';

interface AllJSON {
    superfunds: Array<SuperfundInstanceJSON>
    contaminants : Array<ContaminantInstanceJSON>
    cities: Array<CityInstanceJSON>
}

interface IProps {
    location: {
        search: string
    }
}

interface IState {
    api_result: AllJSON | null
    query_params: URLSearchParams | null
}

class Search extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const query_params = new URLSearchParams(props.location.search);

        this.state = {
            api_result: null,
            query_params,
        };
    }

    componentDidMount() {
        this.getSearchResults();
    }

    render() {
        if (this.state.api_result) {
            return (
                <div>
                    <SearchBar query_params={new URLSearchParams()} base_url="/search?" />
                    <br></br>
                    <h2>Superfund Sites</h2>
                    <Container>
                        <Row>
                            <CardGroup>
                                {this.state.api_result.superfunds.map((superfund) => {
                                return (
                                    <Col>
                                        <SuperfundInstance
                                            key={superfund.id}
                                            instance={superfund}
                                            search_terms={
                                                this.state.query_params.get("q") == null
                                                    ? []
                                                    : this.state.query_params.get("q").split(" ")
                                            }
                                        />
                                    </Col>
                                );
                                })}
                            </CardGroup>
                        </Row>
                    </Container>
                    <h2>Contaminants</h2>
                    <Container>
                        <Row>
                            <CardGroup>
                                {this.state.api_result.contaminants.map((contaminant) => {
                                    return (
                                        <Col>
                                            <ContaminantCard
                                                key={contaminant.id}
                                                instance={contaminant}
                                                search_terms={
                                                    this.state.query_params.get("q") == null
                                                        ? []
                                                        : this.state.query_params.get("q").split(" ")
                                                }
                                            />
                                        </Col>
                                    );
                                })}
                            </CardGroup>
                        </Row>
                    </Container>
                    <h2>Cities</h2>
                    <Container>
                        <Row>
                            <CardGroup>
                                {this.state.api_result.cities.map((city) => {
                                    return (
                                        <Col>
                                            <CityInstance
                                                key={city.id}
                                                instance={city}
                                                search_terms={
                                                    this.state.query_params.get("q") == null
                                                        ? []
                                                        : this.state.query_params.get("q").split(" ")
                                                }
                                            />
                                        </Col>
                                    );
                                })}
                            </CardGroup>
                        </Row>
                    </Container>
                </div>
            );
        }
        return <div />
    }

    getSearchResults() {
        axios
            .get<AllJSON>(
                `https://api.chemicalsnear.me/search?${this.state.query_params.toString()}`
            )
            .then((res) => {
                this.setState({ api_result: res.data });
            });
    }
}

export default Search;
