import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import { BrowserRouter, Route } from "react-router-dom";

// import components
import App from "../App";
import NavBar from "../NavBar";

import About from "../pages/About/About";
import Home from "../pages/Home/Home";

import Superfunds from "../pages/Superfunds/Superfunds";
import City from "../pages/Cities/Cities";
import Contaminants from "../pages/ChemicalPages/ContaminantPages";

import SuperfundInstanceJSON from "../pages/Superfunds/SuperfundJSON";
import CityInstanceJSON from "../pages/Cities/CityJSON";
import ContaminantInstanceJSON from "../pages/contaminants/ContaminantJSON";

import SuperfundInstance from "../pages/Superfunds/SuperfundInstance";
import CityInstance from "../pages/Cities/CityInstance";
import Contaminant_instance from "../pages/ChemicalPages/contaminant_instance_page";


describe("General", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("Navbar", () => {
    it("renders correctly", () => {
        const tree = renderer.create(
            <BrowserRouter>
                <NavBar />
            </BrowserRouter>
        );
    });
});

describe("About", () => {
    it("renders correctly", () => {
        const tree = renderer.create(<About />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("Home", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("Superfunds", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <Superfunds 
                        location={""} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("filter renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <Superfunds
                        location={"state=TEXAS"} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("sort renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <Superfunds
                        location={"sort=-Alphabetical"} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("search renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <Superfunds
                        location={"q=oil"} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("instance renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <SuperfundInstance
                        key={9}
                        instance={SuperfundInstanceJSON}
                        search_terms={null} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe("Cities", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <City
                        location={""} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("filter renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <City
                        location={"state=TEXAS"} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("sort renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <City
                        location={"sort=-Alphabetical"} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("search renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <City
                        location={"q=oh"} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("instance renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <CityInstance 
                        key={6}
                        instance={CityInstanceJSON}
                        search_terms={null} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


describe("Contaminants", () => {
    it("renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <Contaminants 
                        location={""}/>
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("filter renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <Contaminants 
                        location={"hazard=Corrosive"}/>
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("sort renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <Contaminants 
                        location={"sort=Alphabetical"}/>
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("search renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <City
                        location={"q=nice"} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("instance renders correctly", () => {
        const tree = renderer
            .create(
                <BrowserRouter>
                    <Contaminant_instance 
                        key={50}
                        instance={ContaminantInstanceJSON}
                        search_terms={null} />
                </BrowserRouter>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
