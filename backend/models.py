from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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

# Create Hazard table
class Hazard(db.Model):
    __tablename__ = "hazard"
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
    __tablename__ = "hazard_statement"
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
    __tablename__ = "contaminant_use"
    id = db.Column(db.Integer(), primary_key=True)
    use = db.Column(db.String())
    contaminant_id = db.Column(
        db.Integer(), db.ForeignKey("contaminant.id", ondelete="CASCADE")
    )

    def __init__(self, id=-1, use=""):
        self.id = id
        self.use = use


# Define Contaminant table
class Contaminant(db.Model):
    __tablename__ = "contaminant"
    id = db.Column(db.Integer(), primary_key=True)
    pubchem_id = db.Column(db.Integer())
    name = db.Column(db.String())
    description = db.Column(db.String())
    cas_num = db.Column(db.String())
    molecular_weight = db.Column(db.Float())
    chemical_formula = db.Column(db.String())
    density = db.Column(db.String())
    boiling_point = db.Column(db.String())
    melting_point = db.Column(db.Float())
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
        melting_point=0.0,
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


# Define SuperfundSite table
class SuperfundSite(db.Model):
    __tablename__ = "superfund_site"
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
    __tablename__ = "city"
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
