from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Initialize the WebDriver
driver_path = 'D:/Projects/FlightRoster/FrontendTestCases/chromedriver.exe'
options = Options()
options.headless = False
service = Service(driver_path)
driver = webdriver.Chrome(service=service, options=options)

try:
    # Navigate to the Plane View page
    driver.get("http://localhost:3000/plane-view/ABC123")  # Adjust URL to your app's Plane View page
    time.sleep(10)
    # Wait for the page to load
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))

    # Verify the presence of key elements
    assert "Plane View - Seat Map" in driver.page_source

    # Interact with the seat elements
    seats = driver.find_elements(By.CLASS_NAME, "seat")
    if not seats:
        raise Exception("No seats found on the page")

    # Hover over a seat to check if passenger info appears
    for seat in seats:
        seat_id = seat.text
        driver.execute_script("arguments[0].scrollIntoView(true);", seat)
        webdriver.ActionChains(driver).move_to_element(seat).perform()
        time.sleep(1)  # Wait for hover info to appear

        hover_info = driver.find_elements(By.CLASS_NAME, "hover-info")
        if hover_info:
            print(f"Hover info displayed for seat {seat_id}")
            break
    else:
        raise Exception("No hover info displayed for any seat")

    print("Plane View test passed.")
except Exception as e:
    print(f"Plane View test failed: {e}")
finally:
    driver.quit()
