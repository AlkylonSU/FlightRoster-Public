from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Initialize the WebDriver (Assuming Chrome, adjust as necessary for other browsers)
driver_path = 'D:/Projects/FlightRoster/FrontendTestCases/chromedriver.exe'

# Initialize Chrome options
options = Options()
options.headless = False  # Set to True if you want to run in headless mode

# Initialize the ChromeDriver service with the correct path
service = Service(driver_path)

# Initialize the WebDriver with the service and options
driver = webdriver.Chrome(service=service, options=options)

try:
    # Navigate to the Create Flight page
    driver.get("http://localhost:3000/create-flight")  # Adjust URL to your app's Create Flight page

    # Wait for the form to load
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))

    # Fill out the form
    driver.find_element(By.ID, "flight_number").send_keys("FL123")

    # Adjusting the flight date format to 12-hour format with AM/PM selection
    date_input = driver.find_element(By.ID, "flight_date")
    driver.execute_script("arguments[0].removeAttribute('readonly')", date_input)
    date_input.clear()
    date_input.send_keys("15-06-002024T10:00AM")

    driver.find_element(By.ID, "flight_duration").send_keys("03:45")
    driver.find_element(By.ID, "flight_distance").send_keys("1234")

    # Wait for the country options to be loaded
    wait.until(EC.presence_of_element_located((By.XPATH, "//option[text()='United States']")))
    Select(driver.find_element(By.ID, "source_country")).select_by_visible_text("United States")
    wait.until(EC.presence_of_element_located((By.XPATH, "//option[text()='New York']")))
    Select(driver.find_element(By.ID, "source_city")).select_by_visible_text("New York")
    wait.until(EC.presence_of_element_located((By.XPATH, "//option[text()='John F. Kennedy International Airport']")))
    Select(driver.find_element(By.ID, "source_airport_name")).select_by_visible_text("John F. Kennedy International Airport")
    Select(driver.find_element(By.ID, "source_airport_code")).select_by_visible_text("JFK")

    # Wait for the destination country options to be loaded
    wait.until(EC.presence_of_element_located((By.XPATH, "//option[text()='France']")))
    Select(driver.find_element(By.ID, "destination_country")).select_by_visible_text("France")
    wait.until(EC.presence_of_element_located((By.XPATH, "//option[text()='Paris']")))
    Select(driver.find_element(By.ID, "destination_city")).select_by_visible_text("Paris")
    wait.until(EC.presence_of_element_located((By.XPATH, "//option[text()='Charles de Gaulle Airport']")))
    Select(driver.find_element(By.ID, "destination_airport_name")).select_by_visible_text("Charles de Gaulle Airport")
    Select(driver.find_element(By.ID, "destination_airport_code")).select_by_visible_text("CDG")

    Select(driver.find_element(By.ID, "vehicle_type")).select_by_visible_text("Boeing 737")

    # Check the shared flight checkbox
    shared_flight_checkbox = driver.find_element(By.NAME, "shared_flight")
    if not shared_flight_checkbox.is_selected():
        shared_flight_checkbox.click()

    # Wait until the button is clickable and use JavaScript to submit the form
    submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
    wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']")))
    driver.execute_script("arguments[0].click();", submit_button)

    # Wait for navigation to the next page or a success message
    wait.until(EC.url_contains("select-flight"))

    # Verify the submission was successful
    assert "select-flight" in driver.current_url
    print("Test Passed: Flight creation form submitted successfully.")

except Exception as e:
    print(f"Test Failed: {e}")

finally:
    # Close the browser
    driver.quit()
