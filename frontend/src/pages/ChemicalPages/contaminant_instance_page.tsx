import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CardGroup, Container, Table } from "react-bootstrap";

function Contaminant_instance() {
  const path = window.location.pathname;

  //TODO: Change to .me/ after changes
  const ContaminantEndpoint = "https://api.chemicalsnear.me/" + path;

  const [Contaminant, SetContaminant] = useState(null);
  const [IsLoading, SetLoading] = useState(true);

  const axiosAbsolute = axios.create({ baseURL: ContaminantEndpoint });

  useEffect(() => {
    axiosAbsolute(ContaminantEndpoint).then(
      (response) => {
        SetContaminant(response.data);
        SetLoading(false);
      },
      (error) => {
        console.error("Error has occurred: " + error);
      }
    );
  });

  function removeWeirdA(str: string) {
    return str.replace(/[Â]/g, "");
  }

  if (IsLoading) return <div> Loading</div>;

  return (
    <div>
      <h2> {Contaminant.name} </h2>

      <Container>
        <CardGroup>
          {/* <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src="/images/Dichloroethane.png" />
              <Card.Body>
                <Card.Text></Card.Text>
              </Card.Body>
            </Card>  */}

          <Container style={{ marginBottom: 0, paddingBottom: 0 }}>
            <iframe
              title="3D Model"
              style={{
                border: 0,
                height: "650px",
                width: "90%",
                marginBottom: 0,
                paddingBottom: 0,
              }}
              className="pubchem-widget"
              src={
                "https://pubchem.ncbi.nlm.nih.gov/compound/" +
                Contaminant.pubchem_id +
                "#section=3D-Conformer&embed=true"
              }
            ></iframe>{" "}
          </Container>

          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Chemical Description</td>

                <td>{removeWeirdA(Contaminant.description)}</td>
              </tr>

              <tr>
                <td> Uses </td>
                <td>
                  {Contaminant.uses.map((used: any) => (
                    <div>{used.use} </div>
                  ))}
                </td>
              </tr>

              <tr>
                <td> GHS Hazard Classification</td>
                <td>
                  {Contaminant.hazards.map((haz: any) => (
                    <div>
                      {" "}
                      <img
                        alt="Hazard"
                        src={"/hazardSVGS/" + haz.hazard_type + ".svg"}
                      />
                      {haz.hazard_type}{" "}
                    </div>
                  ))}
                </td>
              </tr>

              <tr>
                <td>PubChem CID</td>
                <td>
                  {" "}
                  <a
                    href={
                      "https://pubchem.ncbi.nlm.nih.gov/compound/" +
                      Contaminant.pubchem_id
                    }
                  >
                    {" "}
                    {Contaminant.pubchem_id}
                  </a>
                </td>
              </tr>

              <tr>
                <td>CAS</td>
                <td> {Contaminant.cas_num} </td>
              </tr>

              <tr>
                <td> Chemical Formula</td>
                <td> {Contaminant.chemical_formula} </td>
              </tr>

              <tr>
                <td> Molecular Weight </td>
                <td> {Contaminant.molecular_weight} g/mol</td>
              </tr>

              <tr>
                <td> Boiling point</td>
                <td> {removeWeirdA(Contaminant.boiling_point)}</td>
              </tr>

              <tr>
                <td> Melting point</td>
                <td> {`${Contaminant.melting_point} °C`}</td>
              </tr>

              <tr>
                <td> Cities that release of of {Contaminant.name}</td>
                <td>
                  {Contaminant.cities.map((city: any) => (
                    <div>
                      {" "}
                      <Link to={"/cities/" + city.id}> {city.name} </Link>{" "}
                    </div>
                  ))}
                </td>
              </tr>

              <tr>
                <td> Superfunds that releases {Contaminant.name}</td>
                <td>
                  {Contaminant.superfund_sites.map((superfund: any) => (
                    <div>
                      {" "}
                      <Link to={"/superfunds/" + superfund.id}>
                        {" "}
                        {superfund.name}{" "}
                      </Link>{" "}
                    </div>
                  ))}
                </td>
              </tr>
            </tbody>
          </Table>
        </CardGroup>
      </Container>
    </div>
  );
}

export default Contaminant_instance;
