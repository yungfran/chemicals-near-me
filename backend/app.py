from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, SuperfundSite, Contaminant, City
from schemas import (
    mm,
    SuperfundSiteSchema,
    SuperfundSiteInstanceSchema,
    ContaminantSchema,
    ContaminantInstanceSchema,
    CitySchema,
    CityInstanceSchema,
)
import os
from Superfunds import *
from ContaminantOperations import *
from Cities import *

import sys

# Get environmental vars
USERNAME = os.getenv("DB_USERNAME")
PASSWORD = os.getenv("DB_PASSWORD")
IP_ADDRESS = os.getenv("DB_IP_ADDRESS")
PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

database_uri_format = "postgresql+psycopg2://{}:{}@{}:{}/{}"

app = Flask(__name__)
CORS(app)
app.config["JSON_SORT_KEYS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = database_uri_format.format(
    USERNAME, PASSWORD, IP_ADDRESS, PORT, DB_NAME
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
mm.init_app(app)


@app.route("/search")
def search():
    superfunds = []
    contaminants = []
    cities = []

    q = request.args.get("q", default=None)
    search_terms = q.split(" ")
    if q is not None:
        superfund_searches = []
        # searching inspired by CollegiateConnection's searching/filtering
        for term in search_terms:
            like_term = f"%{term}%"
            try:
                superfund_searches.append(SuperfundSite.epa_id.ilike(like_term))
                superfund_searches.append(SuperfundSite.name.ilike(like_term))
                superfund_searches.append(SuperfundSite.site_id.ilike(like_term))
                superfund_searches.append(SuperfundSite.npl_status.ilike(like_term))
                superfund_searches.append(SuperfundSite.city_name.ilike(like_term))
                superfund_searches.append(SuperfundSite.state.ilike(like_term))
                superfund_searches.append(SuperfundSite.county.ilike(like_term))
                superfund_searches.append(SuperfundSite.zipcode.ilike(like_term))
                superfund_searches.append(
                    SuperfundSite.federal_facility.ilike(like_term)
                )
                superfund_searches.append(SuperfundSite.num_chem.in_([int(term)]))
                superfund_searches.append(SuperfundSite.longitude.in_([float(term)]))
                superfund_searches.append(SuperfundSite.latitude.in_([float(term)]))
            except ValueError:
                pass
        superfunds_query = SuperfundSite.query.filter(or_(*tuple(superfund_searches)))
        superfunds_schema = SuperfundSiteInstanceSchema(many=True)
        superfunds = superfunds_schema.dump(superfunds_query.all())

        contaminant_searches = []
        for term in search_terms:
            like_term = f"%{term}%"
            try:
                contaminant_searches.append(Contaminant.name.ilike(like_term))
                contaminant_searches.append(Contaminant.description.ilike(like_term))
                contaminant_searches.append(Contaminant.cas_num.ilike(like_term))
                contaminant_searches.append(
                    Contaminant.chemical_formula.ilike(like_term)
                )
                contaminant_searches.append(Contaminant.density.ilike(like_term))
                contaminant_searches.append(Contaminant.boiling_point.ilike(like_term))
                contaminant_searches.append(Contaminant.pubchem_id.in_([int(term)]))
                contaminant_searches.append(
                    Contaminant.molecular_weight.in_([float(term)])
                )
                contaminant_searches.append(
                    Contaminant.melting_point.in_([float(term)])
                )
            except ValueError:
                pass
        contaminants_query = Contaminant.query.filter(or_(*tuple(contaminant_searches)))
        contaminants_schema = ContaminantInstanceSchema(many=True)
        contaminants = contaminants_schema.dump(contaminants_query.all())

        city_searches = []
        for term in search_terms:
            like_term = f"%{term}%"
            try:
                city_searches.append(City.name.ilike(like_term))
                city_searches.append(City.county.ilike(like_term))
                city_searches.append(City.state.ilike(like_term))
                city_searches.append(City.population.in_([int(like_term)]))
                city_searches.append(City.median_household_income.in_([int(like_term)]))
                city_searches.append(City.disability.in_([float(like_term)]))
                city_searches.append(City.no_health_insurance.in_([float(like_term)]))
                city_searches.append(City.longitude.in_([float(like_term)]))
                city_searches.append(City.latitude.in_([float(like_term)]))
            except ValueError:
                pass
        cities_query = City.query.filter(or_(*tuple(city_searches)))
        cities_schema = CityInstanceSchema(many=True)
        cities = cities_schema.dump(cities_query.all())

    return jsonify(
        {"superfunds": superfunds, "contaminants": contaminants, "cities": cities}
    )


def get_query(attribute, queries):
    if attribute == "state":
        try:
            result = queries[attribute]
        except KeyError:
            result = None

    else:
        result = [queries.get(a) for a in [attribute, "greaterThan_" + attribute]]
        if result[0] == None:
            result = None

    return result


@app.route("/superfunds")
def get_superfunds():
    super_query = db.session.query(SuperfundSite)

    # Searching
    q = request.args.get("q", default=None)
    if q:
        super_query = search_superfunds(q, super_query)

    # Filtering
    city = request.args.getlist("city", type=str)
    state = request.args.getlist("state", type=str)
    county = request.args.getlist("county", type=str)
    npl_status = request.args.getlist("npl_status", type=str)
    filters = {"city": city, "state": state, "county": county, "npl_status": npl_status}
    super_query = filter_superfunds(filters, super_query)

    # Sorting
    sort = request.args.get("sort", default=None)
    super_query = sort_superfunds(sort, super_query)

    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=12, type=int)

    schema = SuperfundSiteInstanceSchema(many=True)

    if not page == -1:
        superfunds = super_query.paginate(page=page, per_page=per_page)
        num_results = superfunds.query.count()
        num_pages = superfunds.pages
        superfunds_data = schema.dump(superfunds.items)
    else:
        superfunds = super_query
        num_results = superfunds.count()
        num_pages = 1
        superfunds_data = schema.dump(superfunds)

    return jsonify(
        {
            "num_results": num_results,
            "num_pages": num_pages,
            "superfunds": superfunds_data,
        }
    )


