# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %%
from essential_generators import DocumentGenerator, MarkovWordGenerator, MarkovTextGenerator
import random
import json
import urllib.parse
import os
import glob


# %%
def make_wordgen_model(corpus="corpus.txt", output="markov_wordgen.json"):
    with open(corpus, 'r', encoding='utf-8') as fp:
        set4 = fp.read()

    gen = MarkovWordGenerator(load_model=False)
    gen.train(set4)
    gen.save_model(output)


def make_textgen_model(corpus="corpus.txt", output='markov_textgen.json'):
    with open(corpus, 'r', encoding='utf-8') as fp:
        set4 = fp.read()

    gen = MarkovTextGenerator(load_model=False)
    gen.train(set4)
    gen.save_model(output)


# %%
make_wordgen_model()
make_textgen_model()


# %%
def cleanup(s: str):
    return s.replace(' \n', '\n').replace('\n', '. ').replace('..', '.').replace('  ', ' ')


def get_slug(s: str):
    return s.lower().replace('.', '').replace(' ', '-')


def get_site_url(site: str, title: str):
    return f'http://{site}/{urllib.parse.quote(get_slug(title))}.html'


# %%
class Page:
    def __init__(self, title: str, body: str, links: list):
        self.title = title
        self.body = body
        self.links = links

    def set_parent_site(self, site: str):
        self.parent_site = site
        self.slug = get_slug(self.title)
        self.site_url = get_site_url(site, self.title)

    def to_dict(self):
        return {
            'title': self.title,
            'body': self.body,
            'links': self.links,
            'parent_site': self.parent_site,
            'site_url': self.site_url,
            'link_urls': self.link_urls,
            'slug': self.slug
        }


# %%
# Config block
SITE_COUNT = 10
MAX_LINKS_PER_PAGE = 5
parent_sites = [
    'site1.adsa-project.local',
    'site2.adsa-project.local',
    'site3.adsa-project.local'
]


# %%
g = DocumentGenerator(text_generator=MarkovTextGenerator(model='markov_textgen.json'))

# Generate page objects
pages = []
for i in range(SITE_COUNT):
    page = Page(
        title=cleanup(g.gen_sentence(3, 6)).title(),
        body=cleanup(
            '. '.join([
                g.gen_sentence(5, 15) for _ in range(random.randint(20, 30))
            ])
        ),
        links=[
            random.randint(0, SITE_COUNT - 1)
            for _ in range(0, random.randint(0, MAX_LINKS_PER_PAGE))
        ]
    )
    pages.append(page)

# Map pages to parent sites
for page in pages:
    parent_site = parent_sites[random.randint(0, 2)]
    page.set_parent_site(parent_site)

# Map page links to site urls
for page in pages:
    page.link_urls = [pages[i].site_url for i in page.links]

# Write out site data json
open('site_data.json', 'w').write(
    '[' + ', '.join([json.dumps(page.to_dict()) for page in pages]) + ']'
)

# Remove old generated files
old_files = glob.glob('site/pages/*.html')
for file in old_files:
    os.remove(file)

# Write index.html
index_content = f'''
<html>
<body>
{'<br/>'.join([f'<a href="{page.site_url}">{page.title}</a>' for page in pages])}
</body>
</html>
'''
with open('site/pages/index.html', 'w') as fp:
    fp.write(index_content)

# Write all other pages
for page in pages:
    links = f'''
    <aside>Related links:&nbsp;
    {' '.join([
    f'<a href="{url}">{i + 1}</a>' for (i, url) in enumerate(page.link_urls)
    ])}
    </aside>
    '''
    content = f'''
<html>
<head>
    <title>{page.title}</title>
</head>
<body>
    <h1>{page.title}</h1>
    <br/>
    <p>{page.body}</p>
    <br/>
    {links}
</body>
</html>
    '''
    with open(f'site/pages/{page.slug}.html', 'w') as fp:
        fp.write(content)


# %%