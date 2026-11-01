"""posts/*.md 를 복붙용 HTML 페이지 하나로 만든다.
사용: python3 tools/build_copy_page.py <출력.html>
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ORDER = ["goesan-mungwang-ginkgo", "gyeonggi-chonkangs-best10", "osaka-usj-express-pass"]
TABS = {"goesan-mungwang-ginkgo": "괴산 문광저수지",
        "gyeonggi-chonkangs-best10": "경기도 촌캉스",
        "osaka-usj-express-pass": "오사카 USJ"}

def parse(md):
    notes = "\n".join(l[1:].strip() for l in md.split("## 제목 후보")[0].splitlines() if l.startswith(">"))
    tsec = md.split("## 제목 후보", 1)[1].split("\n---", 1)[0]
    titles = [re.sub(r"^\d+\.\s*", "", l).strip() for l in tsec.splitlines() if re.match(r"^\d+\.", l)]
    tip = "\n".join(l[1:].strip() for l in tsec.splitlines() if l.startswith(">"))
    body = md.split("## 본문", 1)[1].strip()
    return dict(notes=notes, titles=titles, tip=tip, body=body)

posts = []
for slug in ORDER:
    p = ROOT / "posts" / f"{slug}.md"
    if p.exists():
        d = parse(p.read_text(encoding="utf-8")); d.update(slug=slug, tab=TABS[slug]); posts.append(d)

tpl = (ROOT / "tools" / "copy_page_template.html").read_text(encoding="utf-8")
out = tpl.replace("/*__POSTS__*/[]", json.dumps(posts, ensure_ascii=False).replace("</", "<\\/"))
pathlib.Path(sys.argv[1]).write_text(out, encoding="utf-8")
print("posts:", [p["slug"] for p in posts])
