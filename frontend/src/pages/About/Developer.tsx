import React from "react";
import axios from "axios";
import { Commit, Issue, Member, User, headers } from "./Gitlab";
import { Card } from "react-bootstrap";

interface IProps {
  key: number;
  data: Member;
  commits: Array<Commit>;
  issues: Array<Issue>;
}

interface IState {
  user: User | null;
  commits: number;
  issues: number;
  unit_tests: number;
}

class Developer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      user: null,
      commits: -1,
      issues: -1,
      unit_tests: -1,
    };
  }

  componentDidMount() {
    this.getUser();
    this.calculateStats();
  }

  render() {
    if (
      this.state.user === null ||
      this.state.commits === -1 ||
      this.state.issues === -1 ||
      this.state.unit_tests === -1
    )
      return <div />;

    return (
      <div className="dev">
        <Card className="dev-card">
          <Card.Img
            variant="top"
            src={this.props.data.avatar_url}
            alt={this.props.data.name}
            className="dev-image"
          />
          <Card.Header as="h3">{this.props.data.name}</Card.Header>
          <Card.Body>
            <Card.Title>Full-Stack</Card.Title>
            <p>{this.state.user.bio}</p>
            <p>Merged Commits: {this.state.commits}</p>
            <p>Closed Issues: {this.state.issues}</p>
            <p>Unit Tests: {this.state.unit_tests}</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  getUser() {
    axios
      .get<User>(`https://gitlab.com/api/v4/users/${this.props.data.id}`, {
        headers,
      })
      .then((res) => {
        this.setState({ user: res.data });
      });
  }

  calculateStats() {
    const commits: number = this.calculateCommits();
    const issues: number = this.calculateIssues();
    let unit_tests: number = 0;
    const name = this.props.data.name;
    if (name === "Lorenzo Martinez") {
      unit_tests = 70;
    } else if (name === "Vivian Ta") {
      unit_tests = 23;
    } else if (name === "Francis Tran") {
      unit_tests = 14;
    }
    this.setState({
      commits,
      issues,
      unit_tests,
    });
  }

  calculateCommits(): number {
    let commits: number = 0;
    this.props.commits.forEach((commit) => {
      if (commit.author_name === this.props.data.name) ++commits;
    });
    return commits;
  }

  calculateIssues(): number {
    let issues: number = 0;
    this.props.issues.forEach((issue) => {
      if (
        issue.closed_at !== null &&
        issue.assignees.filter((member) => member.id === this.props.data.id)
          .length
      )
        ++issues;
    });
    return issues;
  }
}

export default Developer;
