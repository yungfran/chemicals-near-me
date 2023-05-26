from flask_marshmallow import Marshmallow
from marshmallow import fields

mm = Marshmallow()

# declare various superfund site schemas
class SuperfundSiteSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    epa_id = fields.String(required=True)
    name = fields.String(required=True)
    site_id = fields.String(required=True)
    npl_status = fields.String(required=True)
    num_chem = fields.String(required=True)
    city_name = fields.String(required=True)
    state = fields.String(required=True)
    county = fields.String(required=True)
    zipcode = fields.String(required=True)
    federal_facility = fields.String(required=True)
    longitude = fields.Float(required=True)
    latitude = fields.Float(required=True)
    image_url = fields.String(required=True)
    city_id = fields.Integer(required=True)

    contaminants = fields.List(fields.Nested(lambda: ContaminantMinSchema))


class SuperfundSiteInstanceSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    name = fields.String(required=True)
    npl_status = fields.String(required=True)
    num_chem = fields.String(required=True)
    city_name = fields.String(required=True)
    state = fields.String(required=True)
    county = fields.String(required=True)
    image_url = fields.String(required=True)
    city_id = fields.Integer(required=True)


class SuperfundSiteMinSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    name = fields.String(required=True)


# declare various contaminant schemas
class HazardSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    hazard_type = fields.String(required=True)
    contaminant_id = fields.Integer(required=True)


class HazardStatementSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    statement = fields.String(required=True)
    contaminant_id = fields.Integer(required=True)


class ContaminantUseSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    use = fields.String(required=True)
    contaminant_id = fields.Integer(required=True)


class ContaminantSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    pubchem_id = fields.Integer(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)
    cas_num = fields.String(required=True)
    molecular_weight = fields.Float(required=True)
    chemical_formula = fields.String(required=True)
    density = fields.String(required=True)
    boiling_point = fields.String(required=True)
    melting_point = fields.String(required=True)
    pubchem_url = fields.String(required=True)
    diagram_url = fields.String(required=True)

    hazards = fields.List(fields.Nested(HazardSchema))
    hazard_statements = fields.List(fields.Nested(HazardStatementSchema))
    uses = fields.List(fields.Nested(ContaminantUseSchema))

    superfund_sites = fields.List(fields.Nested(SuperfundSiteMinSchema))
    cities = fields.List(fields.Nested(lambda: CityMinSchema))


class ContaminantInstanceSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    name = fields.String(required=True)
    cas_num = fields.String(required=True)
    molecular_weight = fields.Float(required=True)
    chemical_formula = fields.String(required=True)
    boiling_point = fields.String(required=True)
    melting_point = fields.String(required=True)
    diagram_url = fields.String(required=True)

    hazards = fields.List(fields.Nested(HazardSchema))


class ContaminantMinSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    name = fields.String(required=True)


class CitySchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    name = fields.String(required=True)
    county = fields.String(required=True)
    state = fields.String(required=True)
    population = fields.Integer(required=True)
    disability = fields.Float(required=True)
    no_health_insurance = fields.Float(required=True)
    median_household_income = fields.Integer(required=True)
    longitude = fields.Float(required=True)
    latitude = fields.Float(required=True)
    image_url = fields.String(required=True)
    map_url = fields.String(required=True)

    superfund_sites = fields.List(fields.Nested(SuperfundSiteMinSchema))
    contaminants = fields.List(fields.Nested(ContaminantMinSchema))


class CityInstanceSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    name = fields.String(required=True)
    population = fields.Integer(required=True)
    disability = fields.Float(required=True)
    no_health_insurance = fields.Float(required=True)
    median_household_income = fields.Integer(required=True)
    image_url = fields.String(required=True)
    state = fields.String(required=True)


class CityMinSchema(mm.Schema):
    class Meta:
        ordered = True

    id = fields.Integer(required=True)
    name = fields.String(required=True)
    state = fields.String(required=True)
