from flask_sqlalchemy import *
from models import City
from sqlalchemy import or_, func

"""
	Filters cities by the given user searches.
	Code inspired by TexasVotes project.
"""


def search_cities(q, city_query):
    if q == None:
        return city_query
    else:
        q = q.strip()

    terms = map(lambda term: term.lower().strip(), q.split())

    searches = []
    for term in terms:
        searches.append(func.lower(City.name).contains(term))
        searches.append(func.lower(City.state).contains(term))

        try:
            searches.append(City.population.in_([int(term)]))
        except ValueError:
            pass

        try:
            searches.append(City.median_household_income.in_([int(term)]))
        except ValueError:
            pass

        try:
            searches.append(City.disability.in_([float(term)]))
        except ValueError:
            pass

    city_query = city_query.filter(or_(*searches))
    return city_query


"""
	Filters cities for all four supported attributes.
	Supports filtering for multiple values of the attribute.
"""


def filter_cities(filters, city_query):
    if filters["population"] != None:
        pop = filters["population"]
        if pop[1][0] == "true":
            city_query = city_query.filter(City.population >= pop[0][0])
        else:
            city_query = city_query.filter(City.population <= pop[0][0])

    if filters["state"] and len(filters["state"]) > 0:
        print(filters["state"])
        city_query = city_query.filter(City.state.in_(filters["state"]))

    if filters["income"] != None:
        inc = filters["income"]
        if inc[1][0] == "true":
            city_query = city_query.filter(City.median_household_income >= inc[0][0])
        else:
            city_query = city_query.filter(City.median_household_income <= inc[0][0])

    if filters["disability"] != None:
        dis = filters["disability"]
        if dis[1][0] == "true":
            city_query = city_query.filter(City.disability >= dis[0][0])
        else:
            city_query = city_query.filter(City.disability <= dis[0][0])

    return city_query


"""
	Sorts cities by the given attribute in ascending 
	or descending order.
	Only supports sorting on one attribute at a time.
"""


def sort_cities(sort, city_query):
    sort_attr = None
    sort_order = None

    if sort == None:
        return city_query

    sort = sort.split("-")

    # detetmines order to sort attribute by
    if len(sort) > 1:
        sort_order = "-"
        sort = sort[1]
    else:
        sort = sort[0]

    # determines attribute to sort by
    if sort == "Alphabetical":
        sort_attr = City.name
    elif sort == "Population":
        sort_attr = City.population
    else:
        return city_query

    # sorts attribute
    if sort_order == "-":
        return city_query.order_by(sort_attr.desc())
    else:
        return city_query.order_by(sort_attr.asc())
