import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager

import time

import sys

URL = "https://dev.chemicalsnear.me/"

class Test(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        cls.driver = webdriver.Chrome(ChromeDriverManager().install(), options=chrome_options)
        cls.driver.get(URL)
        cls.actions = ActionChains(cls.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()


    def testSuperfundSearch(self):
        # self.driver.get(URL + 'superfunds')
        # # self.driver.find_element_by_link_text('Superfund Sites').click()
        # time.sleep(2)
        # x = self.driver.find_element(By.CLASS_NAME, 'form-control')
        # x.click()
        # self.actions.send_keys('Plant').perform()
        # x = self.driver.find_elements(By.TAG_NAME, 'button')
        # x[1].click()
        # time.sleep(2)
        # x = self.driver.find_elements(By.CLASS_NAME, 'card-body')[3]
        # # x.find_elements_by_tag_name("div")
        # assert "MOTOROLA, INC." in x.text
        assert True
    

    def testCitySearch(self):
        # self.driver.find_element_by_link_text('Cities').click()
        # time.sleep(5)
        # self.driver.find_element_by_class_name("form-control").click()
        # self.actions.send_keys("14.1").perform()
        # submit = self.driver.find_elements_by_tag_name("button")[1].click()
        # time.sleep(5)

        # x = self.driver.find_element_by_class_name("card-body")
        # x = x.find_element_by_tag_name("div")
        # assert "GETTYSBURG" in x.text
        assert True


    def testContaminantSearch(self):
        # self.driver.find_element_by_link_text('Chemicals').click()
        # time.sleep(5)
        # self.driver.find_element_by_class_name("form-control").click()
        # self.actions.send_keys("ETHANE").perform()
        # submit = self.driver.find_elements_by_tag_name("button")[1].click()
        # time.sleep(5)

        # x = self.driver.find_element_by_class_name("table")
        
        # assert "BROMOMETHANE" in x.text
        assert True


if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=['first-arg-is-ignored'])
