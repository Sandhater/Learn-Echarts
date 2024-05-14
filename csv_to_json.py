import csv
import json
import argparse


parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True, help='The path of the source CSV file')
parser.add_argument('--target', required=True, help='The path of the target JSON file')
parser.add_argument('--delimiter', default=',', help='The delimiter of the CSV file')
parser.add_argument('--new-line', default='', help='The mark of a new line in the CSV file')
parser.add_argument
args = parser.parse_args()


def csv_to_json(csv_file, json_file, delimiter, new_line):
    data = []
    with open(csv_file, 'r', newline=new_line, encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=delimiter)
        for row in reader:
            data.append(row)

    with open(json_file, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=4)


if __name__ == '__main__':
    csv_to_json(args.source, args.target, args.delimiter, args.new_line)