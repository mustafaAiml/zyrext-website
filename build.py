import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SECTIONS_DIR = os.path.join(BASE_DIR, 'sections')
OUTPUT_FILE = os.path.join(BASE_DIR, 'index.html')

PLACEHOLDERS = {
    '<!-- HEADER -->': 'header.html',
    '<!-- HOME -->': 'home.html',
    '<!-- JOURNEY -->': 'journey.html',
    '<!-- CAPABILITIES -->': 'capabilities.html',
    '<!-- CONNECT -->': 'connect.html',
}

TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ZyroX — AI Engineering Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- HEADER -->

  <!-- HOME -->

  <!-- JOURNEY -->

  <!-- CAPABILITIES -->

  <!-- CONNECT -->

  <script src="script.js"></script>
</body>
</html>
'''


def read_file(path):
    with open(path, 'r', encoding='utf-8') as file:
        return file.read()


def build_index():
    template = TEMPLATE

    for placeholder, filename in PLACEHOLDERS.items():
        section_path = os.path.join(SECTIONS_DIR, filename)
        if not os.path.exists(section_path):
            raise FileNotFoundError(f'Section file not found: {section_path}')
        template = template.replace(placeholder, read_file(section_path))

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as output_file:
        output_file.write(template)

    print('Build complete! Generated index.html')


if __name__ == '__main__':
    build_index()
