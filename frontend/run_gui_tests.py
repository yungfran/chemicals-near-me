import os
from sys import platform

if __name__ == "__main__":
    if platform == "win32":
        PATH = "./frontend/gui_unit_tests/chromedriver_win.exe"
    elif platform == "linux":
        PATH = "./frontend/gui_unit_tests/chromedriver_linux"
    elif platform == "darwin": #darwin is mac
        PATH = "./frontend/gui_unit_tests/chromedriver_mac"
    else:
        print("Unsupported OS")
        exit(-1)

    # Run all of the GUI tests
    os.system("python ./frontend/gui_unit_tests/navbar_unit_tests.py " + PATH)
    os.system("python ./frontend/gui_unit_tests/model_info_tests.py " + PATH)
    os.system("python ./frontend/gui_unit_tests/filter_tests.py " + PATH)
    os.system("python ./frontend/gui_unit_tests/search_tests.py " + PATH)
    os.system("python ./frontend/gui_unit_tests/sort_tests.py " + PATH)
