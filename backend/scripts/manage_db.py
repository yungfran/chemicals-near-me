from operator import or_
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, Column, String, Integer, ForeignKey, or_
from sqlalchemy.sql.expression import func
from dotenv import load_dotenv
import urllib
import json
import os
from sqlalchemy.sql.elements import Null
from sqlalchemy.sql.expression import true
from sqlalchemy.sql.sqltypes import Boolean
from tqdm import tqdm
import argparse

from sqlalchemy.orm import backref, column_property

# Delete tables with following query:
# DROP TABLE city, city_contaminant_link, contaminant, contaminant_use, hazard, hazard_statement, superfund_site, superfund_site_contaminant_link CASCADE

# Get args
parser = argparse.ArgumentParser("db_script")
parser.add_argument("-c", "--create_db", action="store_true")
parser.add_argument("-d", "--delete_tables", action="store_true")
parser.add_argument("-n", "--db_name", type=String, default="TEST")
# Get distinct column vals args
parser.add_argument("-ga", "--get_attributes", action="store_true")
args = parser.parse_args()

load_dotenv()

# Get environmental vars
USERNAME = os.getenv("DB_USERNAME")
PASSWORD = os.getenv("DB_PASSWORD")
IP_ADDRESS = os.getenv("DB_IP_ADDRESS")
PORT = os.getenv("DB_PORT")
NAME_PROD = os.getenv("DB_NAME_PROD")
NAME_DEV = os.getenv("DB_NAME_DEV")
NAME_TEST = os.getenv("DB_NAME_TEST")

db_name_map = {"PROD": NAME_PROD, "DEV": NAME_DEV, "TEST": NAME_TEST}

# Init Flask app
app = Flask(__name__)
app.debug = True
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Schema
schema = "postgresql+psycopg2://{}:{}@{}:{}/{}"

app.config["SQLALCHEMY_DATABASE_URI"] = schema.format(
    USERNAME, PASSWORD, IP_ADDRESS, PORT, db_name_map[args.db_name.length]
)

db = SQLAlchemy(app)

# Define Superfund Site to Contaminant link table
superfund_site_contaminant_link = db.Table(
    "superfund_site_contaminant_link",
    db.Column(
        "superfund_site_id",
        db.Integer(),
        db.ForeignKey("superfund_site.id"),
        primary_key=True,
    ),
    db.Column(
        "contaminant_id",
        db.Integer(),
        db.ForeignKey("contaminant.id"),
        primary_key=True,
    ),
)

# Define City to Contaminant link table
city_contaminant_link = db.Table(
    "city_contaminant_link",
    db.Column("city_id", db.Integer(), db.ForeignKey("city.id"), primary_key=True),
    db.Column(
        "contaminant_id",
        db.Integer(),
        db.ForeignKey("contaminant.id"),
        primary_key=True,
    ),
)

