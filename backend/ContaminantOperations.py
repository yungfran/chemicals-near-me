from flask_sqlalchemy import *
from sqlalchemy.orm.query import Query
from sqlalchemy.sql.sqltypes import String
from models import Contaminant, Hazard
from sqlalchemy.sql.expression import func, or_, and_
import re


def filter_contaminants(filters, query: Query):

    if filters["elements"] is not None:  # look for elements in chemical_formula
        for elem in filters["elements"]:
            query = query.filter(Contaminant.chemical_formula.contains(elem))

    if filters["hazards"] and len(filters["hazards"]) > 0:
        query = query.join(
            Hazard,
            and_(Contaminant.hazards, Hazard.hazard_type.in_(filters["hazards"])),
        ).group_by(Contaminant.id)

    if filters["molecularWeight"] is not None:
        if filters["greaterThanMV"] == "true":
            query = query.filter(
                Contaminant.molecular_weight >= filters["molecularWeight"]
            )
        else:
            query = query.filter(
                Contaminant.molecular_weight < filters["molecularWeight"]
            )

    if filters["meltingPoint"] is not None:
        if filters["greaterThanMP"] == "true":
            query = query.filter(
                Contaminant.melting_point >= float(filters["meltingPoint"])
            )
        else:
            query = query.filter(
                Contaminant.melting_point < float(filters["meltingPoint"])
            )

    return query


def sort_contaminants(sort, query: Query):

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
        field = Contaminant.name
    elif sort == "Molecular Weight" or sort == "-Molecular Weight":
        field = Contaminant.molecular_weight
    else:
        return query

    # Ascending vs. Descending case
    if dsc:
        return query.order_by(field.desc())
    else:
        return query.order_by(field)


def search_contaminants(q, query: Query):
    # sort by CAS, filter by BP
    # Default case
    if q == None:
        return query
    else:
        q = q[0][0]
        q = q.strip()

    terms = map(lambda term: term.lower().strip(), q.split())

    searches = []
    for term in terms:
        searches.append(func.lower(Contaminant.name).contains(term))
        searches.append(func.lower(Contaminant.chemical_formula).contains(term))
        searches.append(func.lower(Contaminant.cas_num).contains(term))
        searches.append(func.lower(Contaminant.boiling_point).contains(term))

        try:
            searches.append(Contaminant.molecular_weight.in_([float(term)]))
        except ValueError:
            pass

        try:
            searches.append(Contaminant.melting_point.in_([float(term)]))
        except ValueError:
            pass

    query = query.filter(or_(*tuple(searches)))

    return query


# UPDATE contaminants
# SET melting_point = REPLACE(melting_point, ' Â°C', '');

# ALTER TABLE contaminant
# ALTER COLUMN melting_point SET DATA TYPE double precision USING melting_point::double precision;