@app.route("/superfunds/<int:id>")
def get_superfund(id):
    superfund = db.session.query(SuperfundSite).get(id)
    schema = SuperfundSiteSchema()
    return jsonify(schema.dump(superfund))


@app.route("/contaminants/")
def get_contaminants():
    # Dictionary of all query params

    queries = request.args.to_dict(flat=False)
    contaminant_query = db.session.query(Contaminant)

    # Searching
    q = get_query("q", queries)
    if q:
        contaminant_query = search_contaminants(q, contaminant_query)

    # filtering
    elements = request.args.getlist("elements", type=str)
    hazards = request.args.getlist("hazards", type=str)
    molecularValue = request.args.get("molecularWeight", default=None)
    greaterThanMV = request.args.get("greaterThan_molecularWeight", default=None)
    meltingPoint = request.args.get("meltingPoint", default=None)
    greaterThanMP = request.args.get("greaterThan_meltingPoint", default=None)
    filters = {
        "elements": elements,
        "molecularWeight": molecularValue,
        "greaterThanMV": greaterThanMV,
        "meltingPoint": meltingPoint,
        "greaterThanMP": greaterThanMP,
        "hazards": hazards,
    }
    contaminant_query = filter_contaminants(filters, contaminant_query)

    # sorting
    sort = request.args.get("sort", default=None)
    contaminant_query = sort_contaminants(sort, contaminant_query)

    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=12, type=int)

    schema = ContaminantInstanceSchema(many=True)

    if not page == -1:
        contaminants = contaminant_query.paginate(page=page, per_page=per_page)
        num_results = contaminants.query.count()
        num_pages = contaminants.pages
        contaminants_data = schema.dump(contaminants.items)
    else:
        contaminants = contaminant_query
        num_results = contaminants.count()
        num_pages = 1
        contaminants_data = schema.dump(contaminants)

    return jsonify(
        {
            "num_results": num_results,
            "num_pages": num_pages,
            "contaminants": contaminants_data,
        }
    )


@app.route("/contaminants/<int:id>")
def get_contaminant(id):
    contaminant = db.session.query(Contaminant).get(id)
    schema = ContaminantSchema()
    return jsonify(schema.dump(contaminant))


@app.route("/cities")
def get_cities():
    queries = request.args.to_dict(flat=False)
    city_query = db.session.query(City)

    # searching
    q = request.args.get("q", default=None)
    if q:
        city_query = search_cities(q, city_query)

    # filtering
    population = get_query("population", queries)
    state = request.args.getlist("state", type=str)
    income = get_query("income", queries)
    disability = get_query("disability", queries)
    filters = {
        "population": population,
        "state": state,
        "income": income,
        "disability": disability,
    }
    city_query = filter_cities(filters, city_query)

    # sorting
    sort = request.args.get("sort")
    city_query = sort_cities(sort, city_query)

    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=12, type=int)

    schema = CityInstanceSchema(many=True)

    if not page == -1:
        cities = city_query.paginate(page=page, per_page=per_page)
        num_results = cities.query.count()
        num_pages = cities.pages
        contaminants_data = schema.dump(cities.items)
    else:
        cities = city_query
        num_results = city_query.count()
        num_pages = 1
        contaminants_data = schema.dump(city_query)

    return jsonify(
        {
            "num_results": num_results,
            "num_pages": num_pages,
            "cities": contaminants_data,
        }
    )


@app.route("/cities/<int:id>")
def get_city(id):
    city = db.session.query(City).get(id)
    schema = CitySchema()
    return jsonify(schema.dump(city))


if __name__ == "__main__":
    app.run(debug=True)
