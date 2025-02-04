import time
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager

class TestCarCategoryDisplay(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Correct way to initialize WebDriver using Service class
        service = Service(ChromeDriverManager().install())
        cls.driver = webdriver.Chrome(service=service)
        cls.driver.maximize_window()

    def setUp(self):
        self.driver.get("http://localhost:5173")  # Replace with the actual URL where your React app is running
        time.sleep(20)  # Wait for the page to load

    def test_category_display(self):
        # Test that when you toggle categories, cars are displayed correctly.
        
        # Test for SUVs category
        suv_category_button = self.driver.find_element(By.XPATH, "//button[text()='SUVs']")
        suv_category_button.click()
        time.sleep(3)  # Wait for cars to load

        # Check if SUVs cars are displayed
        suv_cars = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'relative') and //img]")
        self.assertGreater(len(suv_cars), 0, "No cars displayed under SUVs category.")

        # Test for Sedans category
        sedan_category_button = self.driver.find_element(By.XPATH, "//button[text()='Sedans']")
        sedan_category_button.click()
        time.sleep(3)  # Wait for cars to load

        # Check if Sedans cars are displayed
        sedan_cars = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'relative') and //img]")
        self.assertGreater(len(sedan_cars), 0, "No cars displayed under Sedans category.")
        
        # Test for Luxury category
        luxury_category_button = self.driver.find_element(By.XPATH, "//button[text()='Luxury']")
        luxury_category_button.click()
        time.sleep(3)  # Wait for cars to load

        # Check if Luxury cars are displayed
        luxury_cars = self.driver.find_elements(By.XPATH, "//div[contains(@class, 'relative') and //img]")
        self.assertGreater(len(luxury_cars), 0, "No cars displayed under Luxury category.")

        # Test for an empty category (e.g., Hatchbacks, assuming no cars are there)
        hatchback_category_button = self.driver.find_element(By.XPATH, "//button[text()='Hatchbacks']")
        hatchback_category_button.click()
        time.sleep(3)  # Wait for cars to load

        # Check if no cars are displayed (Empty category scenario)
        empty_category_message = self.driver.find_element(By.XPATH, "//div[contains(text(), 'No cars available in this category.')]")
        self.assertTrue(empty_category_message.is_displayed(), "The 'No cars available' message should be visible.")

    def tearDown(self):
        # Clear any cookies and close the browser after each test
        self.driver.delete_all_cookies()

    @classmethod
    def tearDownClass(cls):
        # Close the browser window after all tests are done
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
