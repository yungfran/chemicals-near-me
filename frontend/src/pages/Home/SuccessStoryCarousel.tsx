import { Carousel, CarouselItem, Row, Col, Container } from "react-bootstrap";
import "./Home.css";

const successStoryList = [
  [
    {
      name: "Pantex Plant",
      text: "The Pantex Plant Superfund Site is located 17 miles northeast of Amarillo, Texas...",
      profileUrl:
        "https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.Cleanup&id=0604060",
    },
    {
      name: "RSR Corporation",
      text: "The RSR Corporation Superfund site is a former lead smelter located in West Dallas...",
      profileUrl:
        "https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.Cleanup&id=0602297",
    },
    {
      name: "Eastland Woolen Mill",
      text: "The 25-acre Eastland Woolen Mill Superfund Site is located in the Town of Coriima...",
      profileUrl:
        "https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.Cleanup&id=0101043",
    },
  ],
  [
    {
      name: "California Gulch",
      text: "The California Gulch site consists of about 18 square miles in Lake County, Colorado...",
      profileUrl:
        "https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.Cleanup&id=0801478",
    },
    {
      name: "Black Butte Mine",
      text: "Black Butte Mine is located near Cottage Grove, Oregon. Mercury mining in the late 1880s...",
      profileUrl:
        "https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.Cleanup&id=1001865",
    },
    {
      name: "Celotex Corporation",
      text: "The Celotex site is located at 2800 S. Sacramento in a portion of Chicago's South Lawndale...",
      profileUrl:
        "https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.Cleanup&id=0506225",
    },
  ],
  [
    {
      name: "Roebling Steel Co.",
      text: "The Roebling Steel Company site is located next to the Delaware River in Florence Township...",
      profileUrl:
        "https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.Cleanup&id=0200439",
    },
    {
      name: "Palmerton Zinc Pile",
      text: "The Palmerton Zinc Pile Site is the area of a former primary zinc smelting operation...",
      profileUrl:
        "https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.Cleanup&id=0300624",
    },
    {
      name: "Jasksonville Ash Site",
      text: "The Jacksonville Ash Site includes three separate areas in Jacksonville, Duval County, Florida...",
      profileUrl:
        "https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.Cleanup&id=0407002",
    },
  ],
];

const SuccessStoryCarousel = () => {
  return (
    <Carousel variant="dark" indicators={false}>
      {successStoryList.map((successStoryRow) => {
        return (
          <CarouselItem
            className="cardCarouselRow"
            style={{ paddingLeft: "9.3vw" }}
          >
            <Row>
              {successStoryRow.map((successStory) => {
                return (
                  <Col>
                    <Container className="successStoryBox">
                      <h5>
                        <b>{successStory.name}</b>
                      </h5>
                      <p className="successStoryText">{successStory.text}</p>
                      <a
                        href={successStory.profileUrl}
                        style={{ textDecoration: "None" }}
                      >
                        Read more
                      </a>
                    </Container>
                  </Col>
                );
              })}
            </Row>
          </CarouselItem>
        );
      })}
    </Carousel>
  );
};

export default SuccessStoryCarousel;
