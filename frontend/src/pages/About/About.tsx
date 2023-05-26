import React from "react";
import axios from "axios";
import Developer from "./Developer";
import { Commit, Issue, Member, headers } from "./Gitlab";
import { Container, CardGroup } from "react-bootstrap";
import "./About.css";

interface IState {
  commits: Array<Commit>;
  issues: Array<Issue>;
  members: Array<Member>;
}

class About extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      commits: [],
      issues: [],
      members: [],
    };
  }

  componentDidMount() {
    this.getCommits();
    this.getIssues();
    this.getMembers();
  }

  render() {
    if (
      this.state.commits.length === 0 ||
      this.state.issues.length === 0 ||
      this.state.members.length === 0
    )
      return <div />;

    console.log(this.state);
    return (
      <div id="about">
        <Container id="inner">
          <h1>About Us</h1>
          <p className="text-content">
            Following the tragedies of environmental disasters such as the
            infamous Love Canal, the United States Congress passed the
            Comprehensive Environmental Response, Compensation, and Liability
            Act (CERCLA or Superfund). This act designated a process for
            tracking and responding to contaminated sites, as well as a fund to
            pay for cleanups. Our website seeks to provide concerned citizens
            with the ability to see which Superfund sites are near them and what
            contaminants these facilities release. Such toxic chemicals can
            cause damage to the public’s health, so residents must be aware of
            potential sources in their city.
          </p>
          <p className="text-content">
            Based on the interaction of the data collected, we were able to
            observe the connection between different chemicals and their
            relation to where they are located. The prevalence of chemicals
            based on what superfund site they are emanating from also intrigued
            our group as a whole.
          </p>
          <h1>Our Team</h1>
          <CardGroup className="center">
            {this.state.members.map((member) => {
              return (
                <Developer
                  key={member.id}
                  data={member}
                  commits={this.state.commits}
                  issues={this.state.issues}
                />
              );
            })}
          </CardGroup>

          <h1>Project Details</h1>
          <p>Total Merged Commits: {this.state.commits.length}</p>
          <p>
            Total Closed Issues:{" "}
            {
              this.state.issues.filter((issue) => issue.closed_at !== null)
                .length
            }
          </p>
          <p>Total Unit Tests: 107</p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://gitlab.com/cs373-11am-group5/chemicals-near-me"
            >
              GitLab Repository
            </a>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://documenter.getpostman.com/view/17744348/UVCBA4ns"
            >
              Postman API Documentation
            </a>
          </p>
          <h1>Tools</h1>
          <p>
            <a target="_blank" rel="noreferrer" href="https://reactjs.org/">
              React
            </a>
            <p>Library used for our frontend</p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://react-bootstrap.github.io/"
            >
              React Bootstrap (CSS)
            </a>
            <p>Library to add style/formatting/structure to our frontend</p>
          </p>
          <p>
            <a target="_blank" rel="noreferrer" href="https://aws.amazon.com/amplify/">
              AWS Amplify
            </a>
            <p>To host our frontend</p>
          </p>
          <p>
            <a target="_blank" rel="noreferrer" href="https://aws.amazon.com/rds/">
              AWS RDS
            </a>
            <p>Used to host database</p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.namecheap.com/"
            >
              NameCheap
            </a>
            <p>To acquire a domain name</p>
          </p>
          <p>
            <a target="_blank" rel="noreferrer" href="https://gitlab.com/">
              GitLab
            </a>
            <p>To host our Git repository</p>
          </p>
          <p>
            <a target="_blank" rel="noreferrer" href="https://www.postman.com/">
              Postman
            </a>
            <p>To create Postman tests and maintain API documentation</p>
          </p>
          <p>
            <a target="_blank" rel="noreferrer" href="https://www.docker.com/">
              Docker
            </a>
            <p>Provided containerized environments for frontend and backend to run on</p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.typescriptlang.org/"
            >
              TypeScript
            </a>
            <p>Enabled type checking</p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.postgresql.org/"
            >
              PostgreSQL
            </a>
            <p>Database used</p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://flask.palletsprojects.com/en/2.0.x/"
            >
              Flask
            </a>
            <p>API server framework</p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.sqlalchemy.org/"
            >
              SQLAlchemy
            </a>
            <p>Used to create and query database</p>
          </p>
          <p>
            <a target="_blank" rel="noreferrer" href="https://jestjs.io/">
              Jest
            </a>
            <p>To create frontend unit tests for React components</p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.selenium.dev/"
            >
              Selenium
            </a>
            <p>To test frontend GUI</p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://marshmallow.readthedocs.io/en/stable/"
            >
              Marshmallow
            </a>
            <p>Develop schemas to dump data with</p>
          </p>
          <h1>APIs and Data Sources</h1>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.epa.gov/enviro/envirofacts-model"
            >
              EPA Envirofacts Model
            </a>
            <p className="smaller-text">
              Scraped data from the SEMS Model to get the majority
              of information pertaining to superfund sites. Gathered 
              the list of contaminants through web scraping a table.
              Retrieved photos from Google Places API.
            </p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://en.wikipedia.org/wiki/List_of_Superfund_sites"
            >
              List of Superfund Sites
            </a>
            <p className="smaller-text">
              Used list of superfund sites to validate our own list that
              was retrieved from the EPA API. Manually looked over the NPL 
              to verify the status of certain sites.
            </p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://pubchem.ncbi.nlm.nih.gov"
            >
              PubChem Website
            </a>
            <p className="smaller-text">
              Used to query for information about a chemical, given its name.
              The pubchem REST api ( https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CHEMICALNAME/aspirin/JSON)
               gives us an identifier which we can hit a 
              hidden pubchem api ( https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/PUBCHEMID/JSON/)
              to give us all the data about a particular chemical.
            </p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.census.gov/data/developers/guidance/api-user-guide.Overview.html"
            >
              Census Website
            </a>
            <p>
              Used to the Census API to gather demographic information including populations and 
              poverty rates
            </p>
          </p>
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://developers.google.com/maps/documentation/places/web-service/overview"
            >
              Google Places
            </a>
            <p className="smaller-text">
              Used the Google Places API to look for superfund sites as well as cities.
              Filtered out results that didn't have a photo attached to them through
              the Google Places Photo API.
            </p>
          </p>
        </Container>
      </div>
    );
  }

  getCommits() {
    axios
      .get<Array<Commit>>(
        "https://gitlab.com/api/v4/projects/29955625/repository/commits?per_page=100",
        { headers }
      )
      .then((res) => {
        this.setState({ commits: res.data });
      });
  }

  getIssues() {
    axios
      .get<Array<Issue>>(
        "https://gitlab.com/api/v4/projects/29955625/issues?per_page=100",
        { headers }
      )
      .then((res) => {
        this.setState({ issues: res.data });
      });
  }

  async getMembers() {
    const developerAccessLevel = 40;
    await axios
      .get<Array<Member>>(
        "https://gitlab.com/api/v4/projects/29955625/members/all",
        { headers }
      )
      .then((res) => {
        const members: Array<Member> = [];
        res.data.forEach(async (member) => {
          if (member.access_level >= developerAccessLevel) {
            members.push(member);
          }
        });
        this.setState({ members });
      });
  }
}

export default About;
