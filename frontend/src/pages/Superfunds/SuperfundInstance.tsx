import React from 'react'
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap'
import { SuperfundInstanceJSON } from './SuperfundJSON'
import Highlighter from 'react-highlight-words'

interface IProps {
    key: number
    instance: SuperfundInstanceJSON
    search_terms: Array<string>
}

class SuperfundInstance extends React.Component<IProps, {}> {
    render() {
        return (
            <Card style={{ width: "18rem" }}>
                <Card.Img variant="top" src={this.props.instance.image_url} width="200" height="150" />
                <Card.Body>
                    <Card.Title><Highlighter
                        searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
                        textToHighlight={this.props.instance.name}
                    /></Card.Title>
                    <p>NPL Status: <Highlighter
                        searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
                        textToHighlight={this.props.instance.npl_status}
                    /></p>
                    <p>Number of TSCA Chemicals: <Highlighter
                        searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
                        textToHighlight={this.props.instance.num_chem}
                    /></p>
                    <p>City: <Link to={`/cities/${this.props.instance.city_id}`}><Highlighter
                        searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
                        textToHighlight={this.props.instance.city_name}
                    /></Link></p>
                    <p>State: <Highlighter
                        searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
                        textToHighlight={this.props.instance.state}
                    /></p>
                    <p>County: <Highlighter
                        searchWords={this.props.search_terms == null ? [] : this.props.search_terms}
                        textToHighlight={this.props.instance.county}
                    /></p>
                    <Link to={`/superfunds/${this.props.instance.id}`}>
                        <Button variant="primary">See more</Button>
                    </Link>
                </Card.Body>
            </Card>
        );
    }
}

export default SuperfundInstance;
