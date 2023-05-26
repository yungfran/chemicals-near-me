from unittest import main, TestCase
import requests


class UnitTests(TestCase):
    def test_always_right(self):
        self.assertEqual(1, 1)

    # cities
    def test_num_cities_per_page(self):
        response = requests.get("https://api.chemicalsnear.me/cities")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["cities"]), 12)

    def test_num_all_cities(self):
        response = requests.get(
            "https://api.chemicalsnear.me/cities?page=1&per_page=152"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["cities"]), 152)

    def test_name_from_city_id(self):
        response = requests.get("https://api.chemicalsnear.me/cities/583")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "NIAGARA FALLS")

    def test_num_contaminants_from_city_id(self):
        response = requests.get("https://api.chemicalsnear.me/cities/108")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["contaminants"]), 35)

    def test_num_superfunds_from_city_id(self):
        response = requests.get("https://api.chemicalsnear.me/cities/29")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["superfund_sites"]), 1)

    def test_filtering_cities_by_population_and_disability(self):
        response = requests.get(
            "https://api.chemicalsnear.me/cities?population=2000000&greaterThan_population=true&greaterThan_disability=false&disability=19"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["num_results"], 2)

    def test_filtering_cities_by_median_household_income(self):
        response = requests.get(
            "https://api.chemicalsnear.me/cities?greaterThan_income=false&income=36464"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["num_results"], 16)

    def test_sorting_cities_in_alphabetical_order(self):
        response = requests.get("https://api.chemicalsnear.me/cities?sort=Alphabetical")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["cities"][0]["name"], "ABERDEEN")

    def test_sorting_cities_by_descending_population(self):
        response = requests.get("https://api.chemicalsnear.me/cities?sort=-Population")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["cities"][0]["population"], 2709534)

    # superfund sites
    def test_num_superfunds_per_page(self):
        response = requests.get("https://api.chemicalsnear.me/superfunds")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["superfunds"]), 12)

    def test_num_all_superfunds(self):
        response = requests.get(
            "https://api.chemicalsnear.me/superfunds?page=1&per_page=189"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["superfunds"]), 189)

    def test_name_from_superfund_id(self):
        response = requests.get("https://api.chemicalsnear.me/superfunds/520")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "NORTHSIDE LANDFILL")

    def test_city_from_superfund_id(self):
        response = requests.get("https://api.chemicalsnear.me/superfunds/89")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["city_name"], "CLERMONT")

    def test_num_contaminants_from_superfund_id(self):
        response = requests.get("https://api.chemicalsnear.me/superfunds/335")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["num_chem"], "23")

    def test_filtering_superfunds_by_npl_stats_and_state(self):
        response = requests.get(
            "https://api.chemicalsnear.me/superfunds?npl_status=Currently+on+the+Final+NPL&state=WASHINGTON"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["num_results"], 14)

    def test_filtering_superfunds_by_city_and_county(self):
        response = requests.get(
            "https://api.chemicalsnear.me/superfunds?city=SPOKANE&county=SPOKANE"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["num_results"], 3)

    def test_sorting_superfunds_in_alphabetical_order(self):
        response = requests.get(
            "https://api.chemicalsnear.me/superfunds?sort=-Alphabetical"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["superfunds"][0]["name"], "YUMA MARINE CORPS AIR STATION")

    def test_sorting_superfunds_by_descending_contaminants(self):
        response = requests.get(
            "https://api.chemicalsnear.me/superfunds?sort=-num+of+Contaminants"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["superfunds"][0]["num_chem"], "85")

    # contaminants
    def test_num_contaminants_per_page(self):
        response = requests.get("https://api.chemicalsnear.me/contaminants")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["contaminants"]), 12)

    def test_num_all_contaminants(self):
        response = requests.get(
            "https://api.chemicalsnear.me/contaminants?page=1&per_page=118"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["contaminants"]), 118)

    def test_name_from_contaminant_id(self):
        response = requests.get("https://api.chemicalsnear.me/contaminants/44")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "1,3,5-TRINITROBENZENE")

    def test_description_from_contaminant_id(self):
        response = requests.get("https://api.chemicalsnear.me/contaminants/190")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(
            data["description"],
            "Benzoyl chloride appears as a colorless fuming liquid with a pungent odor. Flash point 162Â°F. Lachrymator, irritating to skin and eyes. Corrosive to metals and tissue. Density 10.2 lb / gal. Used in medicine and in the manufacture of other chemicals.",
        )

    def test_num_cities_from_contaminant_id(self):
        response = requests.get("https://api.chemicalsnear.me/contaminants/0")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["cities"]), 10)

    def test_filtering_contaminants_by_melting_point_and_weight(self):
        response = requests.get(
            "https://api.chemicalsnear.me/contaminants?greaterThan_meltingPoint=false&meltingPoint=-126&molecularWeight=16&greaterThan_molecularWeight=true"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["num_results"], 4)

    def test_filtering_contaminants_by_elements(self):
        response = requests.get("https://api.chemicalsnear.me/contaminants?elements=H")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["num_results"], 111)

    def test_sorting_contaminants_in_alphabetical_order(self):
        response = requests.get(
            "https://api.chemicalsnear.me/contaminants?sort=Alphabetical"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["contaminants"][0]["name"], "1,1,1-TRICHLOROETHANE")

    def test_sorting_contaminants_by_descending_weight(self):
        response = requests.get(
            "https://api.chemicalsnear.me/contaminants/?sort=-Molecular+Weight"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["contaminants"][0]["molecular_weight"], 390.6)


if __name__ == "__main__":
    main()
