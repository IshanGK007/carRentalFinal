from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize WebDriver
driver = webdriver.Chrome()

try:
    # Open the application
    driver.get("http://localhost:5173/rental")  # Replace with your app's URL
    driver.maximize_window()

    # Wait for car listings to load
    WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "border.border-gray-300.rounded-md.p-4.bg-white.shadow-sm")))

    print("Starting Test: Mark cars as 'Available' or 'Not-Available'")

    # Locate a car card (for example, the first one)
    car_cards = driver.find_elements(By.CLASS_NAME, "border.border-gray-300.rounded-md.p-4.bg-white.shadow-sm")
    if not car_cards:
        raise Exception("No car cards found on the page.")

    # Test the first car card
    car_card = car_cards[0]

    # Locate the availability toggle button (assumed class `availability-toggle` for this example)
    availability_button = car_card.find_element(By.CLASS_NAME, "availability-toggle")

    # Get the initial status
    initial_status = availability_button.text
    print(f"Initial status of the car: {initial_status}")

    # Click the toggle button to change the status
    availability_button.click()

    # Wait for the status to change
    WebDriverWait(driver, 10).until(lambda d: availability_button.text != initial_status)

    # Verify the status has changed
    updated_status = availability_button.text
    print(f"Updated status of the car: {updated_status}")

    assert updated_status in ["Available", "Not-Available"], "Status did not change to a valid value."
    assert updated_status != initial_status, "Status did not toggle."

    print("Availability toggle functionality verified successfully.")

except Exception as e:
    print(f"An error occurred in the availability toggle test: {e}")

finally:
    driver.quit()
