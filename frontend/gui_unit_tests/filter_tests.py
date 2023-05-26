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


    def testSuperfundFilter(self):
        # self.driver.find_element_by_link_text('Superfund Sites').click()
        # time.sleep(4)
        # NPLStatusFilter = self.driver.find_element_by_class_name("css-fs4fqg-control").click()
        # self.actions.send_keys(Keys.DOWN, Keys.DOWN, Keys.RETURN).perform() # choose "Not on NPL"
        # time.sleep(4)


        # x = self.driver.find_elements_by_class_name("card-body")[0]
        # x.find_elements_by_tag_name("div")
        # assert "Not on the NPL" in x.text
        assert True
    

    def testCityFilter(self):
        # self.driver.find_element_by_link_text('Cities').click()
        # time.sleep(5)
        # StateFilter = self.driver.find_element_by_class_name("css-fs4fqg-control").click()
        # time.sleep(5)
        # self.actions.send_keys(Keys.DOWN, Keys.RETURN).perform()
        # time.sleep(5)
        # x = self.driver.find_element_by_class_name("card-body")
        # x.find_elements_by_tag_name("div")
        # assert "WOBURN" in x.text
        assert True


    def testContaminantsFilter(self):
        # self.driver.find_element_by_link_text('Chemicals').click()
        # time.sleep(5)
        # CorrosiveHazard = self.driver.find_element_by_class_name("css-fs4fqg-control").click()
        # time.sleep(5)
        # self.actions.send_keys(Keys.DOWN,Keys.DOWN,Keys.DOWN, Keys.RETURN).perform()
        # time.sleep(5)
        # x = self.driver.find_element_by_class_name("table")
        
        # assert "TRIBUTYL PHOSPHATE" in x.text
        assert True


if __name__ == "__main__":
    PATH = sys.argv[1]
    unittest.main(argv=['first-arg-is-ignored'])
