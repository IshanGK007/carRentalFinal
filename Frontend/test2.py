import time
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager

class TestAdminDashboard(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Initialize WebDriver using Service class
        service = Service(ChromeDriverManager().install())
        cls.driver = webdriver.Chrome(service=service)
        cls.driver.maximize_window()

    def setUp(self):
        # Assuming the admin dashboard is running locally
        self.driver.get("http://localhost:5173/AdminQueryPage")  # Update with correct URL if needed
        time.sleep(2)  # Wait for the page to load

    def test_display_queries(self):
        # Test if queries are being displayed correctly
        
        # Ensure that the query list container is present
        queries_container = self.driver.find_element(By.XPATH, "//ul[contains(@class, 'space-y-6')]")
        self.assertTrue(queries_container.is_displayed(), "Queries container is not displayed")

        # Check if there is at least one query
        queries = self.driver.find_elements(By.XPATH, "//li[contains(@class, 'p-4 bg-gray-50')]")
        self.assertGreater(len(queries), 0, "No queries are displayed.")

    def test_search_queries(self):
        # Test search functionality
        
        search_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Search queries...']")
        search_input.clear()
        search_input.send_keys("query text")  # Replace with an actual query term to search for
        search_input.send_keys(Keys.RETURN)
        time.sleep(2)  # Wait for results to update

        # Verify that the search term is being applied in the displayed queries
        queries = self.driver.find_elements(By.XPATH, "//li[contains(@class, 'p-4 bg-gray-50')]")
        for query in queries:
            message = query.find_element(By.XPATH, ".//div[contains(text(),'Message:')]").text
            self.assertIn("query text", message.lower(), "Search term not found in query message")

    def test_sort_queries(self):
        # Test sorting functionality for 'Created At' and 'Answered' fields

        # Test Sort By 'Date' (Created At)
        sort_by_dropdown = self.driver.find_element(By.XPATH, "//select[@value='createdAt']")
        sort_by_dropdown.click()
        time.sleep(1)

        # Test Sort By 'Status' (Answered / Pending)
        sort_by_dropdown = self.driver.find_element(By.XPATH, "//select[@value='answered']")
        sort_by_dropdown.click()
        time.sleep(1)

        # Verify if queries are sorted as expected
        queries = self.driver.find_elements(By.XPATH, "//li[contains(@class, 'p-4 bg-gray-50')]")
        self.assertGreater(len(queries), 0, "No queries displayed after sorting")

    def test_mark_as_answered(self):
        # Test Mark as Answered functionality
        
        # Find the first unanswered query
        unanswered_query = self.driver.find_element(By.XPATH, "//li[contains(@class, 'p-4 bg-gray-50')]")
        mark_as_answered_button = unanswered_query.find_element(By.XPATH, "//button[contains(text(),'Mark as Answered')]")
        textarea = unanswered_query.find_element(By.XPATH, "//textarea")
        
        # Enter response in textarea
        textarea.send_keys("This is an answer")
        
        # Click on Mark as Answered button
        mark_as_answered_button.click()
        time.sleep(2)  # Wait for the update to happen

        # Verify if the status is updated to "Answered"
        status_element = unanswered_query.find_element(By.XPATH, "//span[contains(text(),'Answered')]")
        self.assertTrue(status_element.is_displayed(), "Query was not marked as answered.")

    def tearDown(self):
        # Clear cookies after each test
        self.driver.delete_all_cookies()

    @classmethod
    def tearDownClass(cls):
        # Close the WebDriver after all tests
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
