import csv
import random

def randomize_csv_rows(file_path):
    # Read the CSV file
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        rows = list(reader)

    # Shuffle the rows randomly
    random.shuffle(rows)

    # Write the randomized rows back to the CSV file
    with open(file_path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(rows)

# Specify the path to your CSV file
csv_file_path = 'your_updated_file.csv'

# Call the function to randomize and rewrite the rows in the CSV file
randomize_csv_rows(csv_file_path)