# Define SuperfundSite table
class SuperfundSite(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    epa_id = db.Column(db.String())
    name = db.Column(db.String())
    site_id = db.Column(db.String())
    npl_status = db.Column(db.String())
    num_chem = db.Column(db.Integer())
    city_name = db.Column(db.String())
    state = db.Column(db.String())
    county = db.Column(db.String())
    zipcode = db.Column(db.String())
    federal_facility = db.Column(db.String())
    longitude = db.Column(db.Float())
    latitude = db.Column(db.Float())
    image_url = db.Column(db.String())
    city_id = db.Column(db.Integer(), db.ForeignKey("city.id", ondelete="CASCADE"))

    contaminants = db.relationship(
        "Contaminant",
        secondary=superfund_site_contaminant_link,
        backref=db.backref("superfund_sites"),
    )

    def __init__(
        self,
        id=-1,
        epa_id="",
        name="",
        site_id="",
        npl_status="",
        num_chem=-1,
        city_name="",
        state="",
        county="",
        zipcode="",
        federal_facility="",
        longitude=0.0,
        latitude=0.0,
        image_url="",
    ):
        self.id = id
        self.epa_id = epa_id
        self.name = name
        self.site_id = site_id
        self.npl_status = npl_status
        self.num_chem = num_chem
        self.city_name = city_name
        self.state = state
        self.county = county
        self.zipcode = zipcode
        self.federal_facility = federal_facility
        self.longitude = longitude
        self.latitude = latitude
        self.image_url = image_url


# Define City table
class City(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String())
    county = db.Column(db.String())
    state = db.Column(db.String())
    population = db.Column(db.Integer())
    disability = db.Column(db.Float())
    no_health_insurance = db.Column(db.Float())
    median_household_income = db.Column(db.Integer())
    longitude = db.Column(db.Float())
    latitude = db.Column(db.Float())
    image_url = db.Column(db.String())
    map_url = db.Column(db.String())

    superfund_sites = db.relationship(
        "SuperfundSite",
        backref=db.backref("city"),
        cascade="all, delete, delete-orphan",
        passive_deletes=True,
    )
    contaminants = db.relationship(
        "Contaminant", secondary=city_contaminant_link, backref=db.backref("cities")
    )

    def __init__(
        self,
        id=-1,
        name="",
        county="",
        state="",
        population=-1,
        disability=0.0,
        no_health_insurance=0.0,
        median_household_income=0,
        longitude=0.0,
        latitude=0.0,
        image_url="",
        map_url="",
    ):
        self.id = id
        self.name = name
        self.county = county
        self.state = state
        self.population = population
        self.disability = disability
        self.no_health_insurance = no_health_insurance
        self.median_household_income = median_household_income
        self.longitude = longitude
        self.latitude = latitude
        self.image_url = image_url
        self.map_url = map_url


# Define Contaminant table
class Contaminant(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    pubchem_id = db.Column(db.Integer())
    name = db.Column(db.String())
    description = db.Column(db.String())
    cas_num = db.Column(db.String())
    molecular_weight = db.Column(db.Float())
    chemical_formula = db.Column(db.String())
    density = db.Column(db.String())
    boiling_point = db.Column(db.String())
    melting_point = db.Column(db.String())
    pubchem_url = db.Column(db.String())
    diagram_url = db.Column(db.String())

    hazards = db.relationship(
        "Hazard",
        backref="contaminant",
        cascade="all, delete, delete-orphan",
        passive_deletes=True,
    )
    hazard_statements = db.relationship(
        "HazardStatement",
        backref="contaminant",
        cascade="all, delete, delete-orphan",
        passive_deletes=True,
    )
    uses = db.relationship(
        "ContaminantUse",
        backref="contaminant",
        cascade="all, delete, delete-orphan",
        passive_deletes=True,
    )

    def __init__(
        self,
        id=-1,
        pubchem_id="",
        name="",
        description="",
        cas_num="",
        molecular_weight=0.0,
        chemical_formula="",
        density="",
        boiling_point="",
        melting_point="",
        pubchem_url="",
        diagram_url="",
    ):
        self.id = id
        self.pubchem_id = pubchem_id
        self.name = name
        self.description = description
        self.cas_num = cas_num
        self.molecular_weight = molecular_weight
        self.chemical_formula = chemical_formula
        self.density = density
        self.boiling_point = boiling_point
        self.melting_point = melting_point
        self.pubchem_url = pubchem_url
        self.diagram_url = diagram_url


# Create Hazard table
class Hazard(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    hazard_type = db.Column(db.String())
    contaminant_id = db.Column(
        db.Integer(), db.ForeignKey("contaminant.id", ondelete="CASCADE")
    )

    def __init__(self, id=-1, hazard_type=""):
        self.id = id
        self.hazard_type = hazard_type


# Create Hazard Statement table
class HazardStatement(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    statement = db.Column(db.String())
    contaminant_id = db.Column(
        db.Integer(), db.ForeignKey("contaminant.id", ondelete="CASCADE")
    )

    def __init__(self, id=-1, statement=""):
        self.id = id
        self.statement = statement


# Create Contaminant Uses table
class ContaminantUse(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    use = db.Column(db.String())
    contaminant_id = db.Column(
        db.Integer(), db.ForeignKey("contaminant.id", ondelete="CASCADE")
    )

    def __init__(self, id=-1, use=""):
        self.id = id
        self.use = use


# Create tables
if args.create_db:
    db.create_all()

# State conversion dictionaries
state_to_abbreviation = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
    "District of Columbia": "DC",
    "American Samoa": "AS",
    "Guam": "GU",
    "Northern Mariana Islands": "MP",
    "Puerto Rico": "PR",
    "United States Minor Outlying Islands": "UM",
    "U.S. Virgin Islands": "VI",
}

abbreviation_to_state = dict(map(reversed, state_to_abbreviation.items()))

# Add city data
city_data_file = open("../data/censusgov_data.json")
city_data = json.load(city_data_file)
city_list = []
for i, city in tqdm(enumerate(city_data)):
    if city["name"] != None and city["name"] != "":

        none_found = False
        for key in city:
            if city[key] is None or city[key] == "null":
                none_found = True
                break
        if none_found:
            continue

        name = (
            " ".join(city["name"].split()[:-1]).strip().upper()
            if city["name"] != "United States"
            else "UNITED STATES"
        )
        median_household_income = (
            int(city["median_household_income"])
            if int(city["median_household_income"]) > 0
            else -1
        )
        county = city["county"].strip().upper()
        if len(county.split()) > 1:
            county = county.split()
            if county[-1] == "COUNTY":
                county = county[:-1]
            county = " ".join(county)
        new_city = City(
            id=i,
            name=name,
            county=county,
            state=city["state"].strip().upper(),
            population=int(city["population"]),
            disability=float(city["disability"]),
            no_health_insurance=float(city["no_health_insurance"]),
            median_household_income=median_household_income,
            longitude=city["longitude"],
            latitude=city["latitude"],
            image_url=city["image_url"],
            map_url=city["map_url"],
        )
        city_list.append(new_city)
city_data_file.close()

# Add contaminant data
contaminant_data_file = open("../data/contaminant_data.json")
contaminant_data = json.load(contaminant_data_file)
contaminant_list = []
hazard_list = []
hazard_idx = 0
hazard_statement_list = []
hazard_statement_idx = 0
contaminant_use_list = []
contaminant_use_idx = 0
for i, contaminant in tqdm(enumerate(contaminant_data)):
    if contaminant["name"] != None and contaminant["name"] != "":
        if contaminant["pubchem_id"] != None and contaminant["pubchem_id"] > 0:

            none_found = False
            for key in contaminant:
                if contaminant[key] is None or contaminant[key] == "null":
                    none_found = True
                    break
            if none_found:
                continue

            if len(contaminant["chemical_formula"].strip()) <= 2:
                continue

            new_contaminant = Contaminant(
                id=i,
                pubchem_id=contaminant["pubchem_id"],
                name=contaminant["name"].strip().upper(),
                description=contaminant["description"],
                cas_num=contaminant["cas_num"],
                molecular_weight=float(contaminant["molecular_weight"]),
                chemical_formula=contaminant["chemical_formula"],
                density=contaminant["density"],
                boiling_point=contaminant["boiling_point"],
                melting_point=contaminant["melting_point"],
                pubchem_url=contaminant["pubchem_url"],
                diagram_url=contaminant["diagram_url"],
            )

            for contaminant_use in contaminant["uses"]:
                new_contaminant_use = ContaminantUse(
                    id=contaminant_use_idx, use=contaminant_use
                )
                new_contaminant_use.contaminant = new_contaminant
                new_contaminant_use.contaminant_id = new_contaminant.id
                contaminant_use_list.append(new_contaminant_use)
                contaminant_use_idx += 1

            for hazard in contaminant["hazards"]:
                new_hazard = Hazard(id=hazard_idx, hazard_type=hazard)
                new_hazard.contaminant = new_contaminant
                new_hazard.contaminant_id = new_contaminant.id
                hazard_list.append(new_hazard)
                hazard_idx += 1

            for hazard_statement in contaminant["hazard_statements"]:
                new_hazard_statement = HazardStatement(
                    id=hazard_statement_idx, statement=hazard_statement
                )
                new_hazard_statement.contaminant = new_contaminant
                new_hazard_statement.contaminant_id = new_contaminant.id
                hazard_statement_list.append(new_hazard_statement)
                hazard_statement_idx += 1

            contaminant_list.append(new_contaminant)
contaminant_data_file.close()

# Add superfund site data
superfund_site_data_file = open("../data/epa_data.json")
superfund_site_data = json.load(superfund_site_data_file)
superfund_site_list = []
not_found = 0
for i, superfund_site in tqdm(enumerate(superfund_site_data)):
    if superfund_site["SITE_EPA_ID"] != None and superfund_site["SITE_EPA_ID"] != "":
        if superfund_site["SITE_NAME"] != None and superfund_site["SITE_NAME"] != "":
            if superfund_site["NUM_CHEM"] != None and superfund_site["NUM_CHEM"] > 0:

                none_found = False
                for key in superfund_site:
                    if superfund_site[key] is None or superfund_site[key] == "null":
                        none_found = True
                        break
                if none_found:
                    continue

                state = abbreviation_to_state[
                    superfund_site["SITE_STATE"].strip()
                ].upper()
                longitude = (
                    superfund_site["LONGITUDE"]
                    if superfund_site["LONGITUDE"] != None
                    else 0.0
                )
                latitude = (
                    superfund_site["LATITUDE"]
                    if superfund_site["LATITUDE"] != None
                    else 0.0
                )
                new_superfundsite = SuperfundSite(
                    id=i,
                    epa_id=superfund_site["SITE_EPA_ID"],
                    name=superfund_site["SITE_NAME"],
                    site_id=superfund_site["SITE_ID"],
                    npl_status=superfund_site["NPL"],
                    num_chem=superfund_site["NUM_CHEM"],
                    city_name=superfund_site["SITE_CITY_NAME"].strip().upper(),
                    state=state,
                    county=superfund_site["SITE_CNTY_NAME"].strip().upper(),
                    zipcode=str(superfund_site["SITE_ZIP_CODE"]),
                    federal_facility=superfund_site["FF"],
                    longitude=longitude,
                    latitude=latitude,
                    image_url=superfund_site["IMAGE_URL"],
                )

                city_found = None
                for city in city_list:
                    if (
                        city.name == new_superfundsite.city_name
                        and city.county == new_superfundsite.county
                        and city.state == new_superfundsite.state
                    ):
                        city_found = city
                        new_superfundsite.city_id = city.id
                        break
                if not city_found:
                    continue

                contaminant_found = None
                for contaminant_name in superfund_site["CHEMICALS"]:
                    contaminant_name = contaminant_name.strip().upper()
                    for contaminant in contaminant_list:
                        if contaminant.name == contaminant_name:
                            new_superfundsite.contaminants.append(contaminant)
                            contaminant_found = contaminant
                if not contaminant_found:
                    continue

                city_found.superfund_sites.append(new_superfundsite)

                superfund_site_list.append(new_superfundsite)
superfund_site_data_file.close()

# Link contaminants and cities
for contaminant in contaminant_list:
    for superfund_site in contaminant.superfund_sites:
        if (
            not superfund_site.city is None
            and not superfund_site.city in contaminant.cities
        ):
            contaminant.cities.append(superfund_site.city)

# Push initial database
if args.create_db:
    db.session.add_all(superfund_site_list)
    db.session.add_all(city_list)
    db.session.add_all(contaminant_list)
    db.session.add_all(hazard_list)
    db.session.add_all(hazard_statement_list)
    db.session.add_all(contaminant_use_list)
    db.session.commit()

connected = False

total_city_removed = 0
total_site_removed = 0
total_contaminant_removed = 0

# Clean data
while not connected:
    remove_cities = db.session.query(City).filter(
        or_(~City.contaminants.any(), ~City.superfund_sites.any())
    )
    removed_city_count = remove_cities.count()
    remove_cities.delete(synchronize_session=False)
    db.session.commit()

    remove_superfund_sites = db.session.query(SuperfundSite).filter(
        or_(~SuperfundSite.contaminants.any(), ~SuperfundSite.city.has())
    )
    removed_site_count = remove_superfund_sites.count()
    remove_superfund_sites.delete(synchronize_session=False)
    db.session.commit()

    remove_contaminants = db.session.query(Contaminant).filter(
        or_(
            ~Contaminant.cities.any(),
            ~Contaminant.superfund_sites.any(),
            func.length(Contaminant.chemical_formula) <= 2,
        )
    )
    removed_contaminant_count = remove_contaminants.count()
    remove_contaminants.delete(synchronize_session=False)
    db.session.commit()

    total_city_removed += removed_city_count
    total_site_removed += removed_site_count
    total_contaminant_removed += removed_contaminant_count

    print("\nRemoved", removed_city_count, "cities.")
    print("Removed", removed_site_count, "Superfund sites.")
    print("Removed", removed_contaminant_count, "contaminants.")
    connected = (
        removed_city_count == 0
        and removed_site_count == 0
        and removed_contaminant_count == 0
    )

print("\n>>> Removed", total_city_removed, "cities.")
print(">>> Removed", total_site_removed, "Superfund sites.")
print(">>> Removed", total_contaminant_removed, "contaminants.")

manual_attributes = {
    "STATE_ABBREVIATIONS": [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
        "DC",
        "AS",
        "GU",
        "MP",
        "PR",
        "UM",
        "VI",
    ],
    "ELEMENTS": ["C", "H", "O", "Cl"],
    "SUPERFUND_SITE_SORT_VALS": [
        "A - Z (asc)",
        "Z - A (dsc)",
        "# of Contaminants (asc)",
        "# of Contaminants (dsc)",
    ],
    "CONTAMINANT_SORT_VALS": [
        "A - Z (asc)",
        "Z - A (dsc)",
        "Molecular Weight (asc)",
        "Molecular Weight (dsc)",
    ],
    "CITY_SORT_VALS": [
        "A - Z (asc)",
        "Z - A (dsc)",
        "Population (asc)",
        "Population (dsc)",
    ],
}

attribute_file_path = "../../frontend/src/pages/QueryAttributes.ts"

attribute_info = {
    "get_npl_statuses": (
        "NPL_STATUSES",
        lambda: db.session.query(SuperfundSite.npl_status).distinct().all(),
    ),
    "get_states": ("STATES", lambda: db.session.query(City.state).distinct().all()),
    "get_cities": ("CITIES", lambda: db.session.query(City.name).distinct().all()),
    "get_counties": (
        "COUNTIES",
        lambda: db.session.query(City.county).distinct().all(),
    ),
    "get_hazards": (
        "HAZARDS",
        lambda: db.session.query(Hazard.hazard_type).distinct().all(),
    ),
}


def get_attribute_string(attribute, attribute_vals):
    attribute_str = ["export const {} = [".format(attribute)]
    for val in attribute_vals:
        attribute_str.append('\t"{}",'.format(val))
    attribute_str.append("];")

    return "\n".join(attribute_str)


if args.get_attributes:
    all_attributes = []
    with open(attribute_file_path, "w+") as f:
        f.truncate()
        for attribute, vals in attribute_info.items():
            attribute_vals = vals[1]()
            f.write(
                get_attribute_string(
                    vals[0],
                    map(lambda attribute_tuple: attribute_tuple[0], attribute_vals),
                )
            )
            f.write("\n\n")
        for attribute, vals in manual_attributes.items():
            f.write(get_attribute_string(attribute, vals))
            f.write("\n\n")
