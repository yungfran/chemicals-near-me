from flask_sqlalchemy import *
from sqlalchemy.orm import query
from sqlalchemy.orm.query import Query
from models import SuperfundSite, Contaminant
from sqlalchemy.sql.expression import func, or_


def filter_superfunds(filters, query: Query):
    """
    Filter superfund sites by all filters, ignoring
    individual filters if they are not set. Modifies original
    query and returns it according to necessary changes.
    """

    # Filter through city, state, county, and npl status
    if filters["city"]:
        query = query.filter(SuperfundSite.city_name.in_(filters["city"]))
    if filters["state"]:
        query = query.filter(SuperfundSite.state.in_(filters["state"]))
    if filters["county"]:
        query = query.filter(SuperfundSite.county.in_(filters["county"]))
    if filters["npl_status"]:
        query = query.filter(SuperfundSite.npl_status.in_(filters["npl_status"]))

    return query


def sort_superfunds(sort: str, query: Query):
    """
    Sort superfund sites by sorting parameter,
    returning a query with sorted results. Returns the
    given query if sorting parameter is invalid.
    """

    # Default case
    if sort == None:
        return query

    field = None
    dsc = False

    # Descending flag
    if "-" in sort:
        dsc = True

    # Setting sort field
    if sort == "Alphabetical" or sort == "-Alphabetical":
        field = SuperfundSite.name
    elif sort == "num of Contaminants" or sort == "-num of Contaminants":
        field = SuperfundSite.num_chem
    else:
        return query

    # Ascending vs. Descending case
    return query.order_by(field.desc()) if dsc else query.order_by(field)


def search_superfunds(q: str, query: Query):
    """
    Search superfund sites by query string.
    Code inspired by TexasVotes project.
    """

    # Default case
    if q == None:
        return query
    else:
        q = q.strip()

    terms = map(lambda term: term.lower().strip(), q.split())

    searches = []
    for term in terms:
        searches.append(func.lower(SuperfundSite.name).contains(term))
        searches.append(func.lower(SuperfundSite.npl_status).contains(term))
        searches.append(func.lower(SuperfundSite.city_name).contains(term))
        searches.append(func.lower(SuperfundSite.state).contains(term))
        searches.append(func.lower(SuperfundSite.county).contains(term))
        try:
            searches.append(SuperfundSite.num_chem.in_([int(term)]))
        except ValueError:
            pass

    query = query.filter(or_(*tuple(searches)))

    return query
